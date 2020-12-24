const { ObjectId } = require('mongodb');
const { logger } = require('../../../logger');
const Appointment = require('../../../models/Appointment.model.js');

const addAppointment = async (req, res) => {
  try {
    const { location, date, time, test } = req.body;
    const appointment = await Appointment.find({ location, date, time }).exec();
    if (appointment)
      return res
        .status(400)
        .send('Appointment unavailable. Please choose another time.');
    let newAppointment = new Appointment({
      _id: new ObjectId(),
      date,
      time,
      location,
      client: req.user._id,
      test,
    });
    await newAppointment.save();
    return res.status(200).send('Success!');
  } catch (e) {
    logger.error(`addAppointment => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = addAppointment;
