import { Copy, Trash2, Play, FileCode, ChevronDown } from 'lucide-react';
import { Language } from './CodeEditor';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EditorToolbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onCopy: () => void;
  onClear: () => void;
  onRun: () => void;
}

const languages: { value: Language; label: string; icon: string }[] = [
  { value: 'javascript', label: 'JavaScript', icon: 'JS' },
  { value: 'typescript', label: 'TypeScript', icon: 'TS' },
  { value: 'python', label: 'Python', icon: 'PY' },
  { value: 'html', label: 'HTML', icon: '<>' },
  { value: 'css', label: 'CSS', icon: '#' },
  { value: 'json', label: 'JSON', icon: '{}' },
];

export const EditorToolbar = ({
  language,
  onLanguageChange,
  onCopy,
  onClear,
  onRun,
}: EditorToolbarProps) => {
  const currentLang = languages.find((l) => l.value === language) || languages[0];

  const handleCopy = () => {
    onCopy();
    toast.success('Copied to clipboard');
  };

  const handleClear = () => {
    onClear();
    toast.success('Editor cleared');
  };

  const handleRun = () => {
    onRun();
    toast.success('Code executed');
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-toolbar-bg border-b border-toolbar-border">
      {/* Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
          <FileCode className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{currentLang.label}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[160px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.value}
              onClick={() => onLanguageChange(lang.value)}
              className={`flex items-center gap-3 ${language === lang.value ? 'bg-primary/10 text-primary' : ''}`}
            >
              <span className="w-6 text-xs font-mono font-bold text-primary/80">
                {lang.icon}
              </span>
              <span>{lang.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="toolbar-btn p-2"
          aria-label="Copy code"
        >
          <Copy className="w-5 h-5" />
        </button>
        <button
          onClick={handleClear}
          className="toolbar-btn p-2"
          aria-label="Clear editor"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button
          onClick={handleRun}
          className="toolbar-btn-primary p-2 glow-primary"
          aria-label="Run code"
        >
          <Play className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
