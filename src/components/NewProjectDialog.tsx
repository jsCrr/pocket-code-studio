import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderPlus, Loader2, FileCode, Check, List, LayoutGrid } from 'lucide-react';
import { projectTemplates, ProjectTemplate } from '@/data/projectTemplates';
import { cn } from '@/lib/utils';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (name: string, template?: ProjectTemplate) => void;
  isLoading?: boolean;
}

export const NewProjectDialog = ({
  open,
  onOpenChange,
  onCreateProject,
  isLoading = false,
}: NewProjectDialogProps) => {
  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreateProject(projectName.trim(), selectedTemplate || undefined);
      setProjectName('');
      setSelectedTemplate(null);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setProjectName('');
      setSelectedTemplate(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary" />
            New Project
          </DialogTitle>
          <DialogDescription>
            Choose a template and give your project a name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="my-awesome-project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
                disabled={isLoading}
              />
            </div>
            
            <div className="flex flex-col gap-2 flex-1 min-h-0">
              <div className="flex items-center justify-between">
                <Label>Template</Label>
                <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      viewMode === 'list' ? "bg-background shadow-sm" : "hover:bg-background/50"
                    )}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      viewMode === 'grid' ? "bg-background shadow-sm" : "hover:bg-background/50"
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 min-h-0 max-h-[300px] overflow-y-auto overscroll-contain touch-pan-y rounded-md border border-border">
                <div className={cn(
                  "p-2",
                  viewMode === 'grid' 
                    ? "grid grid-cols-2 gap-2" 
                    : "flex flex-col gap-2"
                )}>
                  {projectTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template)}
                      disabled={isLoading}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border text-left transition-colors",
                        selectedTemplate?.id === template.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-secondary/50",
                        viewMode === 'grid' && "flex-col gap-2"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center rounded-lg bg-secondary shrink-0",
                        viewMode === 'grid' ? "w-8 h-8" : "w-10 h-10"
                      )}>
                        <FileCode className={cn(
                          "text-muted-foreground",
                          viewMode === 'grid' ? "w-4 h-4" : "w-5 h-5"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <p className={cn(
                            "font-medium truncate flex-1 min-w-0",
                            viewMode === 'grid' ? "text-xs" : "text-sm"
                          )}>{template.name}</p>
                          {selectedTemplate?.id === template.id && (
                            <Check className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </div>
                        {viewMode === 'list' && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1.5 overflow-hidden">
                          {template.tags.slice(0, viewMode === 'grid' ? 2 : 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 text-[10px] rounded bg-secondary text-muted-foreground truncate max-w-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!projectName.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};