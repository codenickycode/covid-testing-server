import React, { useContext } from 'react';
import { SetApp } from '../../Providers/Context';

export const Preferences = ({ user: { preferences }, setSaving }) => {
  const { dark, remember, notifications } = preferences;
  const setApp = useContext(SetApp);

  const handleCheck = ({ target: { name } }) => {
    setSaving(true);
    setApp((prev) => ({
      ...prev,
      settingsUpdated: true,
      user: {
        ...prev.user,
        preferences: {
          ...prev.user.preferences,
          [name]: !prev.user.preferences[name],
        },
      },
    }));
  };

  return (
    <ol className='switches'>
      <Preference
        name='dark'
        label='Dark Mode'
        preference={dark || false}
        handleCheck={handleCheck}
      />
      <Preference
        name='remember'
        label='Remember me'
        preference={remember || false}
        handleCheck={handleCheck}
      />
      <Preference
        name='notifications'
        label='Email notifications'
        preference={notifications || false}
        handleCheck={handleCheck}
      />
    </ol>
  );
};

const Preference = ({ name, label, preference, handleCheck }) => {
  const id = `toggle-${name}`;
  return (
    <li>
      <input
        type='checkbox'
        id={id}
        name={name}
        checked={preference}
        onChange={handleCheck}
      />
      <label htmlFor={id}>
        <h2>{label}</h2>
        <span></span>
      </label>
    </li>
  );
};
