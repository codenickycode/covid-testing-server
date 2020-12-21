const { logger } = require('../../logger');
const User = require('../../models/User.model.js');
const Location = require('../../models/Location.model.js');

const dbDelete = (appointments, _id) => {
  let confirmed = false;
  for (let [index, appt] of Object.entries(appointments)) {
    if (appt._id.toString() === _id) {
      appointments.splice(index, 1);
      confirmed = true;
    }
  }
  return confirmed;
};

const deleteAppointment = async (req, res) => {
  try {
    const { client, location, _id } = req.body;
    const dbLocation = await Location.findById(location);
    if (!dbLocation) throw new Error('Location not found');
    let confirmed = dbDelete(dbLocation.appointments, _id);
    if (!confirmed) throw new Error('Invalid confirmation number: Location');
    await dbLocation.save();
    let dbClient = await User.findById(client);
    if (!dbClient) throw new Error('Client not found');
    confirmed = dbDelete(dbClient.appointments, _id);
    if (!confirmed) throw new Error('Invalid confirmation number: User');
    const updatedClient = await dbClient.save();
    return res.json(updatedClient);
  } catch (e) {
    logger.error(`deleteAppointment => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = deleteAppointment;
