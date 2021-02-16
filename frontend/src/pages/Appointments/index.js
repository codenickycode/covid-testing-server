import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import tools from '../../tools/index.js';
import { App } from '../../Providers/Context.js';
import { Page } from '../../components';
import { AppointmentItem } from './Item';

export default function AppointmentsPage() {
  const { user } = useContext(App);
  const [showPast, setShowPast] = useState(false);
  return !user ? (
    <Redirect to='/gateway/appointments' />
  ) : (
    <Page id='appointments'>
      <AppointmentTabs showPast={showPast} setShowPast={setShowPast} />
      <AppointmentsList showPast={showPast} user={user} />
    </Page>
  );
}

const AppointmentTabs = ({ showPast, setShowPast }) => {
  const uClass = showPast ? 'tab' : 'tab tab-selected';
  const uClick = () => setShowPast(false);
  const pClass = showPast ? 'tab tab-selected' : 'tab';
  const pClick = () => setShowPast(true);
  return (
    <div className='tabs'>
      <h1 className={uClass} onClick={uClick}>
        Upcoming
      </h1>
      <h1 className={pClass} onClick={pClick}>
        Past
      </h1>
    </div>
  );
};

const AppointmentsList = ({ showPast, user }) => {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    const appts = [...user.appointments] || [];
    const [upcomingSorted, pastSorted] = tools.sortAppointments(appts);
    setUpcoming(upcomingSorted);
    setPast(pastSorted);
  }, [user]);

  const appointments = showPast ? past : upcoming;

  return (
    <div id='appointments-list'>
      {appointments.length === 0 ? (
        <h1 className='m-top-2 center'>
          No {showPast ? 'past' : 'upcoming'} appointments.
        </h1>
      ) : (
        appointments.map((appointment) => (
          <AppointmentItem key={appointment._id} appointment={appointment} />
        ))
      )}
    </div>
  );
};
