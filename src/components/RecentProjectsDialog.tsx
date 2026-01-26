import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FolderOpen, Clock, ChevronRight, FolderSearch } from 'lucide-react';
import { Project } from '@/hooks/useFileSystem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface RecentProjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onBrowseFolder?: () => void;
}

export const RecentProjectsDialog = ({
  open,
  onOpenChange,
  projects,
  onSelectProject,
  onBrowseFolder,
}: RecentProjectsDialogProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
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
                <button
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left w-full"
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
  );
};
