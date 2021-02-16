import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TIMESLOTS } from './info/TIMESLOTS';
dayjs.extend(customParseFormat);

export const DATE_FORMAT = 'MMMM D, YYYY';
export const TODAY = dayjs().format(DATE_FORMAT);

export const refreshAvailable = (locations, date) => {
  addAvailableTimes(locations, date);
};

export const addAvailableTimes = (locations, date = TODAY) => {
  function addAvailable(location, date) {
    const timeslots = TIMESLOTS.filter((time) => {
      if (date === TODAY) {
        let apptTime = dayjs(time, 'hh:mm A');
        let now = new Date();
        return apptTime.isAfter(now);
      } else return time;
    });
    location.available = [...timeslots];
    location.appointments.forEach((appointment) => {
      if (dayjs(appointment.date).isSame(dayjs(date), 'date')) {
        location.available.splice(
          location.available.indexOf(appointment.time),
          1
        );
      }
    });
  }
  if (!Array.isArray(locations)) {
    addAvailable(locations, date);
  } else {
    locations.forEach((location) => addAvailable(location, date));
  }
};

export const changeDate = (type, date) => {
  let newDate = dayjs(date);
  newDate = type === 'dec' ? newDate.subtract(1, 'day') : newDate.add(1, 'day');
  newDate = newDate.format(DATE_FORMAT);
  return newDate;
};

// sort upcoming vs past
export const sortAppointments = (appointments) => {
  if (appointments.length === 0) return [[], []];
  let upcoming = [];
  let past = [];
  appointments.forEach((appointment) => {
    if (dayjs(appointment.date).isBefore(dayjs(TODAY))) {
      past.push(appointment);
    } else {
      upcoming.push(appointment);
    }
  });
  const upcomingSorted = sortByDateThenTime(upcoming);
  const pastSorted = sortByDateThenTime(past);
  return [upcomingSorted, pastSorted];
};

const sortByDateThenTime = (appointments) => {
  if (appointments.length === 0) return appointments;
  let dates = {};
  appointments.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  appointments.forEach((appointment) => {
    if (!dates[appointment.date]) {
      dates[appointment.date] = [appointment];
    } else {
      dates[appointment.date].push(appointment);
    }
  });
  let sorted = sortByTime(dates);
  return sorted;
};

const sortByTime = (dates) => {
  let sorted = [];
  for (let [, v] of Object.entries(dates)) {
    if (v.length === 1) {
      sorted.push(...v);
    } else {
      v.sort((a, b) => {
        let aDate = dayjs(`2000-01-01 ${a.time}`);
        let bDate = dayjs(`2000-01-01 ${b.time}`);
        return aDate.diff(bDate);
      });
      sorted.push(...v);
    }
  }
  return sorted;
};
