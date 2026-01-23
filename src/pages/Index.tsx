import { useState, useCallback } from 'react';
import { CodeEditor, Language } from '@/components/CodeEditor';
import { EditorHeader } from '@/components/EditorHeader';
import { EditorToolbar } from '@/components/EditorToolbar';
import { OutputPanel } from '@/components/OutputPanel';
import { FileTreeView, FileNode } from '@/components/FileTreeView';
import { useEditorSettings } from '@/hooks/useEditorSettings';
import { PanelLeft, PanelLeftClose } from 'lucide-react';

const defaultCode: Record<Language, string> = {
  javascript: `// Welcome to Mobile Code Editor
function greet(name) {
  return \`Hello, \${name}! 👋\`;
}

console.log(greet('World'));

// Try editing this code!
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);`,
  typescript: `// TypeScript Example
interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

const user: User = { name: 'Alice', age: 25 };
console.log(greetUser(user));`,
  python: `# Python Example
def fibonacci(n):
    """Generate Fibonacci sequence"""
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

# Print first 10 Fibonacci numbers
print(fibonacci(10))`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobile Code</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Welcome to the mobile code editor.</p>
</body>
</html>`,
  css: `/* Modern CSS Example */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  min-height: 100vh;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}`,
  json: `{
  "name": "mobile-code-editor",
  "version": "1.0.0",
  "description": "A beautiful code editor for mobile devices",
  "features": [
    "Syntax highlighting",
    "Multiple languages",
    "Touch-friendly UI",
    "Dark theme"
  ],
  "author": "Lovable"
}`,
  markdown: `# Mobile Code Editor

A **beautiful** code editor designed for mobile devices.

## Features

- Syntax highlighting
- Multiple programming languages
- Touch-friendly interface
- Dark theme

## Getting Started

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> Built with love using Lovable`,
  sql: `-- SQL Example
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users
WHERE created_at > '2024-01-01'
ORDER BY name ASC
LIMIT 10;`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <application name="Mobile Code Editor">
    <version>1.0.0</version>
    <features>
      <feature>Syntax Highlighting</feature>
      <feature>Multiple Languages</feature>
      <feature>Touch-Friendly UI</feature>
    </features>
  </application>
</root>`,
  java: `// Java Example
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Calculate factorial
        int n = 5;
        int result = factorial(n);
        System.out.println("Factorial of " + n + " is " + result);
    }
    
    public static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`,
  cpp: `// C++ Example
#include <iostream>
#include <vector>

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    std::cout << "Numbers: ";
    for (int n : numbers) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
  rust: `// Rust Example
fn main() {
    println!("Hello, World!");
    
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    
    println!("Sum: {}", sum);
    
    // Pattern matching
    let result = match sum {
        0 => "zero",
        1..=10 => "small",
        _ => "large",
    };
    println!("Result: {}", result);
}`,
  php: `<?php
// PHP Example
class Greeter {
    private string $name;
    
    public function __construct(string $name) {
        $this->name = $name;
    }
    
    public function greet(): string {
        return "Hello, {$this->name}!";
    }
}

$greeter = new Greeter("World");
echo $greeter->greet();

