export const ACTIONS = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  SET_PREVIEW: 'SET_PREVIEW',
  INPUT: 'INPUT',
  SET_USER_ERROR: 'SET_USER_ERROR',
  SET_SAVING: 'SET_SAVING',
  AFTER_SAVE: 'AFTER_SAVE',
  CANCEL: 'CANCEL',
};

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.OPEN:
      return { ...state, edit: true };
    case ACTIONS.CLOSE:
      return { ...state, edit: false };
    case ACTIONS.SET_PREVIEW:
      return { ...state, preview: payload };
    case ACTIONS.INPUT:
      const { key, value } = payload;
      return {
        ...state,
        updated: value !== state.prevInput[key],
        input: { ...state.input, [key]: value },
      };
    case ACTIONS.SET_USER_ERROR:
      return {
        ...state,
        edit: true,
        userError: payload,
      };
    case ACTIONS.SET_SAVING:
      return { ...state, saving: payload };
    case ACTIONS.AFTER_SAVE:
      const { newError, newProperty } = payload;
      return {
        ...state,
        saving: false,
        userError: newError,
        input: newProperty,
        prevInput: newProperty,
        edit: false,
        updated: false,
        preview: null,
      };
    case ACTIONS.CANCEL:
      return {
        ...state,
        updated: false,
        userError: '',
        edit: false,
        input: state.prevInput,
      };
    default:
      return state;
  }
};
