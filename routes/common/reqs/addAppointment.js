const { ObjectId } = require('mongodb');
const { logger } = require('../../../logger');
const Appointment = require('../../../models/Appointment.model.js');
const Location = require('../../../models/Location.model.js');

const addAppointment = async (req, res) => {
  try {
    const { location, date, time, tests } = req.body;
    const appointment = await Appointment.find({ location, date, time }).exec();
    if (appointment[0])
      return res
        .status(400)
        .send('Appointment unavailable. Please choose another time.');
    const _id = new ObjectId();
    let newAppointment = new Appointment({
      _id,
      date,
      time,
      location,
      client: req.user._id,
      tests,
    });
    await newAppointment.save();
    const dbLocation = await Location.findById(location).exec();
    dbLocation.appointments.push({ _id, date, time });
    await dbLocation.save();
    return res.status(200).send(`Added appointment ${_id}`);
  } catch (e) {
    logger.error(`addAppointment => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = addAppointment;
