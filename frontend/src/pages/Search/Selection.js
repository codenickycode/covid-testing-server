import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { App, SetApp } from '../../Providers/Context.js';
import SelectionJSX from './Selection/SelectionJSX.js';
import ConfirmationModal from '../Modals/Confirmation/Confirmation.js';
import useGetClient from '../../tools/useGetClient';

const Selection = ({ selection, date, handleChangeDate, refreshLocations }) => {
  const setApp = useContext(SetApp);
  const { user, settings } = useContext(App);
  const getClient = useGetClient();

  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);

  const selectTest = (type) => {
    let newTests = [...selectedTests];
    const index = selectedTests.indexOf(type);
    index === -1 ? newTests.push(type) : newTests.splice(index, 1);
    setSelectedTests(newTests);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!time || selectedTests.length === 0) return;
    if (!user && settings.remember) {
      getClient(confirm);
    } else {
      confirm();
    }
  };

  const confirm = () => {
    const newAppointment = {
      location: selection,
      date,
      time: time,
      tests: selectedTests,
    };
    setApp((prev) => ({ ...prev, appointment: newAppointment }));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    refreshLocations(date);
  };

  return !selection ? (
    <Redirect to='/search/form' />
  ) : (
    <>
      {showModal && <ConfirmationModal closeModal={handleCloseModal} />}
      <SelectionJSX
        selection={selection}
        date={date}
        handleChangeDate={handleChangeDate}
        time={time}
        setTime={setTime}
        selectedTests={selectedTests}
        selectTest={selectTest}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default Selection;
