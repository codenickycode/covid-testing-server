import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { App } from '../Providers/Context.js';

export default function Alert() {
  const { error, confirmation } = useContext(App);

  return ReactDOM.createPortal(
    <div id='alert-modal'>
      <div className={error ? 'alert-init alert-error' : 'alert-init'}>
        <h3>{error}</h3>
        {error && <span></span>}
      </div>
      <div className={confirmation ? 'alert-init alert-success' : 'alert-init'}>
        <h3>{confirmation}</h3>
        {confirmation && <span></span>}
      </div>
    </div>,
    document.getElementById('alert')
  );
}
