import { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileText, FileJson, FolderPlus, FilePlus, Download, Trash2, X, Check, MoreHorizontal, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Language } from './CodeEditor';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: Language;
  children?: FileNode[];
  content?: string;
}

interface FileTreeViewProps {
  files: FileNode[];
  projectName?: string;
  selectedFileId?: string;
  onFileSelect: (file: FileNode) => void;
  onFilesChange: (files: FileNode[]) => void;
  onDownloadFile: (file: FileNode) => void;
  onDownloadProject: () => void;
  onRenameProject?: (newName: string) => void;
}

const getFileIcon = (name: string, language?: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'py':
    case 'java':
    case 'cpp':
    case 'c':
    case 'rs':
    case 'php':
      return <FileCode className="w-4 h-4 text-syntax-function" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-warning" />;
    case 'html':
    case 'xml':
      return <FileCode className="w-4 h-4 text-destructive" />;
    case 'css':
    case 'scss':
      return <FileCode className="w-4 h-4 text-accent" />;
    case 'md':
      return <FileText className="w-4 h-4 text-muted-foreground" />;
    case 'sql':
      return <FileCode className="w-4 h-4 text-primary" />;
    default:
      return <FileText className="w-4 h-4 text-muted-foreground" />;
  }
};

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


interface TreeNodeProps {
  node: FileNode;
  depth: number;
  selectedFileId?: string;
  onFileSelect: (file: FileNode) => void;
  onAddFile: (parentId: string, type: 'file' | 'folder') => void;
  onDeleteNode: (nodeId: string) => void;
  onDownloadFile: (file: FileNode) => void;
  onRenameNode: (nodeId: string, newName: string) => void;
  pendingNewItem: { parentId: string; type: 'file' | 'folder' } | null;
  onConfirmNew: (name: string) => void;
  onCancelNew: () => void;
}

const TreeNode = ({ 
  node, 
  depth, 
  selectedFileId, 
  onFileSelect, 
  onAddFile, 
  onDeleteNode, 
  onDownloadFile,
  onRenameNode,
  pendingNewItem,
  onConfirmNew,
  onCancelNew,
}: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const isFolder = node.type === 'folder';
  const isSelected = node.id === selectedFileId;
  const showNewItemInput = pendingNewItem?.parentId === node.id;

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node);
    }
  };

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue !== node.name) {
      onRenameNode(node.id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div>
      <div className="group flex items-center">
        {isRenaming ? (
          <div className="flex-1 flex items-center gap-1 px-2 py-1" style={{ paddingLeft: `${depth * 12 + 8}px` }}>
            {isFolder ? (
              <Folder className="w-4 h-4 text-warning" />
            ) : (
              getFileIcon(node.name, node.language)
            )}
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') {
                  setRenameValue(node.name);
                  setIsRenaming(false);
                }
              }}
              onBlur={handleRenameSubmit}
              className="flex-1 bg-secondary/50 text-sm px-2 py-0.5 rounded border border-border focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>
        ) : (
          <button
            onClick={handleClick}
            className={cn(
              'flex-1 flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-colors rounded-md',
              'hover:bg-secondary/50',
              isSelected && 'bg-primary/20 text-primary'
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {isFolder ? (
              <>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-warning" />
                ) : (
                  <Folder className="w-4 h-4 text-warning" />
                )}
              </>
            ) : (
              <>
                <span className="w-3.5" />
                {getFileIcon(node.name, node.language)}
              </>
            )}
            <span className="truncate flex-1">{node.name}</span>
          </button>
        )}
        
        {/* Context menu */}
        <div className="flex items-center pr-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 hover:bg-secondary rounded"
                title="More actions"
              >
                <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {isFolder && (
                <>
                  <DropdownMenuItem onClick={() => {
                    setIsExpanded(true);
                    onAddFile(node.id, 'file');
                  }}>
                    <FilePlus className="w-3.5 h-3.5 mr-2" />
                    New File
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setIsExpanded(true);
                    onAddFile(node.id, 'folder');
                  }}>
                    <FolderPlus className="w-3.5 h-3.5 mr-2" />
                    New Folder
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => setIsRenaming(true)}>
                <Pencil className="w-3.5 h-3.5 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownloadFile(node)}>
                <Download className="w-3.5 h-3.5 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteNode(node.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isFolder && isExpanded && (
        <div>
          {showNewItemInput && (
            <div style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}>
              <NewItemInput
                type={pendingNewItem.type}
                onConfirm={onConfirmNew}
                onCancel={onCancelNew}
              />
            </div>
          )}
          {node.children?.map((child) => (
          <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedFileId={selectedFileId}
              onFileSelect={onFileSelect}
              onAddFile={onAddFile}
              onDeleteNode={onDeleteNode}
              onDownloadFile={onDownloadFile}
              onRenameNode={onRenameNode}
              pendingNewItem={pendingNewItem}
              onConfirmNew={onConfirmNew}
              onCancelNew={onCancelNew}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface NewItemInputProps {
  type: 'file' | 'folder';
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

const NewItemInput = ({ type, onConfirm, onCancel }: NewItemInputProps) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onConfirm(name.trim());
    } else {
      onCancel();
    }
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1">
      {type === 'folder' ? (
        <Folder className="w-4 h-4 text-warning" />
      ) : (
        <FileText className="w-4 h-4 text-muted-foreground" />
      )}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') onCancel();
        }}
        placeholder={type === 'folder' ? 'folder name' : 'filename.ext'}
        className="flex-1 bg-secondary/50 text-sm px-2 py-0.5 rounded border border-border focus:outline-none focus:border-primary"
        autoFocus
      />
      <button onClick={handleSubmit} className="p-1 hover:bg-secondary rounded">
        <Check className="w-3.5 h-3.5 text-primary" />
      </button>
      <button onClick={onCancel} className="p-1 hover:bg-secondary rounded">
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
};

