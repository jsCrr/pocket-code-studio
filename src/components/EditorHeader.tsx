import { Code2, LogOut } from 'lucide-react';
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
}

export const EditorHeader = ({ fileName = 'untitled', children, settings, onSettingsChange }: EditorHeaderProps) => {
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
