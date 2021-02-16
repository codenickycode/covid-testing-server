const alertError = () => {
  setApp((prev) => ({ ...prev, error: 'I am an error!' }));
};
const alertConfirm = () => {
  setApp((prev) => ({
    ...prev,
    confirmation: 'I am a confirmation!',
  }));
};
const clearError = () => {
  setApp((prev) => ({ ...prev, error: '' }));
};
const clearConfirm = () => {
  setApp((prev) => ({
    ...prev,
    confirmation: '',
  }));
};

<div id='info-footer'>
  <div className='error'>{remember ? 'REMEMBER: TRUE' : 'REMEMBER: FALSE'}</div>
  <div className='error'>{loggedIn ? 'Logged in.' : 'Not logged in.'}</div>
  <div className='error'>{email.email || 'No email.'}</div>
  <button onClick={alertError}>Set Error</button>
  <button onClick={clearError}>Clear Error</button>
  <button onClick={alertConfirm}>Set Confirmation</button>
  <button onClick={clearConfirm}>Clear Confirmation</button>
</div>;
