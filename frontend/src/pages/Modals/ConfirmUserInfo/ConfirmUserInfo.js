import React, { useState, useContext } from 'react';
import { LoginSkeleton } from '../../../components/Skeletons.js';
import { App } from '../../../Providers/Context.js';
import { ReactComponent as ConfirmSVG } from '../../../img/confirm.svg';
import * as icons from '../../../icons';
import { checkRequired, formatPhone } from '../../../tools/valid';
import { Button, Input, WithIcon, Header } from '../../../components/index.js';
import useUpdateAccountBasic from './useUpdateAccountBasic.js';

const ConfirmUserInfo = ({ setInfoIsConfirmed }) => {
  const { loading, user } = useContext(App);
  const updateAccountBasic = useUpdateAccountBasic();

  const [inputs, setInputs] = useState({
    firstName: user?.name?.firstName || '',
    lastName: user?.name?.lastName || '',
    phone: user?.phone?.phone || '',
    dob: user?.dob?.dob || '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
  });

  const handleInput = ({ target: { name, value } }) => {
    if (name === 'phone') value = formatPhone(value);
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [newErrors, interupt] = checkRequired(inputs);
    setErrors(newErrors);
    if (interupt) {
      for (let [key, val] of Object.entries(newErrors)) {
        if (val) document.querySelector(`input[name=${key}]`).focus();
      }
      return;
    }
    updateAccountBasic(inputs, () => setInfoIsConfirmed(true));
  };

  return loading ? (
    <LoginSkeleton
      header='Booking...'
      message='Please wait while we book your appointment.'
    />
  ) : (
    <div id='confirm-info' className='flex-col'>
      <Header header='Before you confirm' />
      <ConfirmSVG />
      <form onSubmit={handleSubmit}>
        <WithIcon icon={icons.profile}>
          <Input
            field='firstName'
            error={errors.firstName}
            value={inputs.firstName}
            onChange={handleInput}
          />
          <Input
            field='lastName'
            error={errors.lastName}
            value={inputs.lastName}
            onChange={handleInput}
          />
        </WithIcon>
        <WithIcon icon={icons.calendar}>
          <Input
            field='dob'
            error={errors.dob}
            value={inputs.dob}
            onChange={handleInput}
          />
        </WithIcon>
        <WithIcon icon={icons.phone}>
          <Input
            field='phone'
            error={errors.phone}
            value={inputs.phone}
            onChange={handleInput}
          />
        </WithIcon>
        <Button type='submit' label='Confirm Appointment' />
      </form>
    </div>
  );
};

export default ConfirmUserInfo;
