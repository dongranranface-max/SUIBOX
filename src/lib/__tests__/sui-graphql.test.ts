import { describe, it, expect } from 'vitest';
import { formatSUI, formatNumber, isValidSuiAddress } from '../sui-graphql';

describe('formatSUI', () => {
  it('converts mist to SUI with 4 decimal places', () => {
    expect(formatSUI(1_000_000_000)).toBe('1.0000');
    expect(formatSUI(500_000_000)).toBe('0.5000');
    expect(formatSUI(0)).toBe('0.0000');
  });

  it('accepts string input', () => {
    expect(formatSUI('2000000000')).toBe('2.0000');
  });
});

describe('formatNumber', () => {
  it('formats billions', () => {
    expect(formatNumber(1_500_000_000)).toBe('1.50B');
  });

  it('formats millions', () => {
    expect(formatNumber(2_300_000)).toBe('2.30M');
  });

  it('formats thousands', () => {
    expect(formatNumber(5_500)).toBe('5.50K');
  });

  it('formats small numbers as-is', () => {
    expect(formatNumber(42)).toBe('42.00');
  });
});

describe('isValidSuiAddress', () => {
  it('accepts a valid 64-hex address', () => {
    const valid = '0x' + 'a'.repeat(64);
    expect(isValidSuiAddress(valid)).toBe(true);
  });

  it('accepts mixed case hex', () => {
    const mixed = '0x' + 'aAbBcCdD'.repeat(8);
    expect(isValidSuiAddress(mixed)).toBe(true);
  });

  it('rejects address that is too short', () => {
    expect(isValidSuiAddress('0x1234')).toBe(false);
  });

  it('rejects address without 0x prefix', () => {
    expect(isValidSuiAddress('a'.repeat(64))).toBe(false);
  });

  it('rejects address with invalid characters', () => {
    expect(isValidSuiAddress('0x' + 'g'.repeat(64))).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidSuiAddress('')).toBe(false);
  });
});
