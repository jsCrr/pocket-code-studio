import { Code2, LogOut, Play, Terminal, Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsPanel } from './SettingsPanel';
import { EditorSettings } from '@/hooks/useEditorSettings';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EditorHeaderProps {
  fileName?: string;
  children?: ReactNode;
  settings?: EditorSettings;
  onSettingsChange?: (settings: EditorSettings) => void;
  isRunnable?: boolean;
  isRunning?: boolean;
  showConsole?: boolean;
  onRun?: () => void;
  onToggleConsole?: () => void;
}

export const EditorHeader = ({ 
  fileName = 'untitled', 
  children, 
  settings, 
  onSettingsChange,
  isRunnable = false,
  isRunning = false,
  showConsole = false,
  onRun,
  onToggleConsole,
}: EditorHeaderProps) => {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        {children}
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 animate-pulse-glow">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">Pocket Code Studio</h1>
          <p className="text-xs text-muted-foreground font-mono">{fileName}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isRunnable && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRun}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white text-sm font-medium"
                aria-label="Run code"
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Run
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Run code (JavaScript, PHP)</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleConsole}
              className={`p-2 rounded-lg transition-colors ${
                showConsole 
                  ? 'bg-primary/20 text-primary' 
                  : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Toggle console"
            >
              <Terminal className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showConsole ? 'Hide console' : 'Show console'}</p>
          </TooltipContent>
        </Tooltip>
        {settings && onSettingsChange && (
          <SettingsPanel settings={settings} onSettingsChange={onSettingsChange} />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleExit}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Exit project"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Exit project</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};
