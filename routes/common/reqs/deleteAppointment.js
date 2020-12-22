const { logger } = require('../../../logger');
const Appointment = require('../../../models/Appointment.model');

const deleteAppointment = async (req, res) => {
  Appointment.findByIdAndDelete(req.body._id, (e, appt) => {
    if (e) {
      logger.error(`deleteAppointment => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    }
    logger.info(`Appointment Deleted: %o`, appt);
    return res.status(200).send('Success!');
  });
};

module.exports = deleteAppointment;
