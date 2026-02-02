// Monaco Editor custom language registration for MinhaLinguagem (.mlg)

export function registerMinhaLinguagem(monaco: typeof import('monaco-editor')) {
  // Check if already registered
  const languages = monaco.languages.getLanguages();
  if (languages.some(lang => lang.id === 'minhalinguagem')) {
    return;
  }

  // Register the language
  monaco.languages.register({ id: 'minhalinguagem' });

  // Define tokens/keywords
  const controlKeywords = ['if', 'else', 'while', 'for', 'return', 'break', 'continue', 'switch', 'case', 'default', 'do', 'try', 'catch', 'finally', 'throw'];
  const typeKeywords = ['int', 'float', 'string', 'bool', 'void', 'char', 'double', 'long', 'short', 'byte', 'array', 'object'];
  const constantKeywords = ['true', 'false', 'null', 'undefined'];
  const accessKeywords = ['public', 'private', 'protected', 'static', 'const', 'final', 'abstract'];
  const declarationKeywords = ['function', 'class', 'interface', 'enum', 'struct', 'import', 'export', 'extends', 'implements', 'new'];

  const allKeywords = [...controlKeywords, ...typeKeywords, ...constantKeywords, ...accessKeywords, ...declarationKeywords];

  // Set the language configuration
  monaco.languages.setLanguageConfiguration('minhalinguagem', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    indentationRules: {
      increaseIndentPattern: /^.*\{[^}"']*$/,
      decreaseIndentPattern: /^\s*\}/,
    },
  });

  // Set the monarch tokenizer
  monaco.languages.setMonarchTokensProvider('minhalinguagem', {
    controlKeywords,
    typeKeywords,
    constantKeywords,
    accessKeywords,
    declarationKeywords,

    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string'],
        [/'[^']*'/, 'string'],

        // Numbers
        [/\d+\.\d+/, 'number.float'],
        [/\d+/, 'number'],

        // Identifiers and keywords
        [/[a-zA-Z_]\w*(?=\s*\()/, 'identifier.function'],
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@controlKeywords': 'keyword.control',
            '@typeKeywords': 'keyword.type',
            '@constantKeywords': 'keyword.constant',
            '@accessKeywords': 'keyword.access',
            '@declarationKeywords': 'keyword.declaration',
            '@default': 'identifier',
          },
        }],

        // Operators
        [/[+\-*\/=<>!&|%^~]+/, 'operator'],

        // Delimiters
        [/[{}()\[\];,.]/, 'delimiter'],

        // Whitespace
        [/\s+/, 'white'],
      ],

      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop'],
      ],
    },
  });

  // Register completion item provider for autocomplete
  monaco.languages.registerCompletionItemProvider('minhalinguagem', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: import('monaco-editor').languages.CompletionItem[] = [];

      // Add keyword completions
      controlKeywords.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range,
          detail: 'Control keyword',
          documentation: `Control flow keyword: ${keyword}`,
        });
      });

      typeKeywords.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.TypeParameter,
          insertText: keyword,
          range,
          detail: 'Type',
          documentation: `Type: ${keyword}`,
        });
      });

      constantKeywords.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: keyword,
          range,
          detail: 'Constant',
          documentation: `Constant value: ${keyword}`,
        });
      });

      accessKeywords.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range,
          detail: 'Access modifier',
          documentation: `Access modifier: ${keyword}`,
        });
      });

      declarationKeywords.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range,
          detail: 'Declaration',
          documentation: `Declaration keyword: ${keyword}`,
        });
      });

      // Add code snippets
      const snippets = [
        {
          label: 'if',
          insertText: 'if (${1:condition}) {\n\t${2:// code}\n}',
          documentation: 'If statement',
        },
        {
          label: 'ifelse',
          insertText: 'if (${1:condition}) {\n\t${2:// code}\n} else {\n\t${3:// code}\n}',
          documentation: 'If-else statement',
        },
        {
          label: 'ifelseif',
          insertText: 'if (${1:condition}) {\n\t${2:// code}\n} else if (${3:condition}) {\n\t${4:// code}\n} else {\n\t${5:// code}\n}',
          documentation: 'If-else if-else statement',
        },
        {
          label: 'for',
          insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n\t${3:// code}\n}',
          documentation: 'For loop',
        },
        {
          label: 'foreach',
          insertText: 'for (${1:type} ${2:item} : ${3:collection}) {\n\t${4:// code}\n}',
          documentation: 'For-each loop',
        },
        {
          label: 'while',
          insertText: 'while (${1:condition}) {\n\t${2:// code}\n}',
          documentation: 'While loop',
        },
        {
          label: 'dowhile',
          insertText: 'do {\n\t${1:// code}\n} while (${2:condition});',
          documentation: 'Do-while loop',
        },
        {
          label: 'switch',
          insertText: 'switch (${1:expression}) {\n\tcase ${2:value}:\n\t\t${3:// code}\n\t\tbreak;\n\tdefault:\n\t\t${4:// code}\n\t\tbreak;\n}',
          documentation: 'Switch statement',
        },
        {
          label: 'function',
          insertText: 'function ${1:name}(${2:params}) {\n\t${3:// code}\n\treturn ${4:value};\n}',
          documentation: 'Function declaration',
        },
        {
          label: 'voidfunc',
          insertText: 'void ${1:name}(${2:params}) {\n\t${3:// code}\n}',
          documentation: 'Void function declaration',
        },
        {
          label: 'class',
          insertText: 'class ${1:ClassName} {\n\tprivate ${2:type} ${3:field};\n\n\tpublic ${1:ClassName}(${4:params}) {\n\t\t${5:// constructor}\n\t}\n\n\tpublic ${6:void} ${7:method}() {\n\t\t${8:// code}\n\t}\n}',
          documentation: 'Class declaration',
        },
        {
          label: 'interface',
          insertText: 'interface ${1:InterfaceName} {\n\t${2:void} ${3:method}(${4:params});\n}',
          documentation: 'Interface declaration',
        },
        {
          label: 'trycatch',
          insertText: 'try {\n\t${1:// code}\n} catch (${2:Exception} ${3:e}) {\n\t${4:// handle error}\n}',
          documentation: 'Try-catch block',
        },
        {
          label: 'trycatchfinally',
          insertText: 'try {\n\t${1:// code}\n} catch (${2:Exception} ${3:e}) {\n\t${4:// handle error}\n} finally {\n\t${5:// cleanup}\n}',
          documentation: 'Try-catch-finally block',
        },
        {
          label: 'print',
          insertText: 'print(${1:"message"});',
          documentation: 'Print statement',
        },
        {
          label: 'println',
          insertText: 'println(${1:"message"});',
          documentation: 'Print line statement',
        },
        {
          label: 'main',
          insertText: 'public static void main(string[] args) {\n\t${1:// code}\n}',
          documentation: 'Main function',
        },
        {
          label: 'constructor',
          insertText: 'public ${1:ClassName}(${2:params}) {\n\t${3:// initialize}\n}',
          documentation: 'Constructor',
        },
        {
          label: 'getter',
          insertText: 'public ${1:type} get${2:Property}() {\n\treturn this.${3:field};\n}',
          documentation: 'Getter method',
        },
        {
          label: 'setter',
          insertText: 'public void set${1:Property}(${2:type} ${3:value}) {\n\tthis.${4:field} = ${3:value};\n}',
          documentation: 'Setter method',
        },
        {
          label: 'enum',
          insertText: 'enum ${1:EnumName} {\n\t${2:VALUE1},\n\t${3:VALUE2},\n\t${4:VALUE3}\n}',
          documentation: 'Enum declaration',
        },
        {
          label: 'struct',
          insertText: 'struct ${1:StructName} {\n\t${2:type} ${3:field};\n}',
          documentation: 'Struct declaration',
        },
        {
          label: 'array',
          insertText: '${1:type}[] ${2:name} = new ${1:type}[${3:size}];',
          documentation: 'Array declaration',
        },
        {
          label: 'arrayinit',
          insertText: '${1:type}[] ${2:name} = {${3:values}};',
          documentation: 'Array initialization',
        },
      ];

      snippets.forEach(snippet => {
        suggestions.push({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          detail: 'Snippet',
          documentation: snippet.documentation,
        });
      });

      return { suggestions };
    },
  });
}
