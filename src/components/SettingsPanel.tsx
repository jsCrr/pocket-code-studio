import { Settings, Type, Palette } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface EditorSettings {
  fontSize: number;
  theme: 'dark' | 'monokai' | 'dracula' | 'nord';
}

interface SettingsPanelProps {
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

const themeColors = {
  dark: { bg: '#1a1b26', primary: '#7dcfff', name: 'Dark' },
  monokai: { bg: '#272822', primary: '#f92672', name: 'Monokai' },
  dracula: { bg: '#282a36', primary: '#bd93f9', name: 'Dracula' },
  nord: { bg: '#2e3440', primary: '#88c0d0', name: 'Nord' },
} as const;

export const SettingsPanel = ({ settings, onSettingsChange }: SettingsPanelProps) => {
  const handleFontSizeChange = (value: number[]) => {
    onSettingsChange({ ...settings, fontSize: value[0] });
  };

  const handleThemeChange = (theme: EditorSettings['theme']) => {
    onSettingsChange({ ...settings, theme });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="toolbar-btn p-2"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Editor Settings</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Customize your coding experience
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-8">
          {/* Font Size Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              <Label className="text-foreground font-medium">Font Size</Label>
            </div>
            <div className="space-y-3">
              <Slider
                value={[settings.fontSize]}
                onValueChange={handleFontSizeChange}
                min={10}
                max={24}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10px</span>
                <span className="font-mono text-primary">{settings.fontSize}px</span>
                <span>24px</span>
              </div>
              <div 
                className="mt-3 p-3 rounded-lg bg-secondary/50 font-mono text-muted-foreground"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                const preview = "Sample text";
              </div>
            </div>
          </div>

          {/* Color Theme Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              <Label className="text-foreground font-medium">Color Theme</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(themeColors) as Array<keyof typeof themeColors>).map((themeKey) => {
                const theme = themeColors[themeKey];
                const isSelected = settings.theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => handleThemeChange(themeKey)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50 bg-secondary/30'
                      }
                    `}
                  >
                    <div 
                      className="w-8 h-8 rounded-md border border-border/50 flex items-center justify-center"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
