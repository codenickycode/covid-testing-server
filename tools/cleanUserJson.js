const cleanUserJson = (unclean) => {
  const user = {
    email: unclean.email || '',
    firstName: unclean.firstName || '',
    lastName: unclean.lastName || '',
    dob: unclean.dob || '',
    ins_provider: unclean.ins_provider || '',
    ins_id: unclean.ins_id || '',
    phone: unclean.phone || '',
    address: unclean.address || {},
    emergency_contact: unclean.emergency_contact || {},
    travel: unclean.travel || [],
  };
  return user;
};

module.exports = cleanUserJson;
