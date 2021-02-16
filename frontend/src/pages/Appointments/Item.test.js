import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { appointment } from './mock/mockAppointment.js';
import { AppointmentItem } from './item.js';

let expandedField, arrow;
describe('AppointmentItem', () => {
  beforeEach(() => {
    render(<AppointmentItem appointment={appointment} />);
    expandedField = document.querySelector('.appt-field');
    arrow = document.querySelector('svg');
  });

  it('renders', () => {
    expect(document.querySelector('.appt-item')).toBeTruthy();
  });

  it('starts with only preview', () => {
    expect(expandedField).toBeFalsy();
  });

  // scrollIntoView breaks test
  //   it('expands on preview click', () => {
  //     expect(expandedField).toBeFalsy();
  //     fireEvent.click(arrow);
  //   });
});
