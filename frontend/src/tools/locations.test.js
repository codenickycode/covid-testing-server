import * as tools from './locations';
import { initLocations } from './mockData/initLocations';

let locations = initLocations();
let filter = { rapid: false, pcr: false, blood: false };
let hasRapid = locations[1]._id;
let notHasRapid = locations[0]._id;

const filterLocationsBy = (hasTest, expectedLength) => {
  let filtered = tools.filterLocationsBy('tests', filter, locations);
  expect(filtered.find((location) => location._id === hasTest)).toBeTruthy();
  expect(filtered.length).toEqual(expectedLength);
  return filtered;
};

describe('filterLocationsBy tests', () => {
  beforeEach(() => {
    locations = initLocations();
  });

  it('returns locations unaltered if no filter set', () => {
    const filtered = tools.filterLocationsBy('tests', null, locations);
    expect(filtered[0]._id).toBe(locations[0]._id);
    expect(filtered.length).toEqual(locations.length);
  });

  //! this ignores filter by zip in future
  it('returns locations unaltered if type != tests', () => {
    const filtered = tools.filterLocationsBy('distance', null, locations);
    expect(filtered[0]._id).toBe(locations[0]._id);
    expect(filtered.length).toEqual(locations.length);
  });

  it('returns all locations if all tests false', () => {
    filterLocationsBy(hasRapid, 4);
  });

  it('returns all locations if only blood test true', () => {
    filter = { rapid: false, pcr: false, blood: true };
    filterLocationsBy(hasRapid, 4);
  });

  it('removes locations not having test: true', () => {
    filter = { rapid: true, pcr: false, blood: false };
    let result = filterLocationsBy(hasRapid, 2);
    expect(result[0]._id !== notHasRapid).toBe(true);
    expect(result[1]._id !== notHasRapid).toBe(true);
  });
});

describe('sortLocationsBy', () => {
  it('sorts locations by the shortest distance, regardless of sort type', () => {
    let unsorted = [...locations];
    tools.sortLocationsBy('distance', locations);
    expect(unsorted[0]._id === locations[3]._id).toBe(true);

    locations = initLocations();
    tools.sortLocationsBy('time', locations);
    expect(unsorted[0]._id === locations[3]._id).toBe(true);
  });

  it('sorts locations by next available', () => {
    locations = initLocations();
    let unsorted = [...locations];
    tools.sortLocationsBy('time', locations);
    expect(locations[0]._id === unsorted[2]._id).toBe(true);
  });
});

describe('getSelection', () => {
  let selected = tools.getSelection(locations[0]._id, locations);
  expect(selected._id === locations[0]._id).toBe(true);
  expect(selected._id === locations[1]._id).toBe(false);
  selected = tools.getSelection(locations[1]._id, locations);
  expect(selected._id === locations[1]._id).toBe(true);
  expect(selected._id === locations[2]._id).toBe(false);
});
