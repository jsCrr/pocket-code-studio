import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileText, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  children?: FileNode[];
}

interface FileTreeViewProps {
  files: FileNode[];
  selectedFileId?: string;
  onFileSelect: (file: FileNode) => void;
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

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  selectedFileId?: string;
  onFileSelect: (file: FileNode) => void;
}

const TreeNode = ({ node, depth, selectedFileId, onFileSelect }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isFolder = node.type === 'folder';
  const isSelected = node.id === selectedFileId;

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 w-full px-2 py-1.5 text-left text-sm transition-colors rounded-md',
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
        <span className="truncate">{node.name}</span>
      </button>
      
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedFileId={selectedFileId}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTreeView = ({ files, selectedFileId, onFileSelect }: FileTreeViewProps) => {
  return (
    <div className="h-full bg-sidebar-background border-r border-sidebar-border overflow-auto">
      <div className="p-3 border-b border-sidebar-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Explorer
        </h3>
      </div>
      <div className="p-2">
        {files.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            selectedFileId={selectedFileId}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
};
