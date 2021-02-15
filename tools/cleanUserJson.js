const cleanUserJson = (unclean) => {
  const user = {
    email: unclean.email,
    password: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    name: unclean.name,
    dob: unclean.dob,
    insurance: {
      provider: unclean.insurance.provider,
      id: '',
    },
    phone: unclean.phone,
    address: unclean.address,
    emergency_contact: unclean.emergency_contact,
    // travel: unclean.travel,
    appointments: unclean.appointments,
    preferences: {
      dark: unclean.preferences.dark,
      remember: unclean.preferences.remember,
      notifications: unclean.preferences.notifications,
    },
  };
  return user;
};

module.exports = cleanUserJson;
