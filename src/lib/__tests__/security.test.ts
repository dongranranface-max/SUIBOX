import { describe, it, expect, beforeEach } from 'vitest';
import { InputValidator, ipLimiter, securityConfig } from '../security';

describe('InputValidator.sanitize', () => {
  it('encodes angle brackets to prevent XSS', () => {
    const result = InputValidator.sanitize('<script>alert("xss")</script>');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
  });

  it('encodes ampersands and quotes', () => {
    expect(InputValidator.sanitize('&')).toBe('&amp;');
    expect(InputValidator.sanitize('"')).toBe('&quot;');
    expect(InputValidator.sanitize("'")).toBe('&#x27;');
  });

  it('returns empty string for non-string input', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(InputValidator.sanitize(null as any)).toBe('');
  });

  it('leaves clean strings unchanged', () => {
    expect(InputValidator.sanitize('hello world')).toBe('hello world');
    expect(InputValidator.sanitize('script running')).toBe('script running');
  });
});

describe('InputValidator.validateAddress', () => {
  it('validates a correct SUI address', () => {
    expect(InputValidator.validateAddress('0x' + 'a'.repeat(64))).toBe(true);
  });

  it('rejects invalid addresses', () => {
    expect(InputValidator.validateAddress('not-an-address')).toBe(false);
    expect(InputValidator.validateAddress('')).toBe(false);
  });
});

describe('InputValidator.validateAmount', () => {
  it('accepts amounts within range', () => {
    expect(InputValidator.validateAmount(50, 1, 100)).toBe(true);
  });

  it('rejects amounts outside range', () => {
    expect(InputValidator.validateAmount(0, 1, 100)).toBe(false);
    expect(InputValidator.validateAmount(101, 1, 100)).toBe(false);
  });

  it('rejects NaN', () => {
    expect(InputValidator.validateAmount(NaN, 0, 100)).toBe(false);
  });
});

describe('IPRateLimiter', () => {
  beforeEach(() => {
    // Access internal state for a fresh test scenario via a fresh import would be ideal;
    // here we test the public API only.
  });

  it('allows first account creation', () => {
    expect(ipLimiter.canCreateAccount('1.2.3.4')).toBe(true);
  });

  it('tracks account count after recording', () => {
    const ip = '10.0.0.1';
    ipLimiter.recordAccount(ip, 'account-abc');
    expect(ipLimiter.getAccountCount(ip)).toBeGreaterThanOrEqual(1);
  });

  it('blocks accounts when limit is reached', () => {
    const ip = '192.168.99.1';
    const limit = securityConfig.maxAccountsPerIP;
    for (let i = 0; i < limit; i++) {
      ipLimiter.recordAccount(ip, `acc-${i}`);
    }
    expect(ipLimiter.canCreateAccount(ip)).toBe(false);
  });
});
