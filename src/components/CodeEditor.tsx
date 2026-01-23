import { useEffect, useRef, useCallback } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { php } from '@codemirror/lang-php';
import { oneDark } from '@codemirror/theme-one-dark';

export type Language = 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'html' 
  | 'css' 
  | 'json'
  | 'markdown'
  | 'sql'
  | 'xml'
  | 'java'
  | 'cpp'
  | 'rust'
  | 'php';

export type EditorTheme = 'dark' | 'monokai' | 'dracula' | 'nord';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  fontSize?: number;
  theme?: EditorTheme;
  className?: string;
}

const getLanguageExtension = (lang: Language) => {
  switch (lang) {
    case 'javascript':
      return javascript();
    case 'typescript':
      return javascript({ typescript: true });
    case 'python':
      return python();
    case 'html':
      return html();
    case 'css':
      return css();
    case 'json':
      return json();
    case 'markdown':
      return markdown();
    case 'sql':
      return sql();
    case 'xml':
      return xml();
    case 'java':
      return java();
    case 'cpp':
      return cpp();
    case 'rust':
      return rust();
    case 'php':
      return php();
    default:
      return javascript();
  }
};

const getThemeColors = (theme: EditorTheme) => {
  const themes = {
    dark: {
      bg: '#1a1b26',
      gutterBg: '#16171f',
      activeLine: '#1e1f2b',
      selection: 'rgba(125, 207, 255, 0.2)',
    },
    monokai: {
      bg: '#272822',
      gutterBg: '#1e1f1c',
      activeLine: '#3e3d32',
      selection: 'rgba(249, 38, 114, 0.2)',
    },
    dracula: {
      bg: '#282a36',
      gutterBg: '#21222c',
      activeLine: '#44475a',
      selection: 'rgba(189, 147, 249, 0.2)',
    },
    nord: {
      bg: '#2e3440',
      gutterBg: '#272c36',
      activeLine: '#3b4252',
      selection: 'rgba(136, 192, 208, 0.2)',
    },
  };
  return themes[theme];
};

export const CodeEditor = ({ 
  value, 
  onChange, 
  language, 
  fontSize = 14, 
  theme = 'dark',
  className = '' 
}: CodeEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const handleChange = useCallback((update: { state: EditorState; docChanged: boolean }) => {
    if (update.docChanged) {
      onChange(update.state.doc.toString());
    }
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current) return;

    const themeColors = getThemeColors(theme);

    // Clear previous editor instance
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        bracketMatching(),
        syntaxHighlighting(defaultHighlightStyle),
        oneDark,
        getLanguageExtension(language),
        keymap.of([...defaultKeymap, indentWithTab]),
        EditorView.updateListener.of(handleChange),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: `${fontSize}px`,
            backgroundColor: themeColors.bg,
          },
          '.cm-content': {
            fontSize: `${fontSize}px`,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          },
          '.cm-scroller': {
            overflow: 'auto',
          },
          '.cm-gutters': {
            backgroundColor: themeColors.gutterBg,
            borderRight: '1px solid rgba(255,255,255,0.1)',
            fontSize: `${fontSize}px`,
          },
          '.cm-activeLine': {
            backgroundColor: themeColors.activeLine,
          },
          '.cm-activeLineGutter': {
            backgroundColor: themeColors.activeLine,
          },
          '.cm-selectionBackground': {
            backgroundColor: `${themeColors.selection} !important`,
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [language, fontSize, theme, handleChange]); // Recreate editor when these change

  // Update content when value prop changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString();
      if (value !== currentValue) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentValue.length, insert: value },
        });
      }
    }
  }, [value]);

  return (
    <div 
      ref={editorRef} 
      className={`editor-container h-full ${className}`}
    />
  );
};
