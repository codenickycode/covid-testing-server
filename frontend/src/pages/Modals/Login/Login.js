import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import tools from '../../../tools/index.js';
import LoginForm from './Form.js';
import useLogin from './useLogin.js';
import { LoginSkeleton } from '../../../components/Skeletons.js';
import { App, SetApp } from '../../../Providers/Context.js';

const INIT = { email: '', password: '', confirmation: '' };

const Login = ({ closeModal }) => {
  const { loading, error } = useContext(App);
  const setApp = useContext(SetApp);
  const login = useLogin();

  const [signup, setSignup] = useState(true);
  const [forgot, setForgot] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [inputs, setInputs] = useState(INIT);
  const [errors, setErrors] = useState(INIT);

  const setError = (field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const setInvalid = (field, message) => {
    setError(field, message);
    document.querySelector(`input[name=${field}]`).focus();
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setError(name, '');
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputs.email) return setInvalid('email', 'Email required');
    if (forgot) {
      setErrors(INIT);
      resetPassword(inputs.email);
    } else {
      if (!tools.validPassword(inputs.password))
        return setInvalid('password', 'Invalid password');
      if (signup) {
        if (inputs.password !== inputs.confirmation)
          return setInvalid('confirmation', "Confirmation doesn't match");
        setErrors(INIT);
        login('register', inputs.email, inputs.password);
      } else {
        login('login', inputs.email, inputs.password);
      }
    }
  };

  const resetPassword = async (email) => {
    setApp((prev) => ({ ...prev, loading: true }));
    let confirmation = '',
      error = '',
      pwReset = false;
    try {
      const res = await axios.post('/common/forgot', { email });
      confirmation = res.data;
      pwReset = true;
    } catch (e) {
      error = e.response?.data || e.message;
      console.log(error);
    } finally {
      setApp((prev) => ({ ...prev, loading: false, error, confirmation }));
      setPasswordReset(pwReset);
    }
  };

  useEffect(() => {
    if (error === 'User already registered.') {
      setError('email', error);
      document.querySelector('input[name="email"]').focus();
    }
  }, [error]);

  useEffect(() => {
    setErrors(INIT);
  }, [signup]);

  return ReactDOM.createPortal(
    <>
      <div className='overlay' onClick={closeModal}></div>
      <div className='modal'>
        {loading ? (
          <LoginSkeleton
            header={signup ? 'Registering...' : 'Logging In...'}
            message='Please wait while we complete your request.'
          />
        ) : passwordReset ? (
          <div id='password-reset'>
            <h2>Password Reset</h2>
            <p>A temporary password has been sent to your email.</p>
            <p>
              Click here to{' '}
              <span className='click' onClick={closeModal}>
                close this message
              </span>
            </p>
          </div>
        ) : (
          <LoginForm
            signup={signup}
            setSignup={setSignup}
            forgot={forgot}
            setForgot={setForgot}
            handleInput={handleInput}
            handleSubmit={handleSubmit}
            inputs={inputs}
            errors={errors}
          />
        )}
      </div>
    </>,
    document.getElementById('portal')
  );
};
export default Login;
