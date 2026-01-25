import { Code2 } from 'lucide-react';

export const EmptyEditorState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[hsl(var(--editor-bg))] text-center p-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 animate-pulse-glow">
        <Code2 className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Mobile Code</h2>
      <p className="text-muted-foreground text-sm max-w-[240px]">
        Choose a file from the sidebar and start coding.
      </p>
    </div>
  );
};
