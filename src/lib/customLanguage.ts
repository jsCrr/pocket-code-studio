import { StreamLanguage, LanguageSupport, HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags, Tag } from '@lezer/highlight';

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

// Custom tags for MinhaLinguagem
const mlgTags = {
  controlKeyword: Tag.define(),
  typeKeyword: Tag.define(),
  constantKeyword: Tag.define(),
  accessKeyword: Tag.define(),
  functionName: Tag.define(),
  mlgNumber: Tag.define(),
  mlgString: Tag.define(),
  mlgComment: Tag.define(),
  mlgOperator: Tag.define(),
  mlgPunctuation: Tag.define(),
  mlgVariable: Tag.define(),
};

// Stream parser for the custom language
const customLanguageParser = StreamLanguage.define({
  name: 'minhalinguagem',
  token(stream) {
    // Skip whitespace
    if (stream.eatSpace()) return null;

    // Multi-line comments
    if (stream.match('/*')) {
      while (!stream.eol()) {
        if (stream.match('*/')) break;
        stream.next();
      }
      return 'mlgComment';
    }

    // Single-line comments
    if (stream.match('//')) {
      stream.skipToEnd();
      return 'mlgComment';
    }

    // Strings
    if (stream.match('"')) {
      let escaped = false;
      while (!stream.eol()) {
        const ch = stream.next();
        if (ch === '"' && !escaped) break;
        escaped = !escaped && ch === '\\';
      }
      return 'mlgString';
    }

    // Numbers
    if (stream.match(/^\d+(\.\d+)?/)) {
      return 'mlgNumber';
    }

    // Identifiers and keywords
    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
      const word = stream.current();
      
      if (controlSet.has(word)) return 'controlKeyword';
      if (typesSet.has(word)) return 'typeKeyword';
      if (constantsSet.has(word)) return 'constantKeyword';
      if (accessSet.has(word)) return 'accessKeyword';
      
      // Check if it's a function (followed by parenthesis)
      if (stream.peek() === '(') {
        return 'functionName';
      }
      
      return 'mlgVariable';
    }

    // Operators
    if (stream.match(/^(==|!=|<=|>=|[+\-*\/=<>])/)) {
      return 'mlgOperator';
    }

    // Punctuation
    if (stream.match(/^[{}()\[\];,]/)) {
      return 'mlgPunctuation';
    }

    // Default: consume one character
    stream.next();
    return null;
  },
  tokenTable: {
    controlKeyword: mlgTags.controlKeyword,
    typeKeyword: mlgTags.typeKeyword,
    constantKeyword: mlgTags.constantKeyword,
    accessKeyword: mlgTags.accessKeyword,
    functionName: mlgTags.functionName,
    mlgNumber: mlgTags.mlgNumber,
    mlgString: mlgTags.mlgString,
    mlgComment: mlgTags.mlgComment,
    mlgOperator: mlgTags.mlgOperator,
    mlgPunctuation: mlgTags.mlgPunctuation,
    mlgVariable: mlgTags.mlgVariable,
  },
});

// Custom highlight style with the exact colors from the config
export const customHighlightStyle = HighlightStyle.define([
  // Control keywords: #569CD6, bold
  { tag: mlgTags.controlKeyword, color: '#569CD6', fontWeight: 'bold' },
  // Types: #4EC9B0
  { tag: mlgTags.typeKeyword, color: '#4EC9B0' },
  // Constants: #569CD6, italic
  { tag: mlgTags.constantKeyword, color: '#569CD6', fontStyle: 'italic' },
  // Access modifiers: #C586C0
  { tag: mlgTags.accessKeyword, color: '#C586C0' },
  // Functions: #DCDCAA
  { tag: mlgTags.functionName, color: '#DCDCAA' },
  // Numbers: #B5CEA8
  { tag: mlgTags.mlgNumber, color: '#B5CEA8' },
  // Strings: #CE9178
  { tag: mlgTags.mlgString, color: '#CE9178' },
  // Comments: #6A9955, italic
  { tag: mlgTags.mlgComment, color: '#6A9955', fontStyle: 'italic' },
  // Operators: #D4D4D4
  { tag: mlgTags.mlgOperator, color: '#D4D4D4' },
  // Punctuation: #D4D4D4
  { tag: mlgTags.mlgPunctuation, color: '#D4D4D4' },
  // Variables: #9CDCFE
  { tag: mlgTags.mlgVariable, color: '#9CDCFE' },
]);

// Create the language support
export function customLanguage() {
  return new LanguageSupport(customLanguageParser);
}

// Export the syntax highlighting extension
export const customSyntaxHighlighting = syntaxHighlighting(customHighlightStyle);
