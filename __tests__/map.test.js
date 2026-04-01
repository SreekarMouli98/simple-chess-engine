const mapper = require('../map');

describe('Map conversions', () => {
  test('converts from algebraic to numeric position', () => {
    expect(mapper.getNumericPosition('A1')).toEqual([7, 0]);
    expect(mapper.getNumericPosition('H8')).toEqual([0, 7]);
    expect(mapper.getNumericPosition('C6')).toEqual([2, 2]);
  });

  test('converts from numeric to algebraic position', () => {
    expect(mapper.getAlphaPosition([7, 0])).toBe('A1');
    expect(mapper.getAlphaPosition([0, 7])).toBe('H8');
    expect(mapper.getAlphaPosition([2, 2])).toBe('C6');
  });

  test('handles invalid numeric inputs by returning current behavior', () => {
    expect(mapper.getNumericPosition('A9')).toEqual([-1, 0]);
    expect(() => mapper.getNumericPosition('')).toThrow();
  });

  test('handles out-of-range numeric to algebraic conversion', () => {
    expect(mapper.getAlphaPosition([8, 0])).toBe('A0');
  });
});
