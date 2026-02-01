import { StreamLanguage, LanguageSupport, HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Exact keywords configuration
const exactKeywords = {
  control: ['if', 'else', 'while', 'for', 'return', 'break', 'continue'],
  types: ['int', 'float', 'string', 'bool', 'void'],
  constants: ['true', 'false', 'null'],
  access: ['public', 'private', 'protected'],
};

// Create keyword lookup maps
const controlSet = new Set(exactKeywords.control);
const typesSet = new Set(exactKeywords.types);
const constantsSet = new Set(exactKeywords.constants);
const accessSet = new Set(exactKeywords.access);

// Stream parser for the custom language
const customLanguageParser = StreamLanguage.define({
  token(stream) {
    // Skip whitespace
    if (stream.eatSpace()) return null;

    // Multi-line comments
    if (stream.match('/*')) {
      while (!stream.eol()) {
        if (stream.match('*/')) break;
        stream.next();
      }
      if (!stream.match('*/')) {
        stream.skipToEnd();
      }
      return 'blockComment';
    }

    // Single-line comments
    if (stream.match('//')) {
      stream.skipToEnd();
      return 'lineComment';
    }

    // Strings
    if (stream.match('"')) {
      let escaped = false;
      while (!stream.eol()) {
        const ch = stream.next();
        if (ch === '"' && !escaped) break;
        escaped = !escaped && ch === '\\';
      }
      return 'string';
    }

    // Numbers
    if (stream.match(/^\d+(\.\d+)?/)) {
      return 'number';
    }

    // Identifiers and keywords
    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
      const word = stream.current();
      
      if (controlSet.has(word)) return 'keyword';
      if (typesSet.has(word)) return 'typeName';
      if (constantsSet.has(word)) return 'bool';
      if (accessSet.has(word)) return 'modifier';
      
      // Check if it's a function (followed by parenthesis)
      if (stream.peek() === '(') {
        return 'function(variableName)';
      }
      
      return 'variableName';
    }

    // Operators
    if (stream.match(/^(==|!=|<=|>=|[+\-*\/=<>])/)) {
      return 'operator';
    }

    // Punctuation
    if (stream.match(/^[{}()\[\];,]/)) {
      return 'punctuation';
    }

    // Default: consume one character
    stream.next();
    return null;
  },
});

// Custom highlight style with the exact colors from the config
export const customHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#569CD6', fontWeight: 'bold' },
  { tag: tags.typeName, color: '#4EC9B0' },
  { tag: tags.bool, color: '#569CD6', fontStyle: 'italic' },
  { tag: tags.null, color: '#569CD6', fontStyle: 'italic' },
  { tag: tags.modifier, color: '#C586C0' },
  { tag: tags.function(tags.variableName), color: '#DCDCAA' },
  { tag: tags.number, color: '#B5CEA8' },
  { tag: tags.string, color: '#CE9178' },
  { tag: tags.lineComment, color: '#6A9955', fontStyle: 'italic' },
  { tag: tags.blockComment, color: '#6A9955', fontStyle: 'italic' },
  { tag: tags.operator, color: '#D4D4D4' },
  { tag: tags.punctuation, color: '#D4D4D4' },
  { tag: tags.variableName, color: '#9CDCFE' },
]);

// Create the language support
export function customLanguage() {
  return new LanguageSupport(customLanguageParser);
}

// Export the syntax highlighting extension
export const customSyntaxHighlighting = syntaxHighlighting(customHighlightStyle);
