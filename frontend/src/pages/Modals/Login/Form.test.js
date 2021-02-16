import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginForm from './Form';

const INIT = { email: '', password: '', confirmation: '' };
let inputs, signup, setSignup, handleSubmit, handleInput, login;
describe('LoginForm', () => {
  beforeEach(() => {
    signup = true;
    setSignup = () => (signup = !signup);
    handleSubmit = jest.fn();
    handleInput = jest.fn();
    const { getByText } = render(
      <LoginForm
        handleSubmit={handleSubmit}
        signup={signup}
        setSignup={setSignup}
        handleInput={handleInput}
        inputs={INIT}
        errors={INIT}
      />
    );
    inputs = document.querySelectorAll('input');
    login = getByText('Login');
  });

  it('renders', () => {
    const button = document.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('renders inputs passed from props', () => {
    expect(inputs.length).toBe(Object.keys(INIT).length);
  });

  it('calls handleInput on input change', () => {
    expect(handleInput).toBeCalledTimes(0);
    fireEvent.change(inputs[0], { target: { value: 'a' } });
    expect(handleInput).toBeCalledTimes(1);
  });

  it('handles form change on Login click', () => {
    expect(signup).toBe(true);
    fireEvent.click(login);
    expect(signup).toBe(false);
  });
});
