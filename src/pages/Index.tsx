import { useState, useCallback } from 'react';
import { CodeEditor, Language } from '@/components/CodeEditor';
import { EditorHeader } from '@/components/EditorHeader';
import { EditorToolbar } from '@/components/EditorToolbar';
import { OutputPanel } from '@/components/OutputPanel';

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
};

const Index = () => {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(defaultCode.javascript);
  const [output, setOutput] = useState<string[]>([]);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    setCode(defaultCode[lang]);
    setOutput([]);
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
    };
    return extensions[language];
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background overflow-hidden">
      <EditorHeader fileName={getFileName()} />
      <EditorToolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onCopy={handleCopy}
        onClear={handleClear}
        onRun={handleRun}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
        />
      </div>
      <OutputPanel output={output} onClear={handleClearOutput} />
    </div>
  );
};

export default Index;
