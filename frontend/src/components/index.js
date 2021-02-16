import React from 'react';
import dayjs from 'dayjs';
import * as icons from '../icons';
import { TODAY } from '../tools/appointments';

// import { App } from '../Providers/Context';

export const Page = ({ id, children, addClass = '' }) => {
  // const { loading } = useContext(App);

  return (
    <div id={id} className={`page transition show ${addClass}`}>
      {children}
    </div>
  );
};
// <PageSkeleton id={`${id}-sk`} className={loading ? 'sk-show' : 'sk-hide}'} />;

export const Button = (props) => {
  let type = props?.type ? props.type : 'button';
  let style = 'btn';
  if (props?.size) style += `-${props.size}`;
  if (props?.addClass) style += ' ' + props.addClass;
  return (
    <button
      id={props?.id}
      className={style}
      type={type}
      autoFocus={props?.autoFocus || false}
      disabled={props?.disabled || false}
      onClick={props?.onClick || null}
    >
      {props?.label || null}
    </button>
  );
};

export const WithIcon = (props) => {
  const style = props?.addClass ? props.addClass + ' with-icon' : 'with-icon';
  return (
    <div className={style}>
      {props?.icon || null}
      {props.children}
    </div>
  );
};

export const Header = ({ header }) => {
  return (
    <WithIcon icon={icons.logo}>
      <h1>{header}</h1>
    </WithIcon>
  );
};

export const PWRequirements = (props) => {
  const style = props?.error ? 'error smaller password' : 'smaller password';
  return (
    <WithIcon addClass='pw-requirements' icon={icons.spacer}>
      <p className={style}>min. 8 digits: lower, upper, and num</p>
    </WithIcon>
  );
};

export const DatePicker = ({ handleChangeDate, date }) => {
  const ArrowLeft = icons.ArrowLeft;
  const ArrowRight = icons.ArrowRight;
  const today = dayjs(date).isSame(dayjs(TODAY));
  return (
    <div className='date-picker'>
      <ArrowLeft
        addClass={today ? 'v-hidden' : ''}
        onClick={today ? null : () => handleChangeDate('dec')}
      />
      <p className='date'>{date}</p>
      <ArrowRight onClick={() => handleChangeDate('inc')} />
    </div>
  );
};

export const Error = ({ error }) => {
  return <h2 className='error'>{error}</h2>;
};

export const Input = ({
  field,
  error,
  value,
  onChange,
  withIcon,
  autoFocus = false,
  placeholder = '',
}) => {
  const id = `input-${field}`;
  const labelId = `${id}-label`;
  const label = getLabel(field);
  const type = getType(field);
  const autoComplete = getAutoComplete(field);
  return (
    <div className='input-div'>
      {error && <Error error={error} />}
      {withIcon ? (
        <WithIcon icon={icons[field]}>
          <label id={labelId} htmlFor={id}>
            {label}
          </label>
        </WithIcon>
      ) : (
        <label id={labelId} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        autoFocus={autoFocus}
        id={id}
        name={field}
        type={type}
        className={error ? 'invalid' : ''}
        maxLength={field === 'zip' ? '5' : 99}
        value={value || ''}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={
          field === 'currentPassword' || field === 'id'
            ? '[hidden]'
            : placeholder
        }
      />
    </div>
  );
};

const getLabel = (field) => {
  switch (field) {
    case 'firstName':
      return 'First';
    case 'lastName':
      return 'Last';
    case 'dob':
      return 'Date of Birth';
    case 'newPassword':
      return 'New Password';
    case 'currentPassword':
      return 'Current Password';
    case 'confirmNewPassword':
      return 'Confirm New Password';
    case 'confirmation':
      return 'Confirm Your Password';
    default:
      return field.substr(0, 1).toUpperCase() + field.substr(1);
  }
};

const getType = (field) => {
  switch (field) {
    case 'phone':
      return 'tel';
    case 'dob':
      return 'date';
    case 'email':
      return 'email';
    case 'password':
    case 'confirmation':
    case 'currentPassword':
    case 'newPassword':
    case 'confirmNewPassword':
      return 'password';
    default:
      return 'text';
  }
};

const getAutoComplete = (field) => {
  switch (field) {
    case 'newPassword':
    case 'confirmNewPassword':
    case 'confirmation':
      return 'new-password';
    case 'password':
    case 'currentPassword':
      return 'current-password';
    case 'email':
      return 'username';
    default:
      return null;
  }
};
