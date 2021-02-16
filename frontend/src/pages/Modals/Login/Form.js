import React, { useState } from 'react';
import { ReactComponent as CreateAccount } from '../../../img/createAccount.svg';
import * as icons from '../../../icons';
import { Button, PWRequirements, WithIcon, Error } from '../../../components';

const LoginForm = ({
  forgot,
  setForgot,
  handleSubmit,
  signup,
  setSignup,
  handleInput,
  inputs,
  errors,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div id='login-form' className='flex-col'>
      <Header signup={signup} />
      <CreateAccount />
      <form onSubmit={handleSubmit}>
        <WithIcon icon={icons.email}>
          <label htmlFor='email'>Email</label>
          <input
            name='email'
            type='email'
            placeholder='Email'
            value={inputs.email}
            onChange={handleInput}
          />
        </WithIcon>
        {!forgot && (
          <WithIcon icon={icons.password}>
            <label htmlFor='password'>Password</label>
            <input
              name='password'
              type={show ? 'text' : 'password'}
              placeholder='Password'
              value={inputs.password}
              onChange={handleInput}
            />
            <div
              className='show-password'
              onClick={() => setShow((show) => !show)}
            >
              {show ? icons.noShow : icons.show}
            </div>
          </WithIcon>
        )}
        {signup && <PWRequirements error={errors.password} />}
        {!signup && !forgot && <ForgotPassword setForgot={setForgot} />}
        {signup && (
          <WithIcon icon={icons.password}>
            <label htmlFor='confirmation'>Password Confirmation</label>
            <input
              name='confirmation'
              type={show ? 'text' : 'password'}
              placeholder='Confirm Your Password'
              value={inputs.confirmation}
              onChange={handleInput}
            />
          </WithIcon>
        )}
        {errors.email && <Error error={errors.email} />}
        {errors.password && <Error error={errors.password} />}
        {errors.confirmation && <Error error={errors.confirmation} />}
        <Button
          type='submit'
          label={
            signup
              ? 'Create An Account'
              : forgot
              ? 'Reset Your Password'
              : 'Login'
          }
        />
      </form>
      <SignupOrLogin
        signup={signup}
        setSignup={setSignup}
        forgot={forgot}
        setForgot={setForgot}
      />
    </div>
  );
};

export default LoginForm;

const Header = ({ signup }) => {
  return (
    <div id='login-header' className='item'>
      <WithIcon icon={icons.logo}>
        <h1>{signup ? 'Create an' : 'Login to your'} account</h1>
      </WithIcon>
    </div>
  );
};

const SignupOrLogin = ({ signup, setSignup, forgot, setForgot }) => {
  const handleClick = () => {
    if (signup) {
      setSignup(false);
    } else {
      setForgot(false);
      setSignup(true);
    }
  };
  return (
    <div id='signup-or-login'>
      <p>{signup ? 'Already' : "Don't"} have an account?</p>
      <h2 onClick={handleClick}>{signup ? 'Login' : 'Sign up'}</h2>
    </div>
  );
};

const ForgotPassword = ({ setForgot }) => {
  return (
    <p className='small'>
      Forgot your password?
      <span className='small click' onClick={() => setForgot(true)}>
        Click here
      </span>
    </p>
  );
};
