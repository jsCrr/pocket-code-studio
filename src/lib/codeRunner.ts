export interface RunResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

type LogCallback = (type: 'log' | 'error' | 'warn' | 'info', message: string) => void;

/**
 * Run JavaScript code in the browser using eval with captured console output
 */
export const runJavaScript = async (
  code: string,
  onLog: LogCallback
): Promise<RunResult> => {
  const startTime = performance.now();
  const outputs: string[] = [];

  // Create a custom console that captures output
  const customConsole = {
    log: (...args: unknown[]) => {
      const msg = args.map(formatValue).join(' ');
      outputs.push(msg);
      onLog('log', msg);
    },
    error: (...args: unknown[]) => {
      const msg = args.map(formatValue).join(' ');
      outputs.push(`Error: ${msg}`);
      onLog('error', msg);
    },
    warn: (...args: unknown[]) => {
      const msg = args.map(formatValue).join(' ');
      outputs.push(`Warning: ${msg}`);
      onLog('warn', msg);
    },
    info: (...args: unknown[]) => {
      const msg = args.map(formatValue).join(' ');
      outputs.push(`Info: ${msg}`);
      onLog('info', msg);
    },
  };

  try {
    // Create a function with custom console injected
    const wrappedCode = `
      (function(console) {
        "use strict";
        ${code}
      })
    `;
    
    const fn = eval(wrappedCode);
    const result = fn(customConsole);
    
    const executionTime = performance.now() - startTime;

    // If there's a return value, add it to output
    if (result !== undefined) {
      const resultStr = formatValue(result);
      onLog('info', `Return value: ${resultStr}`);
      outputs.push(`=> ${resultStr}`);
    }

    return {
      success: true,
      output: outputs.join('\n'),
      executionTime,
    };
  } catch (error) {
    const executionTime = performance.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    onLog('error', errorMessage);
    
    return {
      success: false,
      output: outputs.join('\n'),
      error: errorMessage,
      executionTime,
    };
  }
};

/**
 * Run PHP code using the Piston API (external code execution service)
 */
export const runPHP = async (
  code: string,
  onLog: LogCallback
): Promise<RunResult> => {
  const startTime = performance.now();

  try {
    onLog('info', 'Executing PHP code via Piston API...');

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'php',
        version: '*',
        files: [
          {
            name: 'main.php',
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const executionTime = performance.now() - startTime;

    // Handle compilation/runtime errors
    if (data.compile && data.compile.stderr) {
      onLog('error', data.compile.stderr);
      return {
        success: false,
        output: data.compile.output || '',
        error: data.compile.stderr,
        executionTime,
      };
    }

    if (data.run) {
      if (data.run.stdout) {
        // Split output by lines and log each
        const lines = data.run.stdout.split('\n').filter((l: string) => l);
        lines.forEach((line: string) => onLog('log', line));
      }
      if (data.run.stderr) {
        onLog('error', data.run.stderr);
        return {
          success: false,
          output: data.run.stdout || '',
          error: data.run.stderr,
          executionTime,
        };
      }
      
      return {
        success: true,
        output: data.run.stdout || '',
        executionTime,
      };
    }

    return {
      success: true,
      output: '',
      executionTime,
    };
  } catch (error) {
    const executionTime = performance.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    onLog('error', `Failed to execute: ${errorMessage}`);
    
    return {
      success: false,
      output: '',
      error: errorMessage,
      executionTime,
    };
  }
};

/**
 * Format a value for console output
 */
function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
  if (Array.isArray(value)) {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Array]';
    }
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Object]';
    }
  }
  return String(value);
}

/**
 * Check if a language is runnable
 */
export const isRunnableLanguage = (language: string): boolean => {
  return ['javascript', 'php'].includes(language);
};

/**
 * Run code based on language
 */
export const runCode = async (
  code: string,
  language: string,
  onLog: LogCallback
): Promise<RunResult> => {
  switch (language) {
    case 'javascript':
      return runJavaScript(code, onLog);
    case 'php':
      return runPHP(code, onLog);
    default:
      return {
        success: false,
        output: '',
        error: `Running ${language} code is not supported yet.`,
      };
  }
};
