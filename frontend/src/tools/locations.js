import dayjs from 'dayjs';

export const filterLocationsBy = (type, filter, locations) => {
  if (!filter) return locations;
  if (type === 'tests') {
    const tests = filter;
    let filteredLocations = locations.filter((location) => {
      for (let [test] of Object.entries(tests)) {
        if (tests[test] && location.tests.indexOf(test) === -1) return false;
      }
      return true;
    });
    return filteredLocations;
  }
};

export const sortLocationsBy = (type, locations) => {
  sortLocationsByDistance(locations);
  if (type === 'time') sortLocationsByTime(locations);
};

export const sortLocationsByDistance = (locations) => {
  locations.sort((a, b) => a.distance - b.distance);
};

export const sortLocationsByTime = (locations) => {
  locations.sort((a, b) => {
    let aDate = dayjs(`2000-01-01 ${a.available[0]}`);
    let bDate = dayjs(`2000-01-01 ${b.available[0]}`);
    return aDate.diff(bDate);
  });
};

export const getSelection = (selected, locations) => {
  let selection = null;
  locations.forEach((location) => {
    if (location._id.toString() === selected) selection = location;
  });
  return selection;
};
