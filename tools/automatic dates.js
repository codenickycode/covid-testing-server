const fs = require('fs');

let times = {
  '9:00 AM': true,
  '9:30 AM': true,
  '10:00 AM': true,
  '10:30 AM': true,
  '11:00 AM': true,
  '11:30 AM': true,
  '12:00 PM': true,
  '12:30 PM': true,
  '1:00 PM': true,
  '1:30 PM': true,
  '2:00 PM': true,
  '2:30 PM': true,
  '3:00 PM': true,
  '3:30 PM': true,
  '4:00 PM': true,
  '4:30 PM': true,
  '5:00 PM': true,
  '5:30 PM': true,
  '6:00 PM': true,
  '6:30 PM': true,
};

let date = new Date(2021, 0, 12);
let dates = {};
for (let i = 0; i < 30; i++) {
  date.setDate(date.getDate() + 1);
  let newDate = date.toLocaleDateString();
  for (let k in times) {
    times[k] = Math.random() > 0.5;
  }
  dates[newDate] = Object.assign({}, times);
}
let data = JSON.stringify(dates);

fs.writeFile('dates.json', data, (err) => {
  if (err) throw err;
});
