import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom';
import { Button, Header } from '../../components';
import { ReactComponent as ConfirmedSVG } from '../../img/confirmed.svg';
import { ReactComponent as ErrorSVG } from '../../img/error.svg';
import { App } from '../../Providers/Context';

export default function AppointmentConfirmed() {
  const history = useHistory();
  const { error } = useContext(App);

  const goToAppointments = () => {
    history.push('/appointments');
  };

  return ReactDOM.createPortal(
    <>
      <div className='overlay' onClick={goToAppointments}></div>
      <div className='modal'>
        <div id='appt-confirmed'>
          <Header header='Appointment confirmed' />
          {error ? (
            <div id='booking-error'>
              <p>
                There was a problem booking your appointment. <br />
                Please try again later.
              </p>
              <ErrorSVG />
            </div>
          ) : (
            <ConfirmedSVG />
          )}
          <Button label='View My Appointments' onClick={goToAppointments} />
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
