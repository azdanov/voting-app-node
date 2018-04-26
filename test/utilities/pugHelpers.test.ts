import { pugHelpers } from '../../src/utilities/pugHelpers';

describe('pugHelpers', () => {
  describe('chooseClass', () => {
    const { chooseClass } = pugHelpers;
    const values = {};
    const warnings = {};

    it('should choose is-danger class when warnings is truthy', () => {
      const field = 'test';
      warnings[field] = true;
      values[field] = false;

      expect(chooseClass(warnings, values, field)).toBe('is-danger');
    });

    it('should choose is-danger class when warnings and values are truthy', () => {
      const field = 'test';
      warnings[field] = true;
      values[field] = true;

      expect(chooseClass(warnings, values, field)).toBe('is-danger');
    });

    it('should choose is-success class when warnings is truthy', () => {
      const field = 'test';
      warnings[field] = false;
      values[field] = true;

      expect(chooseClass(warnings, values, field)).toBe('is-success');
    });

    it('should not choose a class when warnings and values are falsy', () => {
      const field = 'test';
      warnings[field] = false;
      values[field] = false;

      expect(chooseClass(warnings, values, field)).toBe('');
    });

    it('should choose a class if warnings contains similar field', () => {
      const field = 'passwordRepeat';
      warnings['password'] = true;
      warnings[field] = false;

      expect(chooseClass(warnings, values, field)).toBe('is-danger');
    });
  });
});
