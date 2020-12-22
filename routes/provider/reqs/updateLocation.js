const { logger } = require('../../../logger');
const createTruthyObject = require('../../../tools/createTruthyObject');
const sanitize = require('../../../tools/sanitize');
const Location = require('../../../models/Location.model.js');

const updateLocation = async (req, res) => {
  try {
    const type = req.params.type;
    // parse location and truthy values from req.body
    let cleanReq = sanitize(req.body);
    let { location, ...request } = createTruthyObject(cleanReq);
    const dbLocation = await Location.findById(location);
    switch (type) {
      case 'basic':
        for (let [key, val] of Object.entries(request)) {
          if (val) dbLocation[key] = val;
        }
        break;
      case 'address':
        dbLocation.address = Object.assign({}, dbLocation.address, request);
        break;
      case 'tests':
        dbLocation.tests = Object.assign([], request.tests);
        break;
      default:
        throw new Error('Invalid update type.');
    }
    const updatedLocation = await dbLocation.save();
    return res.status(200).json(updatedLocation);
  } catch (e) {
    logger.error(`updateLocation => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = updateLocation;
