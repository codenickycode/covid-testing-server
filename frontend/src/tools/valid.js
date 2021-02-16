export const validPassword = (password) => {
  return password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);
};

export const validNum = (value) => {
  if (!value) return true;
  return value[value.length - 1].match(/\d/);
};

export const checkRequired = (inputs) => {
  let errors = {};
  let interupt = false;
  for (let [key, val] of Object.entries(inputs)) {
    if (!val) {
      errors[key] = 'required';
      interupt = true;
    } else {
      if (key === 'phone' && val.length < 13) {
        errors.phone = '10-digits required';
        interupt = true;
      } else {
        errors[key] = '';
      }
    }
  }
  return [errors, interupt];
};

export const formatPhone = (value) => {
  let unformatted = value.replace(/\D/g, '');
  let len = unformatted.length;
  let formatted = '';
  if (len > 0) formatted = unformatted.slice(0, 3);
  if (len > 3)
    formatted = '(' + unformatted.slice(0, 3) + ')' + unformatted.slice(3, 6);
  if (len > 6) formatted += '-' + unformatted.slice(6, 10);
  return formatted;
};
