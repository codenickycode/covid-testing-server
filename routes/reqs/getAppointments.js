const { logger } = require('../../logger');
const User = require('../../models/User.model.js');

const getAppointments = async (req, res) => {
  const client = req.body.client;
  try {
    const clientDoc = await User.findById(client);
    if (!clientDoc) throw new Error('Client not found');
    return res.json(clientDoc.appointments);
  } catch (err) {
    logger.error(`/appointments GET => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = getAppointments;
