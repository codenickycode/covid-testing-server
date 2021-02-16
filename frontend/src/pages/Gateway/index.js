import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { App } from '../../Providers/Context.js';
import useGetClient from '../../tools/useGetClient';
import LoginModal from '../Modals/Login/Login';
import {
  AccountSkeleton,
  AppointmentsSkeleton,
  SettingsSkeleton,
} from '../../components/Skeletons.js';

const Gateway = () => {
  const history = useHistory();
  const { to } = useParams();
  const { user, settings } = useContext(App);
  const getClient = useGetClient();

  const [initial, setInitial] = useState(true);

  useEffect(() => {
    if (user) {
      history.replace(`/${to}`);
    }

    if (initial) {
      if (settings.remember && !user) {
        setInitial(false);
        getClient();
      }
    }
  }, [user, settings, history, to, initial, getClient]);

  return !settings.remember ? (
    <LoginModal
      closeModal={
        history.globalHistory ? history.goBack : () => history.push('/')
      }
    />
  ) : to === 'account' ? (
    <AccountSkeleton />
  ) : to === 'appointments' ? (
    <AppointmentsSkeleton />
  ) : to === 'settings' ? (
    <SettingsSkeleton />
  ) : null;
};

export default Gateway;
