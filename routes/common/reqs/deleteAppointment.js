const { logger } = require('../../../logger');
const Appointment = require('../../../models/Appointment.model');
const Location = require('../../../models/Location.model.js');

const deleteAppointment = async (req, res) => {
  const _id = req.body._id;
  try {
    const appointment = await Appointment.findById(_id).exec();
    const location = appointment.location;
    const dbLocation = await Location.findById(location).exec();
    appointment.remove();
    dbLocation.appointments.forEach((appointment, index) => {
      if (appointment._id.toString() === _id) {
        dbLocation.appointments.splice(index, 1);
      }
    });
    await appointment.save();
    await dbLocation.save();
    logger.info(`Appointment Deleted: %o`, appointment);
    return res.status(200).send('Success!');
  } catch (e) {
    logger.error(`deleteAppointment => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = deleteAppointment;
