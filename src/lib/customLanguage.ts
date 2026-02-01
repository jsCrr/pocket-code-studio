import { StreamLanguage, LanguageSupport } from '@codemirror/language';
import { tags, Tag } from '@lezer/highlight';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';

// Custom tags for our language
const customTags = {
  controlKeyword: Tag.define(),
  typeKeyword: Tag.define(),
  constantKeyword: Tag.define(),
  accessKeyword: Tag.define(),
  functionName: Tag.define(),
  number: Tag.define(),
  string: Tag.define(),
  commentSingle: Tag.define(),
  commentMulti: Tag.define(),
  operator: Tag.define(),
  punctuation: Tag.define(),
};

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
      // Keep consuming until we find */
      if (!stream.match('*/')) {
        // Mark as comment, will continue on next line
        stream.skipToEnd();
      }
      return 'commentMulti';
    }

    // Single-line comments
    if (stream.match('//')) {
      stream.skipToEnd();
      return 'commentSingle';
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
      
      if (controlSet.has(word)) return 'controlKeyword';
      if (typesSet.has(word)) return 'typeKeyword';
      if (constantsSet.has(word)) return 'constantKeyword';
      if (accessSet.has(word)) return 'accessKeyword';
      
      // Check if it's a function (followed by parenthesis)
      if (stream.peek() === '(' || (stream.eatSpace() && stream.peek() === '(')) {
        return 'functionName';
      }
      
      return 'variable';
    }

    // Operators
    if (stream.match(/^(==|!=|<=|>=|[+\-*/=<>])/)) {
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
  { tag: tags.keyword, color: '#569CD6', fontWeight: 'bold' }, // control keywords
  { tag: tags.typeName, color: '#4EC9B0' }, // types
  { tag: tags.bool, color: '#569CD6', fontStyle: 'italic' }, // constants
  { tag: tags.null, color: '#569CD6', fontStyle: 'italic' }, // null
  { tag: tags.modifier, color: '#C586C0' }, // access modifiers
  { tag: tags.function(tags.variableName), color: '#DCDCAA' }, // functions
  { tag: tags.number, color: '#B5CEA8' }, // numbers
  { tag: tags.string, color: '#CE9178' }, // strings
  { tag: tags.lineComment, color: '#6A9955', fontStyle: 'italic' }, // single comments
  { tag: tags.blockComment, color: '#6A9955', fontStyle: 'italic' }, // multi comments
  { tag: tags.operator, color: '#D4D4D4' }, // operators
  { tag: tags.punctuation, color: '#D4D4D4' }, // punctuation
  { tag: tags.variableName, color: '#9CDCFE' }, // variables
]);

// Map our custom token names to standard tags for highlighting
const tokenToTag: Record<string, keyof typeof tags> = {
  controlKeyword: 'keyword',
  typeKeyword: 'typeName',
  constantKeyword: 'bool',
  accessKeyword: 'modifier',
  functionName: 'function',
  number: 'number',
  string: 'string',
  commentSingle: 'lineComment',
  commentMulti: 'blockComment',
  operator: 'operator',
  punctuation: 'punctuation',
  variable: 'variableName',
};

// Create the language support
export function customLanguage() {
  return new LanguageSupport(customLanguageParser);
}

// Export the syntax highlighting extension
export const customSyntaxHighlighting = syntaxHighlighting(customHighlightStyle);
