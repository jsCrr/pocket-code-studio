import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FolderOpen, Clock, ChevronRight, FolderSearch, MoreHorizontal, Pencil, Trash2, Check, X } from 'lucide-react';
import { Project } from '@/hooks/useFileSystem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface RecentProjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onBrowseFolder?: () => void;
  onDeleteProject?: (projectPath: string) => void;
  onRenameProject?: (projectPath: string, newName: string) => void;
}

export const RecentProjectsDialog = ({
  open,
  onOpenChange,
  projects,
  onSelectProject,
  onBrowseFolder,
  onDeleteProject,
  onRenameProject,
}: RecentProjectsDialogProps) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleStartRename = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(project.id);
    setRenameValue(project.name);
  };

  const handleRenameSubmit = (project: Project) => {
    if (renameValue.trim() && renameValue !== project.name && onRenameProject) {
      onRenameProject(project.path, renameValue.trim());
      toast.success('Project renamed');
    }
    setRenamingId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteProject && onDeleteProject) {
      onDeleteProject(deleteProject.path);
      toast.success('Project removed from recent list');
    }
    setDeleteProject(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Recent Projects
            </DialogTitle>
            <DialogDescription>
              Open a recently used project or browse for a folder.
            </DialogDescription>
          </DialogHeader>
          
          {/* Browse folder button */}
          {onBrowseFolder && (
            <>
              <Button 
                onClick={onBrowseFolder}
                className="w-full gap-2"
                variant="outline"
              >
                <FolderSearch className="w-5 h-5" />
                Browse for Folder...
              </Button>
              <Separator className="my-2" />
            </>
          )}
          
          {/* Recent projects label */}
          {projects.length > 0 && (
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Recent Projects
            </p>
          )}
          
          <ScrollArea className="max-h-[250px] pr-4">
            {projects.length > 0 ? (
              <div className="flex flex-col gap-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors w-full"
                  >
                    {renamingId === project.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          <FolderOpen className="w-5 h-5 text-primary" />
                        </div>
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameSubmit(project);
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                          className="flex-1 bg-secondary/50 text-sm px-2 py-1 rounded border border-border focus:outline-none focus:border-primary"
                          autoFocus
                        />
                        <button onClick={() => handleRenameSubmit(project)} className="p-1 hover:bg-secondary rounded">
                          <Check className="w-4 h-4 text-primary" />
                        </button>
                        <button onClick={() => setRenamingId(null)} className="p-1 hover:bg-secondary rounded">
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onSelectProject(project)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                            <FolderOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{project.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(project.lastOpened)}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 hover:bg-secondary rounded"
                            >
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={(e) => handleStartRename(project, e)}>
                              <Pencil className="w-3.5 h-3.5 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteProject(project);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No recent projects found.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Browse for a folder or create a new project.
                </p>
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteProject} onOpenChange={(open) => !open && setDeleteProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{deleteProject?.name}" from your recent projects list. The project files will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
