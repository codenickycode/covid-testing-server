import axios from 'axios';

export const parseLocationsZips = (locations) => {
  let locationsZips = '';
  for (let location of locations) {
    locationsZips += location.address.zip + '|';
  }
  return locationsZips;
};

export const getLocations = async () => {
  const res = await axios.get('/common/locations');
  return res.data;
};

export const getDistances = async (zip, locations) => {
  const locationsZips = parseLocationsZips(locations);
  const res = await axios.post('/common/distances', {
    zip,
    locationsZips,
    locations,
  });
  return res.data;
};
