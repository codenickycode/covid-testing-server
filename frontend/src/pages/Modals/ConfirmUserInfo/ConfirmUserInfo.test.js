import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ConfirmUserInfo from './ConfirmUserInfo';
import ContextProvider from '../../../Providers/Context';

let inputs, confirm, setInfoIsConfirmed;
describe('ConfirmUserInfo', () => {
  beforeEach(() => {
    setInfoIsConfirmed = jest.fn();
    render(
      <ContextProvider>
        <ConfirmUserInfo setInfoIsConfirmed={setInfoIsConfirmed} />
      </ContextProvider>
    );
    inputs = document.querySelectorAll('input');
    confirm = document.querySelector('button');
  });

  it('renders', () => {
    expect(inputs[0]).toBeInTheDocument();
  });

  // not accounting for internal callback custom hooks
  //   it('submits only if valid inputs', () => {
  //     expect(setInfoIsConfirmed).toBeCalledTimes(0);
  //     fireEvent.click(confirm);
  //     expect(setInfoIsConfirmed).toBeCalledTimes(0);

  //     fireEvent.change(inputs[0], { target: { value: 'a' } });
  //     fireEvent.change(inputs[1], { target: { value: 'a' } });
  //     fireEvent.change(inputs[2], { target: { value: '1/1/1990' } });
  //     fireEvent.change(inputs[3], { target: { value: '555-555-5555' } });
  //     fireEvent.click(confirm);
  //     expect(setInfoIsConfirmed).toBeCalledTimes(0);
  //   });
});
