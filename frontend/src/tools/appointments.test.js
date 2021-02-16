import * as tools from './appointments';
import { initLocations } from './mockData/initLocations';

let locations = initLocations();
let date = 'January 01, 2000';

const checkSingleLocation = (location) => {
  expect(location.available).toBeTruthy();
  expect(location.available.find((time) => time === '9:00 AM')).toBeTruthy();
  expect(location.available.find((time) => time === '12:00 PM')).toBeTruthy();
  expect(location.available.find((time) => time === '7:00 PM')).toBeFalsy();
};

describe('addAvailableTimes', () => {
  locations.forEach((location) => delete location.available);
  expect(location.available).toBeFalsy();

  it('adds available times to single location', () => {
    let location = { ...locations[0] };
    tools.addAvailableTimes(location, date);
    checkSingleLocation(location);
  });

  it('adds available times to array of locations', () => {
    tools.addAvailableTimes(locations, date);
    locations.forEach((location) => {
      checkSingleLocation(location);
    });
  });
});

describe('changeDate', () => {
  expect(tools.changeDate('inc', date)).toContain('January 2, 2000');
  expect(tools.changeDate('dec', date)).toContain('December 31, 1999');
});

describe('sortAppointments', () => {
  let appointments = locations[0].appointments;
  let [upcoming, past] = tools.sortAppointments(appointments);
  it('sorts appointments into upcoming and past', () => {
    expect(upcoming.length).toBe(1);
    expect(upcoming[0].date).toContain('2099');
    expect(past.length).toBe(3);
  });
  it('sorts appointments by date and time', () => {
    expect(past[0].date).toBe('1/1/2021');
    expect(past[0].time).toBe('9:30 AM');
    expect(past[1].date).toBe('1/2/2021');
    expect(past[1].time).toBe('9:00 AM');
    expect(past[2].time).toBe('9:30 AM');
  });
});
