import { useCallback } from 'react';

interface SymbolBarProps {
  onInsert: (symbol: string) => void;
}

const symbols = [
  { label: '( )', value: '()' },
  { label: '[ ]', value: '[]' },
  { label: '{ }', value: '{}' },
  { label: '< >', value: '<>' },
  { label: '" "', value: '""' },
  { label: "' '", value: "''" },
  { label: '`', value: '`' },
  { label: ';', value: ';' },
  { label: ':', value: ':' },
  { label: ',', value: ',' },
  { label: '.', value: '.' },
  { label: '=>', value: '=>' },
  { label: '->', value: '->' },
  { label: '/', value: '/' },
  { label: '=', value: '=' },
  { label: '!', value: '!' },
  { label: '&', value: '&' },
  { label: '|', value: '|' },
  { label: '$', value: '$' },
  { label: '#', value: '#' },
  { label: 'TAB', value: '\t' },
];

export const SymbolBar = ({ onInsert }: SymbolBarProps) => {
  const handleClick = useCallback((symbol: string) => {
    onInsert(symbol);
  }, [onInsert]);

  return (
    <div className="sticky bottom-0 left-0 right-0 flex items-center gap-1 px-2 py-1.5 bg-toolbar-bg border-t border-toolbar-border overflow-x-auto scrollbar-hide z-50">
      {symbols.map((sym) => (
        <button
          key={sym.value}
          onClick={() => handleClick(sym.value)}
          className="flex-shrink-0 px-2.5 py-1.5 text-xs font-mono bg-secondary/50 hover:bg-secondary text-foreground rounded transition-colors min-w-[32px]"
        >
          {sym.label}
        </button>
      ))}
    </div>
  );
};
