import { FileNode } from '@/components/FileTreeView';
import { Language } from '@/components/CodeEditor';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  files: { path: string; content: string }[];
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "web-basic",
    name: "HTML + CSS + JS (Basic)",
    description: "Projeto web simples com HTML, CSS e JavaScript.",
    tags: ["web", "html", "css", "js", "beginner"],
    files: [
      {
        path: "index.html",
        content: `<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Web Basic</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="app">
    <h1>Web Basic</h1>
    <p>Template criado no Pocket Code Studio.</p>
    <button id="btn">Clique</button>
  </main>

  <script src="main.js"></script>
</body>
</html>
`
      },
      {
        path: "style.css",
        content: `* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, Arial, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}

.app {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 12px;
  padding: 20px;
}

button {
  padding: 10px 14px;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}
`
      },
      {
        path: "main.js",
        content: `document.querySelector("#btn").addEventListener("click", () => {
  alert("Hello Pocket Code Studio!");
});
`
      }
    ]
  },
  {
    id: "web-landing-page",
    name: "Landing Page (HTML + CSS)",
    description: "Landing page simples com layout bonito e responsivo.",
    tags: ["web", "html", "css", "landing"],
    files: [
      {
        path: "index.html",
        content: `<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Landing Page</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="header">
    <div class="brand">Pocket</div>
    <nav class="nav">
      <a href="#features">Recursos</a>
      <a href="#pricing">Planos</a>
      <a href="#contact">Contato</a>
    </nav>
  </header>

  <main class="hero">
    <h1>Crie projetos rápido no celular</h1>
    <p>Um template limpo e pronto para começar.</p>
    <div class="actions">
      <a class="btn primary" href="#pricing">Começar</a>
      <a class="btn" href="#features">Ver recursos</a>
    </div>
  </main>

  <section id="features" class="section">
    <h2>Recursos</h2>
    <div class="grid">
      <article class="card">
        <h3>Rápido</h3>
        <p>Estrutura simples e eficiente.</p>
      </article>
      <article class="card">
        <h3>Responsivo</h3>
        <p>Funciona bem no mobile e no desktop.</p>
      </article>
      <article class="card">
        <h3>Bonito</h3>
        <p>Visual minimalista e moderno.</p>
      </article>
    </div>
  </section>

  <footer id="contact" class="footer">
    <p>© 2026 Pocket Code Studio</p>
  </footer>
</body>
</html>
`
      },
      {
        path: "style.css",
        content: `* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, Arial, sans-serif;
  background: #0b1220;
  color: #e5e7eb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.brand { font-weight: 700; }

.nav a {
  color: #e5e7eb;
  text-decoration: none;
  margin-left: 12px;
  opacity: 0.85;
}

.nav a:hover { opacity: 1; }

.hero {
  padding: 60px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.hero h1 { font-size: 40px; margin: 0 0 10px; }
.hero p { opacity: 0.9; }

.actions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }

.btn {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  color: #e5e7eb;
  text-decoration: none;
}

.btn.primary {
  background: #2563eb;
  border-color: transparent;
}

.section {
  padding: 30px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.card {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}

.footer {
  padding: 20px;
  text-align: center;
  opacity: 0.7;
}
`
      }
    ]
  },
  {
    id: "node-cli",
    name: "Node.js CLI",
    description: "Ferramenta de terminal em Node.js com --help e argumentos.",
    tags: ["node", "cli", "js"],
    files: [
      {
        path: "package.json",
        content: `{
  "name": "node-cli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "node-cli": "src/index.js"
  }
}
`
      },
      {
        path: "src/index.js",
        content: `#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log("Uso: node-cli [--name NOME]");
  process.exit(0);
}

const nameIndex = args.indexOf("--name");
const name = nameIndex !== -1 ? args[nameIndex + 1] : "Mundo";

console.log(\`Olá, \${name}!\`);
`
      }
    ]
  },
  {
    id: "python-basic",
    name: "Python (Basic)",
    description: "Script Python simples com main().",
    tags: ["python", "beginner"],
    files: [
      {
        path: "main.py",
        content: `def main():
    print("Hello Pocket Code Studio!")


if __name__ == "__main__":
    main()
`
      },
      {
        path: "README.md",
        content: `# Python Basic

Execute:

\`\`\`bash
python main.py
\`\`\`
`
      }
    ]
  },
  {
    id: "python-cli-args",
    name: "Python CLI (Args)",
    description: "CLI Python com argparse e subcomando simples.",
    tags: ["python", "cli"],
    files: [
      {
        path: "main.py",
        content: `import argparse


def cmd_hello(args):
    print(f"Olá, {args.name}!")


def main():
    parser = argparse.ArgumentParser(prog="pycli", description="CLI exemplo")

    sub = parser.add_subparsers(dest="cmd")

    hello = sub.add_parser("hello", help="diz olá")
    hello.add_argument("--name", default="Mundo")
    hello.set_defaults(func=cmd_hello)

    args = parser.parse_args()

    if not hasattr(args, "func"):
        parser.print_help()
        return

    args.func(args)


if __name__ == "__main__":
    main()
`
      }
    ]
  },
  {
    id: "go-cli",
    name: "Go CLI (Basic)",
    description: "Projeto Go simples com flags.",
    tags: ["go", "cli"],
    files: [
      {
        path: "go.mod",
        content: `module example.com/gocli

go 1.22
`
      },
      {
        path: "main.go",
        content: `package main

import (
	"flag"
	"fmt"
)

func main() {
	name := flag.String("name", "Mundo", "Nome para cumprimentar")
	flag.Parse()

	fmt.Printf("Olá, %s!\\n", *name)
}
`
      }
    ]
  },
  {
    id: "c-hello",
    name: "C (Hello World)",
    description: "Hello World em C, ideal para compilar no PC.",
    tags: ["c", "beginner"],
    files: [
      {
        path: "main.c",
        content: `#include <stdio.h>

int main(void) {
    printf("Hello Pocket Code Studio!\\n");
    return 0;
}
`
      },
      {
        path: "README.md",
        content: `# C Hello World

Compile:

\`\`\`bash
gcc main.c -o app
./app
\`\`\`
`
      }
    ]
  },
  {
    id: "cpp-basic",
    name: "C++ (Basic)",
    description: "Projeto C++ simples com iostream.",
    tags: ["cpp", "beginner"],
    files: [
      {
        path: "main.cpp",
        content: `#include <iostream>

int main() {
    std::cout << "Hello Pocket Code Studio!" << std::endl;
    return 0;
}
`
      }
    ]
  },
  {
    id: "json-api-mock",
    name: "JSON API Mock",
    description: "Mock de API usando arquivo JSON (bom para testes).",
    tags: ["json", "api", "mock"],
    files: [
      {
        path: "db.json",
        content: `{
  "users": [
    { "id": 1, "name": "Eliel" },
    { "id": 2, "name": "Dev" }
  ],
  "posts": [
    { "id": 1, "title": "Olá", "content": "Meu primeiro post" }
  ]
}
`
      },
      {
        path: "README.md",
        content: `# JSON API Mock

Você pode usar isso com json-server (no PC):

\`\`\`bash
npm i -g json-server
json-server --watch db.json
\`\`\`
`
      }
    ]
  },
  {
    id: "vite-react-ts",
    name: "Vite + React + TypeScript (Mini)",
    description: "Estrutura mínima React + TS, sem configs avançadas.",
    tags: ["vite", "react", "ts", "frontend"],
    files: [
      {
        path: "index.html",
        content: `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite React TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
      },
      {
        path: "package.json",
        content: `{
  "name": "vite-react-ts-mini",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.4",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.1"
  }
}
`
      },
      {
        path: "vite.config.ts",
        content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`
      },
      {
        path: "tsconfig.json",
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
`
      },
      {
        path: "src/main.tsx",
        content: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
      },
      {
        path: "src/App.tsx",
        content: `export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h1>Vite + React + TS</h1>
      <p>Template mini criado no Pocket Code Studio.</p>
    </div>
  );
}
`
      },
      {
        path: "src/style.css",
        content: `body { margin: 0; }
