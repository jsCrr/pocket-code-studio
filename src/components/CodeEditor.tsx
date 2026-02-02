import { useRef, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import Editor, { OnMount, BeforeMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { registerMinhaLinguagem } from '@/lib/customLanguage';

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

const getMonacoLanguage = (lang: Language): string => {
  switch (lang) {
    case 'javascript':
      return 'javascript';
    case 'typescript':
      return 'typescript';
    case 'python':
      return 'python';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'markdown':
      return 'markdown';
    case 'sql':
      return 'sql';
    case 'xml':
      return 'xml';
    case 'java':
      return 'java';
    case 'cpp':
      return 'cpp';
    case 'rust':
      return 'rust';
    case 'php':
      return 'php';
    case 'mlg':
      return 'minhalinguagem';
    default:
      return 'javascript';
  }
};

const getMonacoTheme = (theme: EditorTheme): string => {
  switch (theme) {
    case 'dark':
      return 'mlg-dark';
    case 'monokai':
      return 'mlg-monokai';
    case 'dracula':
      return 'mlg-dracula';
    case 'nord':
      return 'mlg-nord';
    default:
      return 'mlg-dark';
  }
};

const defineThemes = (monaco: typeof import('monaco-editor')) => {
  // Dark theme
  monaco.editor.defineTheme('mlg-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword.control', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'keyword.type', foreground: '4EC9B0' },
      { token: 'keyword.constant', foreground: '569CD6', fontStyle: 'italic' },
      { token: 'keyword.access', foreground: 'C586C0' },
      { token: 'identifier.function', foreground: 'DCDCAA' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#1a1b26',
      'editor.foreground': '#c0caf5',
      'editorLineNumber.foreground': '#666666',
      'editorLineNumber.activeForeground': '#c0caf5',
      'editor.lineHighlightBackground': '#1e1f2b',
      'editor.selectionBackground': '#3d59a1',
      'editorCursor.foreground': '#c0caf5',
      'editorGutter.background': '#16171f',
    },
  });

  // Monokai theme
  monaco.editor.defineTheme('mlg-monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword.control', foreground: 'F92672', fontStyle: 'bold' },
      { token: 'keyword.type', foreground: '66D9EF', fontStyle: 'italic' },
      { token: 'keyword.constant', foreground: 'AE81FF' },
      { token: 'keyword.access', foreground: 'F92672' },
      { token: 'identifier.function', foreground: 'A6E22E' },
      { token: 'number', foreground: 'AE81FF' },
      { token: 'string', foreground: 'E6DB74' },
      { token: 'comment', foreground: '75715E', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#90908a',
      'editorLineNumber.activeForeground': '#f8f8f2',
      'editor.lineHighlightBackground': '#3e3d32',
      'editor.selectionBackground': '#49483e',
      'editorCursor.foreground': '#f8f8f0',
      'editorGutter.background': '#1e1f1c',
    },
  });

  // Dracula theme
  monaco.editor.defineTheme('mlg-dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword.control', foreground: 'FF79C6', fontStyle: 'bold' },
      { token: 'keyword.type', foreground: '8BE9FD', fontStyle: 'italic' },
      { token: 'keyword.constant', foreground: 'BD93F9' },
      { token: 'keyword.access', foreground: 'FF79C6' },
      { token: 'identifier.function', foreground: '50FA7B' },
      { token: 'number', foreground: 'BD93F9' },
      { token: 'string', foreground: 'F1FA8C' },
      { token: 'comment', foreground: '6272A4', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#6272a4',
      'editorLineNumber.activeForeground': '#f8f8f2',
      'editor.lineHighlightBackground': '#44475a',
      'editor.selectionBackground': '#44475a',
      'editorCursor.foreground': '#f8f8f2',
      'editorGutter.background': '#21222c',
    },
  });

  // Nord theme
  monaco.editor.defineTheme('mlg-nord', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword.control', foreground: '81A1C1', fontStyle: 'bold' },
      { token: 'keyword.type', foreground: '8FBCBB' },
      { token: 'keyword.constant', foreground: 'B48EAD' },
      { token: 'keyword.access', foreground: '81A1C1' },
      { token: 'identifier.function', foreground: '88C0D0' },
      { token: 'number', foreground: 'B48EAD' },
      { token: 'string', foreground: 'A3BE8C' },
      { token: 'comment', foreground: '616E88', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#2e3440',
      'editor.foreground': '#d8dee9',
      'editorLineNumber.foreground': '#4c566a',
      'editorLineNumber.activeForeground': '#d8dee9',
      'editor.lineHighlightBackground': '#3b4252',
      'editor.selectionBackground': '#434c5e',
      'editorCursor.foreground': '#d8dee9',
      'editorGutter.background': '#272c36',
    },
  });
};

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ 
  value, 
  onChange, 
  language, 
  fontSize = 14, 
  theme = 'dark',
  className = '' 
}, ref) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      if (editorRef.current) {
        const selection = editorRef.current.getSelection();
        if (selection) {
          editorRef.current.executeEdits('insert', [{
            range: selection,
            text: text,
            forceMoveMarkers: true,
          }]);
          editorRef.current.focus();
        }
      }
    },
  }));

  const handleBeforeMount: BeforeMount = (monaco) => {
    // Register custom language
    registerMinhaLinguagem(monaco);
    // Define themes
    defineThemes(monaco);
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleChange = useCallback((value: string | undefined) => {
    onChange(value || '');
  }, [onChange]);

  // Update editor options when fontSize changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize });
    }
  }, [fontSize]);

  return (
    <div className={`editor-container h-full ${className}`}>
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        theme={getMonacoTheme(theme)}
        value={value}
        onChange={handleChange}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
        options={{
          fontSize,
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'off',
          folding: true,
          bracketPairColorization: { enabled: true },
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          lineHeight: 1.6 * fontSize,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';
