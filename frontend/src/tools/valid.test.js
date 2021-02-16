import { validPassword, validNum, checkRequired } from './valid';

describe('validPassword', () => {
  it('validates >=8, lower, upper, and num', () => {
    expect(validPassword('asdfASDF1')).toBeTruthy();
    expect(validPassword('asdfasdf1')).toBeFalsy();
    expect(validPassword('ASDFASDF1')).toBeFalsy();
    expect(validPassword('asdfASDFF')).toBeFalsy();
    expect(validPassword('asdfAS1')).toBeFalsy();
    expect(validPassword('')).toBeFalsy();
  });
});

describe('validNum', () => {
  it('accepts empty', () => {
    expect(validNum('')).toBe(true);
  });
  it('checks last digit entered to be a number', () => {
    expect(validNum('1')).toBeTruthy();
    expect(validNum('a')).toBeFalsy();
    expect(validNum('A')).toBeFalsy();
    expect(validNum('|')).toBeFalsy();
  });
});

describe('checkRequired', () => {
  let valid = { a: 'abcd', b: 1234 };
  let invalid = { a: 'abcd', b: '' };
  it('shows no error for valid input', () => {
    expect(checkRequired(valid)[0].a).toBe('');
    expect(checkRequired(valid)[0].b).toBe('');
    expect(checkRequired(invalid)[0].a).toBe('');
  });
  it("shows 'required' from missing input", () => {
    expect(checkRequired(invalid)[0].b).toBe('required');
  });
  it('returns false for interupt if valid', () => {
    expect(checkRequired(valid)[1]).toBe(false);
  });
  it('returns true for interupt if invalid', () => {
    expect(checkRequired(invalid)[1]).toBe(true);
  });
});
