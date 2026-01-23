import { Code2 } from 'lucide-react';
import { ReactNode } from 'react';

interface EditorHeaderProps {
  fileName?: string;
  children?: ReactNode;
}

export const EditorHeader = ({ fileName = 'untitled', children }: EditorHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        {children}
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 animate-pulse-glow">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">Mobile Code</h1>
          <p className="text-xs text-muted-foreground font-mono">{fileName}</p>
        </div>
      </div>
    </header>
  );
};
