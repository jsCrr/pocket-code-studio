import { useState, useCallback } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileNode } from '@/components/FileTreeView';
import { Language } from '@/components/CodeEditor';
import { toast } from 'sonner';

const getLanguageFromExtension = (name: string): Language | undefined => {
  const ext = name.split('.').pop()?.toLowerCase();
  const langMap: Record<string, Language> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'sql': 'sql',
    'xml': 'xml',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'cpp',
    'rs': 'rust',
    'php': 'php',
  };
  return ext ? langMap[ext] : undefined;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export interface Project {
  id: string;
  name: string;
  path: string;
  lastOpened: string;
}

const PROJECTS_KEY = 'pocket-code-projects';
const CURRENT_PROJECT_KEY = 'pocket-code-current-project';

export const useFileSystem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentProjectPath, setCurrentProjectPath] = useState<string | null>(null);

  // Get saved projects from localStorage
  const getSavedProjects = useCallback((): Project[] => {
    try {
      const saved = localStorage.getItem(PROJECTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Save project to recent list
  const saveProjectToRecent = useCallback((project: Project) => {
    const projects = getSavedProjects();
    const filtered = projects.filter(p => p.path !== project.path);
    const updated = [{ ...project, lastOpened: new Date().toISOString() }, ...filtered].slice(0, 10);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  }, [getSavedProjects]);

  // Delete project from recent list
  const deleteProjectFromRecent = useCallback((projectPath: string) => {
    const projects = getSavedProjects();
    const updated = projects.filter(p => p.path !== projectPath);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  }, [getSavedProjects]);

  // Rename project in recent list
  const renameProjectInRecent = useCallback((projectPath: string, newName: string) => {
    const projects = getSavedProjects();
    const updated = projects.map(p => 
      p.path === projectPath ? { ...p, name: newName } : p
    );
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  }, [getSavedProjects]);

  // Create a new project folder (empty - no default files)
  const createProject = useCallback(async (projectName: string): Promise<{ path: string; files: FileNode[] } | null> => {
    setIsLoading(true);
    try {
      const projectPath = `PocketCodeStudio/${projectName}`;
      
      // Create project directory structure
      await Filesystem.mkdir({
        path: projectPath,
        directory: Directory.Documents,
        recursive: true
      });

      setCurrentProjectPath(projectPath);
      localStorage.setItem(CURRENT_PROJECT_KEY, projectPath);
      
      saveProjectToRecent({
        id: generateId(),
        name: projectName,
        path: projectPath,
        lastOpened: new Date().toISOString()
      });

      // Empty project - no default files
      const files: FileNode[] = [];

      toast.success(`Project "${projectName}" created`);
      return { path: projectPath, files };
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [saveProjectToRecent]);

  // Read directory recursively to build file tree
  const readDirectory = useCallback(async (path: string, directory: Directory = Directory.Documents): Promise<FileNode[]> => {
    try {
      const result = await Filesystem.readdir({
        path,
        directory
      });

      const nodes: FileNode[] = [];

      for (const file of result.files) {
        const filePath = `${path}/${file.name}`;
        
        if (file.type === 'directory') {
          const children = await readDirectory(filePath, directory);
          nodes.push({
            id: generateId(),
            name: file.name,
            type: 'folder',
            children
          });
        } else {
          try {
            const content = await Filesystem.readFile({
              path: filePath,
              directory,
              encoding: Encoding.UTF8
            });
            
            nodes.push({
              id: generateId(),
              name: file.name,
              type: 'file',
              language: getLanguageFromExtension(file.name),
              content: typeof content.data === 'string' ? content.data : ''
            });
          } catch {
            // Skip binary files or files that can't be read as text
            nodes.push({
              id: generateId(),
              name: file.name,
              type: 'file',
              language: getLanguageFromExtension(file.name),
              content: ''
            });
          }
        }
      }

      // Sort: folders first, then files
      return nodes.sort((a, b) => {
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Failed to read directory:', error);
      return [];
    }
  }, []);

  // Open an existing project
  const openProject = useCallback(async (projectPath: string): Promise<FileNode[] | null> => {
    setIsLoading(true);
    try {
      const files = await readDirectory(projectPath);
      
      setCurrentProjectPath(projectPath);
      localStorage.setItem(CURRENT_PROJECT_KEY, projectPath);
      
      const projectName = projectPath.split('/').pop() || 'Project';
      saveProjectToRecent({
        id: generateId(),
        name: projectName,
        path: projectPath,
        lastOpened: new Date().toISOString()
      });

      toast.success(`Opened "${projectName}"`);
      return files;
    } catch (error) {
      console.error('Failed to open project:', error);
      toast.error('Failed to open project');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [readDirectory, saveProjectToRecent]);

  // Save a file
  const saveFile = useCallback(async (relativePath: string, content: string): Promise<boolean> => {
    if (!currentProjectPath) return false;
    
    try {
      await Filesystem.writeFile({
        path: `${currentProjectPath}/${relativePath}`,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      return true;
    } catch (error) {
      console.error('Failed to save file:', error);
      toast.error('Failed to save file');
      return false;
    }
  }, [currentProjectPath]);

  // Create a new file
  const createFile = useCallback(async (relativePath: string, content: string = ''): Promise<boolean> => {
    if (!currentProjectPath) return false;
    
    try {
      await Filesystem.writeFile({
        path: `${currentProjectPath}/${relativePath}`,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      return true;
    } catch (error) {
      console.error('Failed to create file:', error);
      toast.error('Failed to create file');
      return false;
    }
  }, [currentProjectPath]);

  // Create a new folder
  const createFolder = useCallback(async (relativePath: string): Promise<boolean> => {
    if (!currentProjectPath) return false;
    
    try {
      await Filesystem.mkdir({
        path: `${currentProjectPath}/${relativePath}`,
        directory: Directory.Documents,
        recursive: true
      });
      return true;
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error('Failed to create folder');
      return false;
    }
  }, [currentProjectPath]);

  // Delete a file or folder
  const deleteItem = useCallback(async (relativePath: string): Promise<boolean> => {
    if (!currentProjectPath) return false;
    
    try {
      await Filesystem.deleteFile({
        path: `${currentProjectPath}/${relativePath}`,
        directory: Directory.Documents
      });
      return true;
    } catch {
      // Try deleting as directory
      try {
        await Filesystem.rmdir({
          path: `${currentProjectPath}/${relativePath}`,
          directory: Directory.Documents,
          recursive: true
        });
        return true;
      } catch (error) {
        console.error('Failed to delete:', error);
        toast.error('Failed to delete');
        return false;
      }
    }
  }, [currentProjectPath]);

  // Check if we're running in Capacitor
  const isNative = useCallback(() => {
    return typeof (window as any).Capacitor !== 'undefined';
  }, []);

  return {
    isLoading,
    currentProjectPath,
    getSavedProjects,
    createProject,
    openProject,
    saveFile,
    createFile,
    createFolder,
    deleteItem,
    deleteProjectFromRecent,
    renameProjectInRecent,
    isNative
  };
};
