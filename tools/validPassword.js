const validPassword = (password) => {
  return password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);
};

module.exports = validPassword;
