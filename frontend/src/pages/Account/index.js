import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import dayjs from 'dayjs';
import { App } from '../../Providers/Context';
import { AccountItem } from './Item';
import { Page, WithIcon } from '../../components';
import { getSS } from '../../tools/storage';
import { logo } from '../../icons';

export default function Account() {
  const user = getSS('app').user;
  return !user ? (
    <Redirect to='/gateway/account' />
  ) : (
    <Page id='account'>
      <AccountHeader />
      <AccountItemsList />
    </Page>
  );
}

const AccountHeader = () => {
  const { headerName } = useContext(App);

  const now = new dayjs();
  const time =
    now.$H > 3 && now.$H < 12
      ? 'morning'
      : now.$H < 17
      ? 'afternoon'
      : 'evening';

  return (
    <div id='account-header'>
      <WithIcon icon={logo}>
        <h1>
          {!headerName && `Good ${time}`}
          {headerName && `Hello, ${headerName}`}
        </h1>
      </WithIcon>
    </div>
  );
};

const AccountItemsList = () => {
  const fields = {
    name: ['firstName', 'lastName'],
    address: ['street', 'city', 'state', 'zip'],
    phone: ['phone'],
    dob: ['dob'],
    email: ['email'],
    password: ['currentPassword', 'newPassword', 'confirmNewPassword'],
    insurance: ['provider', 'id'],
    emergency_contact: ['name', 'phone', 'relation'],
  };
  return (
    <div id='account-fields-list'>
      {Object.entries(fields).map(([property, fields]) => {
        return (
          <AccountItem
            key={property + '-ac'}
            property={property}
            fields={fields}
          />
        );
      })}
    </div>
  );
};
