import { X } from 'lucide-react';
import { FileNode } from './FileTreeView';

interface FileTabsProps {
  openFiles: FileNode[];
  activeFileId: string;
  onSelectFile: (file: FileNode) => void;
  onCloseFile: (fileId: string) => void;
}

export const FileTabs = ({ openFiles, activeFileId, onSelectFile, onCloseFile }: FileTabsProps) => {
  if (openFiles.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center bg-toolbar-bg border-b border-toolbar-border overflow-x-auto scrollbar-hide">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`
            group flex items-center gap-1.5 px-3 py-2 border-r border-toolbar-border cursor-pointer
            transition-colors min-w-fit
            ${activeFileId === file.id 
              ? 'bg-background text-foreground border-b-2 border-b-primary' 
              : 'bg-toolbar-bg text-muted-foreground hover:bg-secondary/50'
            }
          `}
          onClick={() => onSelectFile(file)}
        >
          <span className="text-xs font-medium whitespace-nowrap">{file.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseFile(file.id);
            }}
            className="p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors"
            aria-label={`Close ${file.name}`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