`
      }
    ]
  },
  {
    id: "expo-react-native",
    name: "Expo React Native (Basic)",
    description: "Template simples de React Native com Expo.",
    tags: ["react-native", "expo", "mobile"],
    files: [
      {
        path: "package.json",
        content: `{
  "name": "expo-basic",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0"
  }
}
`
      },
      {
        path: "App.js",
        content: `import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Pocket Code Studio + Expo</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
`
      }
    ]
  },
  {
    id: "readme-only",
    name: "README Only",
    description: "Template vazio com README, útil para notas rápidas.",
    tags: ["notes", "markdown"],
    files: [
      {
        path: "README.md",
        content: `# Projeto

Escreva suas notas aqui.
`
      }
    ]
  }
];

const getLanguageFromPath = (path: string): Language => {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, Language> = {
    'js': 'javascript',
    'mjs': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'sql': 'sql',
    'xml': 'xml',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'cpp',
    'rs': 'rust',
    'php': 'php',
    'go': 'javascript', // Fallback since we don't have Go language
    'mod': 'javascript', // Fallback for go.mod
  };
  return languageMap[ext] || 'javascript';
};

export const convertTemplateToFiles = (template: ProjectTemplate): FileNode[] => {
  const fileMap: Record<string, FileNode> = {};
  const rootFiles: FileNode[] = [];

  template.files.forEach((file, index) => {
    const parts = file.path.split('/');
    const fileName = parts[parts.length - 1];
    
    if (parts.length === 1) {
      // Root level file
      rootFiles.push({
        id: `file-${index}`,
        name: fileName,
        type: 'file',
        language: getLanguageFromPath(fileName),
        content: file.content,
      });
    } else {
      // Nested file - create folder structure
      let currentPath = '';
      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
        
        if (!fileMap[currentPath]) {
          const folderNode: FileNode = {
            id: `folder-${currentPath}`,
            name: folderName,
            type: 'folder',
            children: [],
          };
          fileMap[currentPath] = folderNode;
          
          if (parentPath && fileMap[parentPath]) {
            fileMap[parentPath].children!.push(folderNode);
          } else if (!parentPath) {
            rootFiles.push(folderNode);
          }
        }
      }
      
      // Add the file to its parent folder
      const fileNode: FileNode = {
        id: `file-${index}`,
        name: fileName,
        type: 'file',
        language: getLanguageFromPath(fileName),
        content: file.content,
      };
      
      const parentFolderPath = parts.slice(0, -1).join('/');
      if (fileMap[parentFolderPath]) {
        fileMap[parentFolderPath].children!.push(fileNode);
      }
    }
  });

  return rootFiles;
};
