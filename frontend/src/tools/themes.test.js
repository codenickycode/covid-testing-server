import { LIGHT_THEME, DARK_THEME } from './themes';

describe('themes.js', () => {
  it('contains the correct theme', () => {
    expect(LIGHT_THEME).toContain('--white: #fff');
    expect(LIGHT_THEME).toContain('--black: #161f27');
    expect(DARK_THEME).toContain('--white: #161f27');
    expect(DARK_THEME).toContain('--black: #fff');
  });
});
