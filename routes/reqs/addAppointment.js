const { logger } = require('../../logger');
const { ObjectId } = require('mongodb');
const User = require('../../models/User.model.js');
const Location = require('../../models/Location.model.js');

const addAppointment = async (req, res) => {
  try {
    const { location, ...newAppointment } = req.body;
    const dbLocation = await Location.findById(location);
    if (!dbLocation) throw new Error('Location not found');
    for (let appt of dbLocation.appointments) {
      if (
        appt.date === newAppointment.date &&
        appt.time === newAppointment.time
      ) {
        return res.send('Appointment unavailable. Please choose another time.');
      }
    }
    newAppointment._id = new ObjectId();
    dbLocation.appointments.unshift(newAppointment);
    await dbLocation.save();
    // adjust newAppointment for client's document
    let { client, dob, ...clientAppointment } = newAppointment;
    clientAppointment.name = dbLocation.name;
    clientAppointment.address = dbLocation.address;
    clientAppointment.phone = dbLocation.phone;
    let dbClient = await User.findById(client);
    if (!dbClient) throw new Error('Client not found');
    dbClient.appointments.unshift(clientAppointment);
    const updatedClient = await dbClient.save();
    return res.json(updatedClient);
  } catch (e) {
    logger.error(`addAppointment => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = addAppointment;
