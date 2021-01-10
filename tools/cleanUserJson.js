const cleanUserJson = (unclean) => {
  const user = {
    email: unclean.email,
    name: unclean.name,
    dob: unclean.dob,
    insurance: unclean.insurance,
    phone: unclean.phone,
    address: unclean.address,
    emergency_contact: unclean.emergency_contact,
    travel: unclean.travel,
  };
  return user;
};

module.exports = cleanUserJson;
