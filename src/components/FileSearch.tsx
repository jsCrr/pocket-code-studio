import { useState, useCallback, useMemo } from 'react';
import { Search, X, FileCode, FileText, FileJson } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FileNode } from './FileTreeView';

interface FileSearchProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  onClose: () => void;
}

const getFileIcon = (name: string) => {
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

// Flatten file tree to get all files with their paths
const flattenFiles = (nodes: FileNode[], path: string = ''): { file: FileNode; path: string }[] => {
  const result: { file: FileNode; path: string }[] = [];
  
  for (const node of nodes) {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    
    if (node.type === 'file') {
      result.push({ file: node, path: currentPath });
    }
    
    if (node.children) {
      result.push(...flattenFiles(node.children, currentPath));
    }
  }
  
  return result;
};

export const FileSearch = ({ files, onFileSelect, onClose }: FileSearchProps) => {
  const [query, setQuery] = useState('');

  const allFiles = useMemo(() => flattenFiles(files), [files]);

  const filteredFiles = useMemo(() => {
    if (!query.trim()) return allFiles;
    
    const lowerQuery = query.toLowerCase();
    return allFiles.filter(({ file, path }) => 
      file.name.toLowerCase().includes(lowerQuery) ||
      path.toLowerCase().includes(lowerQuery)
    );
  }, [allFiles, query]);

  const handleSelect = useCallback((file: FileNode) => {
    onFileSelect(file);
    onClose();
  }, [onFileSelect, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50" onClick={onClose}>
      <div 
        className="w-full max-w-md mx-4 bg-card border border-border rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-2 p-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8 px-0"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-auto">
          {filteredFiles.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No files found
            </div>
          ) : (
            filteredFiles.map(({ file, path }) => (
              <button
                key={file.id}
                onClick={() => handleSelect(file)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-left',
                  'hover:bg-secondary/50 transition-colors'
                )}
              >
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{path}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-3 py-2 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1 py-0.5 bg-secondary rounded text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};
