import React, { useRef, useEffect, useContext, useReducer } from 'react';
import axios from 'axios';
import tools from '../../tools/index.js';
import { SetApp } from '../../Providers/Context';
import { AccountItemSkeleton } from '../../components/Skeletons.js';
import { getSS } from '../../tools/storage.js';
import { PreviewText, CancelBtnOrEmpty, SaveOrEditBtns, Inputs } from './JSX';
import * as icons from '../../icons';
import { reducer, ACTIONS } from './reducer';

export const AccountItem = ({ property, fields }) => {
  const title = getTitle(property);
  let user = getSS('app').user;
  const setApp = useContext(SetApp);

  const INITIAL_STATE = {
    userError: '',
    saving: false,
    updated: false,
    input: user[property],
    prevInput: user[property],
    preview: null,
    edit: false,
  };
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const editRef = useRef(null);

  useEffect(() => {
    if (state.preview === null) {
      dispatch({
        type: ACTIONS.SET_PREVIEW,
        payload: state.prevInput[fields[0]],
      });
    }
  }, [state, fields]);

  useEffect(() => {
    if (state.userError && !state.edit) dispatch({ type: ACTIONS.OPEN });
  }, [state]);

  useEffect(() => {
    if (state.edit && editRef.current) tools.scrollIntoView(editRef, 'end');
  }, [state, editRef]);

  useEffect(() => {
    if (state.saving) setApp((prev) => ({ ...prev, navDisabled: true }));
  }, [state, setApp]);

  const handleToggle = () => {
    if (property === 'password') togglePassword();
    else toggleEdit();
  };

  const toggleEdit = () => {
    if (state.saving) return;
    if (!state.edit) dispatch({ type: ACTIONS.OPEN });
    else {
      if (state.updated) save();
      dispatch({ type: ACTIONS.CLOSE });
    }
  };

  const togglePassword = () => {
    if (!state.edit) {
      toggleEdit();
    } else if (!tools.validPassword(state.input.newPassword)) {
      dispatch({
        type: ACTIONS.SET_USER_ERROR,
        payload: 'Invalid new password',
      });
    } else if (state.input.newPassword !== state.input.confirmNewPassword) {
      dispatch({
        type: ACTIONS.SET_USER_ERROR,
        payload: "Confirmation doesn't match",
      });
    } else {
      toggleEdit();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleToggle();
    if (e.key === 'Escape') cancel(e);
  };

  const handleInput = ({ target: { value } }, key) => {
    if (key === 'zip' && !tools.validNum(value)) return;
    if (key === 'phone') value = tools.formatPhone(value);
    dispatch({ type: ACTIONS.INPUT, payload: { key, value } });
  };

  const cancel = (e) => {
    e.stopPropagation();
    dispatch({ type: ACTIONS.CANCEL });
  };

  const save = async () => {
    if (
      property === 'phone' &&
      state.input.phone &&
      state.input.phone.length < 13
    ) {
      dispatch({
        type: ACTIONS.SET_USER_ERROR,
        payload: '10-digits required',
      });
      return;
    }
    dispatch({ type: ACTIONS.SET_SAVING, payload: true });
    const req = { ...state.input };
    if (property === 'password') delete req.confirmNewPassword;
    let newProperty = { ...state.prevInput },
      newError = '';
    try {
      const res = await axios.post(`/common/update/${property}`, req);
      if (property !== 'password') newProperty = res.data[property];
      if (property === 'insurance') newProperty.id = '';
    } catch (e) {
      newError = e.response?.data || e.message;
    } finally {
      dispatch({
        type: ACTIONS.AFTER_SAVE,
        payload: { newProperty, newError },
      });
      setApp((prev) => ({
        ...prev,
        user: { ...prev.user, [property]: newProperty },
        navDisabled: false,
      }));
    }
  };

  return state.saving ? (
    <AccountItemSkeleton message='Saving...' />
  ) : (
    <div className='item' ref={editRef}>
      <div className='item-top' onClick={handleToggle}>
        {icons[property]}
        <PreviewText state={state} title={title} />
        <CancelBtnOrEmpty state={state} cancel={cancel} />
        <SaveOrEditBtns state={state} />
      </div>
      {state.edit ? (
        <Inputs
          fields={fields}
          state={state}
          handleInput={handleInput}
          handleKeyDown={handleKeyDown}
        />
      ) : (
        !state.edit && <hr />
      )}
    </div>
  );
};

const getTitle = (property) => {
  switch (property) {
    case 'dob':
      return 'Date of Birth';
    case 'emergency_contact':
      return 'Emergency Contact';
    default:
      return property.substr(0, 1).toUpperCase() + property.substr(1);
  }
};
