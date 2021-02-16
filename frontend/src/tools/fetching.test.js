import * as tools from './fetching';
import { initLocations } from './mockData/initLocations';

let locations = initLocations();

describe('parseLocationsZips', () => {
  it('appends each location zip to query string', () => {
    let str = tools.parseLocationsZips(locations);
    for (let location of locations) {
      expect(str).toContain(location.address.zip + '|');
    }
  });
});
