// Monaco Editor custom language registration for MinhaLinguagem (.mlg)

export function registerMinhaLinguagem(monaco: typeof import('monaco-editor')) {
  // Register the language
  monaco.languages.register({ id: 'minhalinguagem' });

  // Define tokens/keywords
  const controlKeywords = ['if', 'else', 'while', 'for', 'return', 'break', 'continue'];
  const typeKeywords = ['int', 'float', 'string', 'bool', 'void'];
  const constantKeywords = ['true', 'false', 'null'];
  const accessKeywords = ['public', 'private', 'protected'];

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
  });

  // Set the monarch tokenizer
  monaco.languages.setMonarchTokensProvider('minhalinguagem', {
    controlKeywords,
    typeKeywords,
    constantKeywords,
    accessKeywords,

    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
        [/"/, 'string', '@string'],

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
            '@default': 'identifier',
          },
        }],

        // Operators
        [/[+\-*\/=<>!&|]+/, 'operator'],

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
}
