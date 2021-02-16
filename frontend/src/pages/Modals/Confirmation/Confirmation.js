import React, { useRef, useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useBookAppointment from './useBookAppointment';
import LoginModal from '../Login/Login.js';
import ConfirmUserInfo from '../ConfirmUserInfo/ConfirmUserInfo.js';
import { App } from '../../../Providers/Context';
import AppointmentConfirmed from '../../Appointments/AppointmentConfirmed';

const ConfirmationModal = ({ closeModal }) => {
  const bookAppointment = useBookAppointment();
  const { user, appointment } = useContext(App);

  const [infoIsConfirmed, setInfoIsConfirmed] = useState(false);
  const bookingRef = useRef('');

  useEffect(() => {
    if (!bookingRef.current && user && infoIsConfirmed) {
      bookingRef.current = 'Booking...';
      bookAppointment(appointment);
    }
  }, [bookingRef, bookAppointment, appointment, user, infoIsConfirmed]);

  return ReactDOM.createPortal(
    !user ? (
      <LoginModal closeModal={closeModal} />
    ) : (
      <>
        <div className='overlay' onClick={closeModal}></div>
        <div className='modal'>
          {!infoIsConfirmed ? (
            <ConfirmUserInfo
              closeModal={closeModal}
              setInfoIsConfirmed={setInfoIsConfirmed}
            />
          ) : (
            <AppointmentConfirmed />
          )}
        </div>
      </>
    ),
    document.getElementById('portal')
  );
};

export default ConfirmationModal;
