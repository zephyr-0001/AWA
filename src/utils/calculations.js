/**
 * Core calculation formulas for the AWA Form.
 */

export const calculateCFt = (length, breadth, depth, number = 1) => {
  const l = parseFloat(length) || 0;
  const b = parseFloat(breadth) || 0;
  const d = parseFloat(depth) || 0;
  const n = parseFloat(number) || 1;
  return l * b * d * n;
};

export const calculateSqFt = (length, breadth, number = 1) => {
  const l = parseFloat(length) || 0;
  const b = parseFloat(breadth) || 0;
  const n = parseFloat(number) || 1;
  return l * b * n;
};

export const calculateStairsType1 = (length, breadth, depth, number = 1) => {
  const l = parseFloat(length) || 0;
  const b = parseFloat(breadth) || 0;
  const d = parseFloat(depth) || 0;
  const n = parseFloat(number) || 1;
  return 0.5 * l * b * d * n;
};

export const calculateStairsType2 = (length, width, depth) => {
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const d = parseFloat(depth) || 0;
  return l * w * d;
};

export const calculateTMT = (area, kgs) => {
  const a = parseFloat(area) || 0;
  const k = parseFloat(kgs) || 0;
  return a * k;
};
