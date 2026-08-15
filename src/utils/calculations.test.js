import { describe, it, expect } from 'vitest';
import {
  calculateCFt,
  calculateSqFt,
  calculateStairsType1,
  calculateStairsType2,
  calculateTMT
} from './calculations';

describe('Calculation Utilities', () => {
  it('calculates CFt correctly', () => {
    expect(calculateCFt(10, 5, 2, 1)).toBe(100);
    expect(calculateCFt(10, 5, 2, 2)).toBe(200);
    expect(calculateCFt(10, 5, 2)).toBe(100); // defaults number to 1
    expect(calculateCFt(10, 5, undefined)).toBe(0); // missing dimension yields 0
    expect(calculateCFt('10', '5', '2')).toBe(100); // parses strings
  });

  it('calculates SqFt correctly', () => {
    expect(calculateSqFt(10, 5, 1)).toBe(50);
    expect(calculateSqFt(10, 5, 3)).toBe(150);
    expect(calculateSqFt(10, 5)).toBe(50);
  });

  it('calculates Stairs Type 1 correctly', () => {
    // 0.5 * L * B * D * N
    expect(calculateStairsType1(10, 5, 2, 2)).toBe(100); // 0.5 * 10 * 5 * 2 * 2 = 100
  });

  it('calculates Stairs Type 2 correctly', () => {
    // L * W * D
    expect(calculateStairsType2(10, 5, 2)).toBe(100);
  });

  it('calculates TMT Steel correctly', () => {
    expect(calculateTMT(100, 5)).toBe(500);
  });
});
