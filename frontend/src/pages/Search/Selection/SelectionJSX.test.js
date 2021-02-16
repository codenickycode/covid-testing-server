import { render, fireEvent, getByText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SelectionJSX from './SelectionJSX';
import { initLocations } from '../../../tools/mockData/initLocations';

let selection,
  handleChangeDate,
  setTime,
  selectTest,
  selectedTests,
  handleSubmit;

describe('SelectionJSX', () => {
  beforeEach(() => {
    selection = initLocations()[3];
    handleChangeDate = jest.fn();
    setTime = jest.fn();
    selectTest = jest.fn();
    selectedTests = [];
    handleSubmit = jest.fn();
    render(
      <SelectionJSX
        selection={selection}
        date={'January 1, 2021'}
        time={'9:30 AM'}
        handleChangeDate={handleChangeDate}
        setTime={setTime}
        selectTest={selectTest}
        selectedTests={selectedTests}
        handleSubmit={handleSubmit}
      />
    );
  });

  it('renders selected location name', () => {
    expect(document.body.innerHTML).toContain('Health');
  });

  it('renders selected location address and phone', () => {
    expect(document.body.innerHTML).toContain('90210');
    expect(document.body.innerHTML).toContain('999');
  });

  it('renders date passed from props', () => {
    expect(document.body.innerHTML).toContain('January');
  });

  it('renders selected location available tests', () => {
    expect(document.body.innerHTML).toContain('rapid');
  });

  it('calls handleChangeDate from props passed to date picker', () => {
    expect(handleChangeDate).toBeCalledTimes(0);
    const datePicker = document.querySelector('.date-picker');
    const arrow = datePicker.querySelector('svg');
    fireEvent.click(arrow);
    expect(handleChangeDate).toBeCalledTimes(1);
  });

  it('calls setTime on time select', () => {
    expect(setTime).toBeCalledTimes(0);
    fireEvent.change(document.querySelector('select'), {
      target: { value: '9:30 AM' },
    });
    expect(setTime).toBeCalledTimes(1);
  });

  it('calls selectTest on test click', () => {
    const test = document.querySelector('li');
    expect(selectTest).toBeCalledTimes(0);
    fireEvent.click(test);
    fireEvent.click(test);
    fireEvent.click(test);
    expect(selectTest).toBeCalledTimes(3);
  });

  it('prevent handleSubmit without test and time selection', () => {
    expect(document.querySelector('button')).toHaveAttribute('disabled');
  });
});
