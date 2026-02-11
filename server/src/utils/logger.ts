import util from 'util';

const SENSITIVE_PATTERNS = [
  'Consumer Key',
  'Secret Key',
  'Bearer Token',
  'Client Secret',
  'Client Secret ID',
  'AAAAAA' // Common prefix for Twitter Bearer Tokens
];

/**
 * Monkey-patches console methods to filter out sensitive information.
 */
export function maskSensitiveLogs() {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  const hasSensitiveInfo = (arg: any): boolean => {
    if (typeof arg === 'string') {
       return SENSITIVE_PATTERNS.some(pattern => arg.includes(pattern));
    }
    
    // Check objects/arrays by stringifying
    try {
      const str = JSON.stringify(arg);
      return SENSITIVE_PATTERNS.some(pattern => str && str.includes(pattern));
    } catch (e) {
      return false;
    }
  };

  const sanitizeAndLog = (level: 'log' | 'warn' | 'error', args: any[]) => {
    // If ANY argument contains sensitive info, redact the ENTIRE log line.
    // This blocks cases like console.log("Secret:", secretValue) where secretValue depends on context.
    const containsSensitive = args.some(hasSensitiveInfo);

    if (containsSensitive) {
      const patternsFound = SENSITIVE_PATTERNS.filter(pattern => 
        args.some(arg => {
          if (typeof arg === 'string') return arg.includes(pattern);
          try { return JSON.stringify(arg).includes(pattern); } catch { return false; }
        })
      );
      
      const replacement = `[LOG REDACTED: Contains sensitive info (${patternsFound.join(', ')})]`;
      
      if (level === 'log') originalLog.call(console, replacement);
      else if (level === 'warn') originalWarn.call(console, replacement);
      else if (level === 'error') originalError.call(console, replacement);
      return;
    }

    // Pass through safe logs
    if (level === 'log') originalLog.apply(console, args);
    else if (level === 'warn') originalWarn.apply(console, args);
    else if (level === 'error') originalError.apply(console, args);
  };

  console.log = (...args: any[]) => sanitizeAndLog('log', args);
  console.warn = (...args: any[]) => sanitizeAndLog('warn', args);
  console.error = (...args: any[]) => sanitizeAndLog('error', args);

  console.info('🛡️ Sensitive log masking enabled (strict mode)');
}
