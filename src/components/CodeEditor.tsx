import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
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
import { customLanguage, customSyntaxHighlighting } from '@/lib/customLanguage';

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
  | 'php'
  | 'mlg';

export type EditorTheme = 'dark' | 'monokai' | 'dracula' | 'nord';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  fontSize?: number;
  theme?: EditorTheme;
  className?: string;
}

export interface CodeEditorRef {
  insertText: (text: string) => void;
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
    case 'mlg':
      return customLanguage();
    default:
      return javascript();
  }
};

// Check if we should use custom syntax highlighting
const useCustomHighlighting = (lang: Language) => lang === 'mlg';

const getThemeColors = (theme: EditorTheme) => {
  const themes = {
    dark: {
      bg: '#1a1b26',
      gutterBg: '#16171f',
      activeLine: '#1e1f2b',
      selection: '#3d59a1',
      cursor: '#c0caf5',
      foreground: '#c0caf5',
    },
    monokai: {
      bg: '#272822',
      gutterBg: '#1e1f1c',
      activeLine: '#3e3d32',
      selection: '#49483e',
      cursor: '#f8f8f0',
      foreground: '#f8f8f2',
    },
    dracula: {
      bg: '#282a36',
      gutterBg: '#21222c',
      activeLine: '#44475a',
      selection: '#44475a',
      cursor: '#f8f8f2',
      foreground: '#f8f8f2',
    },
    nord: {
      bg: '#2e3440',
      gutterBg: '#272c36',
      activeLine: '#3b4252',
      selection: '#434c5e',
      cursor: '#d8dee9',
      foreground: '#d8dee9',
    },
  };
  return themes[theme];
};

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ 
  value, 
  onChange, 
  language, 
  fontSize = 14, 
  theme = 'dark',
  className = '' 
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      if (viewRef.current) {
        const { state } = viewRef.current;
        const selection = state.selection.main;
        viewRef.current.dispatch({
          changes: { from: selection.from, to: selection.to, insert: text },
          selection: { anchor: selection.from + text.length },
        });
        viewRef.current.focus();
      }
    },
  }));

  const handleChange = useCallback((update: { state: EditorState; docChanged: boolean }) => {
    if (update.docChanged) {
      onChange(update.state.doc.toString());
    }
  }, [onChange]);

  // Initialize editor once
  useEffect(() => {
    if (!editorRef.current) return;

    const themeColors = getThemeColors(theme);

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        bracketMatching(),
        useCustomHighlighting(language) ? customSyntaxHighlighting : syntaxHighlighting(defaultHighlightStyle),
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
            caretColor: themeColors.cursor,
          },
          '.cm-scroller': {
            overflow: 'auto',
          },
          '.cm-gutters': {
            backgroundColor: themeColors.gutterBg,
            borderRight: '1px solid rgba(255,255,255,0.1)',
            fontSize: `${fontSize}px`,
            color: 'rgba(255,255,255,0.4)',
          },
          '.cm-lineNumbers .cm-gutterElement': {
            color: 'rgba(255,255,255,0.4)',
          },
          '.cm-activeLine': {
            backgroundColor: `${themeColors.activeLine} !important`,
          },
          '.cm-activeLineGutter': {
            backgroundColor: `${themeColors.activeLine} !important`,
          },
          '.cm-cursor': {
            borderLeftColor: themeColors.cursor,
            borderLeftWidth: '2px',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: `${themeColors.selection} !important`,
          },
          '.cm-selectionMatch': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update editor when language, fontSize, or theme changes
  useEffect(() => {
    if (!viewRef.current || !editorRef.current) return;

    const themeColors = getThemeColors(theme);
    const currentDoc = viewRef.current.state.doc.toString();
    
    viewRef.current.destroy();

    const state = EditorState.create({
      doc: currentDoc,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        bracketMatching(),
        useCustomHighlighting(language) ? customSyntaxHighlighting : syntaxHighlighting(defaultHighlightStyle),
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
            caretColor: themeColors.cursor,
          },
          '.cm-scroller': {
            overflow: 'auto',
          },
          '.cm-gutters': {
            backgroundColor: themeColors.gutterBg,
            borderRight: '1px solid rgba(255,255,255,0.1)',
            fontSize: `${fontSize}px`,
            color: 'rgba(255,255,255,0.4)',
          },
          '.cm-lineNumbers .cm-gutterElement': {
            color: 'rgba(255,255,255,0.4)',
          },
          '.cm-activeLine': {
            backgroundColor: `${themeColors.activeLine} !important`,
          },
          '.cm-activeLineGutter': {
            backgroundColor: `${themeColors.activeLine} !important`,
          },
          '.cm-cursor': {
            borderLeftColor: themeColors.cursor,
            borderLeftWidth: '2px',
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: `${themeColors.selection} !important`,
          },
          '.cm-selectionMatch': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });
  }, [language, fontSize, theme, handleChange]);

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
});

CodeEditor.displayName = 'CodeEditor';
