import { fireEvent, render } from '@testing-library/react';
import * as components from './index';
import { email } from '../icons';

const div = document.createElement('div');
div.innerHTML = 'not clicked';
const onClick1 = () => (div.innerHTML = 'clicked');
const onClick2 = () => (div.innerHTML = 'clicked by small');
let btn, btnSmall, submitBtn, disabledSubmit;

describe('Button', () => {
  beforeEach(() => {
    render(
      components.Button({
        label: 'I am a button',
        addClass: 'center',
        onClick: onClick1,
        id: 'btn',
      })
    );
    render(
      components.Button({
        label: 'I am a small button',
        onClick: onClick2,
        addClass: 'w-100 center',
        id: 'smallBtn',
        size: 'small',
      })
    );
    render(
      components.Button({
        id: 'submit-btn',
        type: 'submit',
        label: 'I am a submit button',
      })
    );
    render(
      components.Button({
        id: 'disabled-submit',
        type: 'submit',
        label: 'I am a disabled submit button',
        disabled: true,
      })
    );
    btn = document.querySelector('#btn');
    btnSmall = document.querySelector('#smallBtn');
    submitBtn = document.querySelector('#submit-btn');
    disabledSubmit = document.querySelector('#disabled-submit');
  });

  it('renders buttons of correct type', () => {
    expect(btn.type).toBe('button');
    expect(btnSmall.type).toBe('button');
    expect(submitBtn.type).toBe('submit');
    expect(disabledSubmit.type).toBe('submit');
  });

  it('renders label from props', () => {
    expect(btn.innerHTML).toBe('I am a button');
    expect(btnSmall.innerHTML).toBe('I am a small button');
  });

  it('receives onClick fn from props', () => {
    expect(div.innerHTML).toBe('not clicked');
    fireEvent.click(btn);
    expect(div.innerHTML).toBe('clicked');
    fireEvent.click(btnSmall);
    expect(div.innerHTML).toBe('clicked by small');
  });

  it('receives size className from props', () => {
    expect(btn.classList).toContain('btn');
    expect(btn.classList).not.toContain('-small');
    expect(btnSmall.classList).toContain('btn-small');
  });

  it('receives additional className from props', () => {
    expect(btn.classList).toContain('center');
    expect(btn.classList).not.toContain('w-100');
    expect(btnSmall.classList).toContain('center');
    expect(btnSmall.classList).toContain('w-100');
  });

  it('is disabled via prop', () => {
    expect(btn.disabled).toBe(false);
    expect(disabledSubmit.disabled).toBe(true);
  });
});

const Children = () => <h1>children</h1>;
let withIcon;

describe('WithIcon', () => {
  beforeEach(() => {
    render(
      components.WithIcon({
        icon: email,
        addClass: 'black',
        children: Children(),
      })
    );
    withIcon = document.querySelector('.with-icon');
  });

  it('renders a div of class with-icon', () => {
    expect(withIcon).toBeTruthy();
  });

  it('renders an icon passed as prop', () => {
    expect(withIcon.innerHTML).toContain('<svg');
  });

  it('renders children', () => {
    expect(withIcon.innerHTML).toContain('<h1>');
  });

  it('adds additional styles from props', () => {
    expect(withIcon.classList).toContain('black');
  });
});

let pwNoError, pwError;
describe('PWRequirements', () => {
  beforeEach(() => {
    render(components.PWRequirements());
    pwNoError = document.querySelector('.password');
    render(components.PWRequirements({ error: 'some error' }));
    pwError = document.querySelector('.error');
  });

  it('renders a p tag with correct class', () => {
    expect(pwNoError).toBeTruthy();
    expect(pwError).toBeTruthy();
    expect(pwNoError.classList).toContain('password');
    expect(pwNoError.classList).not.toContain('error');
    expect(pwError.classList).toContain('password');
    expect(pwError.classList).toContain('error');
  });
});

const span = document.createElement('span');
span.innerHTML = 'unchanged';
const handleChangeDate = (type) => (span.innerHTML = type);
let date = 'date';
let datePicker, p, arrowLeft, arrowRight;
describe('DatePicker', () => {
  beforeEach(() => {
    render(components.DatePicker({ handleChangeDate, date }));
    datePicker = document.querySelector('.date-picker');
    p = document.querySelector('.date');
    arrowLeft = document.querySelector('.deg180');
    arrowRight = document.querySelectorAll('.icon')[1];
  });

  it('renders the DatePicker', () => {
    expect(datePicker).toBeTruthy();
    expect(p).toBeTruthy();
    expect(arrowLeft).toBeTruthy();
    expect(arrowRight).toBeTruthy();
  });

  it('renders the date from props', () => {
    expect(p.innerHTML).toBe(date);
  });

  it('calls handleChangeDate with type of change on icon clicks', () => {
    expect(span.innerHTML).toBe('unchanged');
    fireEvent.click(arrowLeft);
    expect(span.innerHTML).toBe('dec');
    fireEvent.click(arrowRight);
    expect(span.innerHTML).toBe('inc');
  });
});

let error;
describe('Error', () => {
  beforeEach(() => {
    render(components.Error({ error: 'I am an error' }));
    error = document.querySelector('.error');
  });

  it('renders the error passed as prop', () => {
    expect(error.innerHTML).toBe('I am an error');
  });
});

// let emailInput, passwordInput, dateInput, zipInput, nameInput;
// describe('Input', () => {
//   beforeEach(() => {
//     let value;
//     render(
//       components.Input({
//         field: 'email',
//         error: true,
//         value: 'asdf@asdf.com',
//         onChange: () => (value = 'changed'),
//         withIcon: true,
//         placeholder: 'placeholder text',
//       })
//     );
//     render(components.Input({ field: 'password' }));
//     render(components.Input({ field: 'dob' }));
//     render(components.Input({ field: 'zip' }));
//     render(components.Input({ field: 'name' }));
//     render(components.Input({ field: 'phone' }));
//     emailInput = document.querySelector('input[name="email"]');
//     passwordInput = document.querySelector('input[name="password"]');
//     dateInput = document.querySelector('input[name="date"]');
//     zipInput = document.querySelector('input[name="zip"]');
//     nameInput = document.querySelector('input[name="name"]');
//     phoneInput = document.querySelector('input[name="phone"]');
//   });

//   it('renders inputs of the correct type', () => {
//     expect(emailInput.type).toBe('email');
//     expect(passwordInput.type).toBe('password');
//     expect(dateInput.type).toBe('date');
//     expect(zipInput.type).toBe('text');
//     expect(nameInput.type).toBe('text');
//     expect(phoneInput.type).toBe('tel');
//   });
// });
