const { ObjectId } = require('mongodb');
const { logger } = require('../../../logger');
const Appointment = require('../../../models/Appointment.model.js');
const Location = require('../../../models/Location.model.js');
const User = require('../../../models/User.model.js');
const cleanUserJson = require('../../../tools/cleanUserJson');

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
      location: location._id,
      client: req.user._id,
      tests,
    });
    await newAppointment.save();
    const dbLocation = await Location.findById(location._id).exec();
    dbLocation.appointments.push({ _id, date, time });
    await dbLocation.save();
    const dbUser = await User.findById(req.user._id).exec();
    dbUser.appointments.push({
      _id,
      date,
      time,
      location: {
        name: location.name,
        phone: location.phone,
        address: location.address,
      },
      tests,
    });
    const updatedDbUser = await dbUser.save();
    const cleanUser = cleanUserJson(updatedDbUser);
    return res.status(200).json({
      user: cleanUser,
      confirmation: 'Successfully booked appointment!',
    });
  } catch (e) {
    logger.error(`addAppointment => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = addAppointment;
