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
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderPlus, Loader2, FileCode, Check } from 'lucide-react';
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
              <Label>Template</Label>
              <ScrollArea className="flex-1 max-h-[300px] pr-4">
                <div className="grid gap-2">
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
                          : "border-border hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary shrink-0">
                        <FileCode className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{template.name}</p>
                          {selectedTemplate?.id === template.id && (
                            <Check className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {template.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 text-[10px] rounded bg-secondary text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
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