export const FileTreeView = ({ files, projectName, selectedFileId, onFileSelect, onFilesChange, onDownloadFile, onDownloadProject, onRenameProject }: FileTreeViewProps) => {
  const [newItem, setNewItem] = useState<{ parentId: string | null; type: 'file' | 'folder' } | null>(null);
  const [isRenamingProject, setIsRenamingProject] = useState(false);
  const [projectNameValue, setProjectNameValue] = useState(projectName || '');

  const handleProjectRenameSubmit = () => {
    if (projectNameValue.trim() && projectNameValue !== projectName && onRenameProject) {
      onRenameProject(projectNameValue.trim());
      toast.success('Project renamed');
    }
    setIsRenamingProject(false);
  };

  const addNodeToTree = useCallback((nodes: FileNode[], parentId: string | null, newNode: FileNode): FileNode[] => {
    if (parentId === null) {
      const folders = nodes.filter(n => n.type === 'folder');
      const rootFiles = nodes.filter(n => n.type === 'file');
      
      if (newNode.type === 'folder') {
        return [...folders, newNode, ...rootFiles];
      } else {
        return [...folders, ...rootFiles, newNode];
      }
    }

    return nodes.map(node => {
      if (node.id === parentId && node.type === 'folder') {
        const children = node.children || [];
        const folders = children.filter(n => n.type === 'folder');
        const nodeFiles = children.filter(n => n.type === 'file');
        
        if (newNode.type === 'folder') {
          return { ...node, children: [...folders, newNode, ...nodeFiles] };
        } else {
          return { ...node, children: [...folders, ...nodeFiles, newNode] };
        }
      }
      if (node.children) {
        return { ...node, children: addNodeToTree(node.children, parentId, newNode) };
      }
      return node;
    });
  }, []);

  const deleteNodeFromTree = useCallback((nodes: FileNode[], nodeId: string): FileNode[] => {
    return nodes.filter(node => node.id !== nodeId).map(node => {
      if (node.children) {
        return { ...node, children: deleteNodeFromTree(node.children, nodeId) };
      }
      return node;
    });
  }, []);

  const renameNodeInTree = useCallback((nodes: FileNode[], nodeId: string, newName: string): FileNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        const language = node.type === 'file' ? getLanguageFromExtension(newName) : undefined;
        return { ...node, name: newName, ...(language && { language }) };
      }
      if (node.children) {
        return { ...node, children: renameNodeInTree(node.children, nodeId, newName) };
      }
      return node;
    });
  }, []);

  const handleAddFile = (parentId: string | null, type: 'file' | 'folder') => {
    setNewItem({ parentId, type });
  };

  const handleConfirmNew = (name: string) => {
    if (!newItem) return;

    const newNode: FileNode = {
      id: generateId(),
      name,
      type: newItem.type,
      ...(newItem.type === 'file' ? { 
        language: getLanguageFromExtension(name),
        content: '' 
      } : { 
        children: [] 
      }),
    };

    const updatedFiles = addNodeToTree(files, newItem.parentId, newNode);
    onFilesChange(updatedFiles);
    setNewItem(null);
    toast.success(`${newItem.type === 'folder' ? 'Folder' : 'File'} created`);
  };

  const handleCancelNew = () => {
    setNewItem(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    const updatedFiles = deleteNodeFromTree(files, nodeId);
    onFilesChange(updatedFiles);
    toast.success('Deleted successfully');
  };

  const handleRenameNode = (nodeId: string, newName: string) => {
    const updatedFiles = renameNodeInTree(files, nodeId, newName);
    onFilesChange(updatedFiles);
    toast.success('Renamed successfully');
  };

  return (
    <div className="h-full bg-sidebar-background/80 backdrop-blur-xl border-r border-sidebar-border overflow-auto">
      <div className="p-3 border-b border-sidebar-border flex flex-col gap-1">
        {projectName && (
          isRenamingProject ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={projectNameValue}
                onChange={(e) => setProjectNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleProjectRenameSubmit();
                  if (e.key === 'Escape') {
                    setProjectNameValue(projectName);
                    setIsRenamingProject(false);
                  }
                }}
                onBlur={handleProjectRenameSubmit}
                className="flex-1 bg-secondary/50 text-sm font-semibold px-2 py-0.5 rounded border border-border focus:outline-none focus:border-primary"
                autoFocus
              />
              <button onClick={handleProjectRenameSubmit} className="p-1 hover:bg-secondary rounded">
                <Check className="w-3.5 h-3.5 text-primary" />
              </button>
              <button onClick={() => { setProjectNameValue(projectName); setIsRenamingProject(false); }} className="p-1 hover:bg-secondary rounded">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 group">
              <h2 className="text-sm font-semibold text-foreground truncate flex-1">{projectName}</h2>
              <button
                onClick={() => { setProjectNameValue(projectName); setIsRenamingProject(true); }}
                className="p-1 hover:bg-secondary rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Rename Project"
              >
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          )
        )}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Explorer
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAddFile(null, 'file')}
              className="p-1 hover:bg-secondary rounded"
              title="New File"
            >
              <FilePlus className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => handleAddFile(null, 'folder')}
              className="p-1 hover:bg-secondary rounded"
              title="New Folder"
            >
              <FolderPlus className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={onDownloadProject}
              className="p-1 hover:bg-secondary rounded"
              title="Download Project"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-2">
        {newItem && newItem.parentId === null && (
          <NewItemInput
            type={newItem.type}
            onConfirm={handleConfirmNew}
            onCancel={handleCancelNew}
          />
        )}
        {files.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            selectedFileId={selectedFileId}
            onFileSelect={onFileSelect}
            onAddFile={handleAddFile}
            onDeleteNode={handleDeleteNode}
            onDownloadFile={onDownloadFile}
            onRenameNode={handleRenameNode}
            pendingNewItem={newItem}
            onConfirmNew={handleConfirmNew}
            onCancelNew={handleCancelNew}
          />
        ))}
      </div>
    </div>
  );
};

export { getLanguageFromExtension };