// Array operations
$numbers = [1, 2, 3, 4, 5];
$doubled = array_map(fn($n) => $n * 2, $numbers);
print_r($doubled);
?>`,
};

const initialFiles: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      { id: 'main-js', name: 'main.js', type: 'file', language: 'javascript' },
      { id: 'main-ts', name: 'main.ts', type: 'file', language: 'typescript' },
      { id: 'main-py', name: 'main.py', type: 'file', language: 'python' },
      { id: 'app-java', name: 'App.java', type: 'file', language: 'java' },
      { id: 'main-cpp', name: 'main.cpp', type: 'file', language: 'cpp' },
      { id: 'main-rs', name: 'main.rs', type: 'file', language: 'rust' },
      { id: 'index-php', name: 'index.php', type: 'file', language: 'php' },
    ],
  },
  {
    id: 'public',
    name: 'public',
    type: 'folder',
    children: [
      { id: 'index-html', name: 'index.html', type: 'file', language: 'html' },
      { id: 'styles-css', name: 'styles.css', type: 'file', language: 'css' },
    ],
  },
  {
    id: 'data',
    name: 'data',
    type: 'folder',
    children: [
      { id: 'data-json', name: 'data.json', type: 'file', language: 'json' },
      { id: 'config-xml', name: 'config.xml', type: 'file', language: 'xml' },
      { id: 'queries-sql', name: 'queries.sql', type: 'file', language: 'sql' },
    ],
  },
  { id: 'readme-md', name: 'README.md', type: 'file', language: 'markdown' },
];

const fileToLanguage: Record<string, Language> = {
  'main-js': 'javascript',
  'main-ts': 'typescript',
  'main-py': 'python',
  'index-html': 'html',
  'styles-css': 'css',
  'data-json': 'json',
  'readme-md': 'markdown',
  'queries-sql': 'sql',
  'config-xml': 'xml',
  'app-java': 'java',
  'main-cpp': 'cpp',
  'main-rs': 'rust',
  'index-php': 'php',
};

const Index = () => {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(defaultCode.javascript);
  const [output, setOutput] = useState<string[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>('main-js');
  const [showTree, setShowTree] = useState(false);
  const { settings, setSettings } = useEditorSettings();

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    setCode(defaultCode[lang]);
    setOutput([]);
  }, []);

  const handleFileSelect = useCallback((file: FileNode) => {
    if (file.type === 'file' && file.id) {
      const lang = fileToLanguage[file.id];
      if (lang) {
        setSelectedFileId(file.id);
        setLanguage(lang);
        setCode(defaultCode[lang]);
        setOutput([]);
        setShowTree(false); // Close tree on mobile after selection
      }
    }
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  const handleClear = useCallback(() => {
    setCode('');
  }, []);

  const handleRun = useCallback(() => {
    if (language === 'javascript' || language === 'typescript') {
      try {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '));
        };
        
        // eslint-disable-next-line no-eval
        eval(code);
        
        console.log = originalLog;
        setOutput(logs.length > 0 ? logs : ['Code executed successfully (no output)']);
      } catch (err) {
        setOutput([`Error: ${err instanceof Error ? err.message : 'Unknown error'}`]);
      }
    } else {
      setOutput([`Preview not available for ${language}. Use a native runtime for execution.`]);
    }
  }, [code, language]);

  const handleClearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  const getFileName = () => {
    const extensions: Record<Language, string> = {
      javascript: 'main.js',
      typescript: 'main.ts',
      python: 'main.py',
      html: 'index.html',
      css: 'styles.css',
      json: 'data.json',
      markdown: 'README.md',
      sql: 'queries.sql',
      xml: 'config.xml',
      java: 'App.java',
      cpp: 'main.cpp',
      rust: 'main.rs',
      php: 'index.php',
    };
    return extensions[language];
  };

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      {/* File Tree - Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${showTree ? 'translate-x-0' : '-translate-x-full md:w-0 md:hidden'}
        `}
      >
        <FileTreeView 
          files={initialFiles} 
          selectedFileId={selectedFileId}
          onFileSelect={handleFileSelect} 
        />
      </div>
      
      {/* Overlay for mobile */}
      {showTree && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setShowTree(false)}
        />
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <EditorHeader fileName={getFileName()}>
          <button
            onClick={() => setShowTree(!showTree)}
            className="toolbar-btn p-2 mr-2"
            aria-label="Toggle file tree"
          >
            {showTree ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
        </EditorHeader>
        <EditorToolbar
          language={language}
          onLanguageChange={handleLanguageChange}
          onCopy={handleCopy}
          onClear={handleClear}
          onRun={handleRun}
          settings={settings}
          onSettingsChange={setSettings}
        />
        <div className="flex-1 min-h-0 overflow-hidden">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            fontSize={settings.fontSize}
            theme={settings.theme}
          />
        </div>
        <OutputPanel output={output} onClear={handleClearOutput} />
      </div>
    </div>
  );
};

export default Index;
