import { Copy, Trash2, Play, FileCode, ChevronDown } from 'lucide-react';
import { Language } from './CodeEditor';
import { toast } from 'sonner';
import { SettingsPanel } from './SettingsPanel';
import { EditorSettings } from '@/hooks/useEditorSettings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface EditorToolbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onCopy: () => void;
  onClear: () => void;
  onRun: () => void;
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

const languages: { value: Language; label: string; icon: string; category: string }[] = [
  // Web
  { value: 'javascript', label: 'JavaScript', icon: 'JS', category: 'Web' },
  { value: 'typescript', label: 'TypeScript', icon: 'TS', category: 'Web' },
  { value: 'html', label: 'HTML', icon: '<>', category: 'Web' },
  { value: 'css', label: 'CSS', icon: '#', category: 'Web' },
  { value: 'php', label: 'PHP', icon: 'PHP', category: 'Web' },
  // Languages
  { value: 'python', label: 'Python', icon: 'PY', category: 'Languages' },
  { value: 'java', label: 'Java', icon: 'JV', category: 'Languages' },
  { value: 'cpp', label: 'C++', icon: 'C+', category: 'Languages' },
  { value: 'rust', label: 'Rust', icon: 'RS', category: 'Languages' },
  // Data & Config
  { value: 'json', label: 'JSON', icon: '{}', category: 'Data' },
  { value: 'xml', label: 'XML', icon: 'XM', category: 'Data' },
  { value: 'sql', label: 'SQL', icon: 'SQ', category: 'Data' },
  { value: 'markdown', label: 'Markdown', icon: 'MD', category: 'Data' },
];

const groupedLanguages = languages.reduce((acc, lang) => {
  if (!acc[lang.category]) {
    acc[lang.category] = [];
  }
  acc[lang.category].push(lang);
  return acc;
}, {} as Record<string, typeof languages>);

export const EditorToolbar = ({
  language,
  onLanguageChange,
  onCopy,
  onClear,
  onRun,
  settings,
  onSettingsChange,
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
        <DropdownMenuContent align="start" className="min-w-[180px] max-h-[300px] overflow-auto">
          {Object.entries(groupedLanguages).map(([category, langs], idx) => (
            <div key={category}>
              {idx > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {category}
              </DropdownMenuLabel>
              {langs.map((lang) => (
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
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <SettingsPanel settings={settings} onSettingsChange={onSettingsChange} />
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
