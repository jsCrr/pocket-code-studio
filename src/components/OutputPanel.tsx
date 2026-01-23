import { Terminal, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface OutputPanelProps {
  output: string[];
  onClear: () => void;
}

export const OutputPanel = ({ output, onClear }: OutputPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-card border-t border-border animate-slide-up">
      {/* Panel Header */}
      <div 
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium uppercase tracking-wider">Output</span>
          {output.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-primary/20 text-primary">
              {output.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {output.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1 rounded hover:bg-secondary/50 transition-colors"
              aria-label="Clear output"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Panel Content */}
      {isExpanded && (
        <div className="max-h-40 overflow-y-auto p-3 font-mono text-xs bg-editor-bg">
          {output.length === 0 ? (
            <p className="text-muted-foreground italic">Run your code to see output here...</p>
          ) : (
            output.map((line, index) => (
              <div key={index} className="py-0.5 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <span className="text-muted-foreground mr-2">{'>'}</span>
                <span className="text-foreground">{line}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
