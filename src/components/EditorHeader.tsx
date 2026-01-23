import { Code2, Settings } from 'lucide-react';

interface EditorHeaderProps {
  fileName?: string;
}

export const EditorHeader = ({ fileName = 'untitled' }: EditorHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 animate-pulse-glow">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">Mobile Code</h1>
          <p className="text-xs text-muted-foreground font-mono">{fileName}</p>
        </div>
      </div>
      
      <button 
        className="touch-target rounded-lg hover:bg-secondary/50 transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>
    </header>
  );
};
