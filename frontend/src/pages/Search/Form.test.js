import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchForm from './Form';
import { TESTS } from '../../tools/info/TESTS';

let tests, zipInput, submit;
const handleSubmit = jest.fn();
describe('SearchForm', () => {
  beforeEach(() => {
    render(<SearchForm handleSubmit={handleSubmit} />);
    tests = document.querySelectorAll('.type');
    zipInput = document.querySelector('input');
    submit = document.querySelector('button[type="submit"]');
  });

  it('renders each test type from TESTS', () => {
    expect(tests.length).toBe(Object.keys(TESTS).length);
  });

  it('selects/unselects tests on click', () => {
    tests.forEach((test) => {
      expect(test.classList).not.toContain('selected');
    });

    fireEvent.click(tests[0]);
    expect(tests[0].classList).toContain('selected');
    expect(tests[1].classList).not.toContain('selected');

    tests.forEach((test) => {
      fireEvent.click(test);
    });
    expect(tests[0].classList).not.toContain('selected');
    expect(tests[1].classList).toContain('selected');
  });

  it('accepts zip input', () => {
    fireEvent.change(zipInput, { target: { value: '1' } });
    expect(zipInput.value).toBe('1');
  });

  it('doesnt accept non-numerical zip input', () => {
    fireEvent.change(zipInput, { target: { value: 'a' } });
    expect(zipInput.value).toBe('');
  });

  it('doesnt submit if zip < 5 digits', () => {
    fireEvent.click(submit);
    expect(handleSubmit).toHaveBeenCalledTimes(0);
    expect(document.querySelector('.error')).toBeTruthy();
  });

  it('submits if valid zip entered', () => {
    fireEvent.change(zipInput, { target: { value: '90210' } });
    fireEvent.click(submit);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.error')).toBeFalsy();
  });
});
