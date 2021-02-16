import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Page, Header } from '../../components';
import { Preferences } from './Preferences';
import { LogoutButton } from './LogoutButton';
import { App } from '../../Providers/Context';

export default function Settings() {
  const { user } = useContext(App);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => setSaving(false), 2000);
    return () => clearTimeout(timer);
  }, [saving]);

  return !user ? (
    <Redirect to='/gateway/settings' />
  ) : (
    <Page id='settings'>
      <Header header='Set your preferences' />
      <Preferences user={user} setSaving={setSaving} />
      <LogoutButton saving={saving} />
    </Page>
  );
}
