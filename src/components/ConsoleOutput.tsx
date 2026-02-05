import { useRef, useEffect } from 'react';
import { X, Trash2, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export interface ConsoleEntry {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info' | 'result';
  content: string;
  timestamp: Date;
}

interface ConsoleOutputProps {
  entries: ConsoleEntry[];
  onClear: () => void;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  isRunning?: boolean;
}

export const ConsoleOutput = ({
  entries,
  onClear,
  onClose,
  isMinimized,
  onToggleMinimize,
  isRunning = false,
}: ConsoleOutputProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, isMinimized]);

  const getEntryColor = (type: ConsoleEntry['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'result':
        return 'text-green-400';
      default:
        return 'text-foreground';
    }
  };

  const getEntryPrefix = (type: ConsoleEntry['type']) => {
    switch (type) {
      case 'error':
        return '✗';
      case 'warn':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'result':
        return '→';
      default:
        return '›';
    }
  };

  const handleCopyAll = () => {
    const text = entries
      .map((e) => `[${e.type.toUpperCase()}] ${e.content}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Console output copied to clipboard');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex flex-col bg-background border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Console</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Running...
            </span>
          )}
          {entries.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopyAll}
            disabled={entries.length === 0}
            title="Copy all"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClear}
            disabled={entries.length === 0}
            title="Clear console"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onToggleMinimize}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
            title="Close console"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <ScrollArea className="h-48" ref={scrollRef}>
          <div className="p-2 font-mono text-xs space-y-1">
            {entries.length === 0 ? (
              <div className="text-muted-foreground italic py-4 text-center">
                No output yet. Run some code to see results here.
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex gap-2 py-0.5 hover:bg-muted/30 rounded px-1 ${getEntryColor(
                    entry.type
                  )}`}
                >
                  <span className="text-muted-foreground shrink-0">
                    {formatTime(entry.timestamp)}
                  </span>
                  <span className="shrink-0 w-4 text-center">
                    {getEntryPrefix(entry.type)}
                  </span>
                  <span className="whitespace-pre-wrap break-all">{entry.content}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
