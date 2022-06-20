/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

// Date
var TodaysDateStyle = 8;

function WriteTodaysDate(Style) {

  var months = new Array();
  months[1] = "January";
  months[7] = "July";
  months[2] = "February";
  months[8] = "August";
  months[3] = "March";
  months[9] = "September";
  months[4] = "April";
  months[10] = "October";
  months[5] = "May";
  months[11] = "November";
  months[6] = "June";
  months[12] = "December";

  var days = new Array();
  days[1] = "Sunday";
  days[5] = "Thursday";
  days[2] = "Monday";
  days[6] = "Friday";
  days[3] = "Tuesday";
  days[7] = "Saturday";
  days[4] = "Wednesday";

  var todaysdate = new Date();
  var date = todaysdate.getDate();
  var day = todaysdate.getDay() + 1;
  var month = todaysdate.getMonth() + 1;
  var yy = todaysdate.getYear();
  var year = (yy < 1000) ? yy + 1900 : yy;
  var year2 = year - (2000 * 1);
  year2 = (year2 < 10) ? "0" + year2 : year2;

  var dateline = new Array();
  dateline[8] = days[day] + " " + date + " " + months[month] + " " + year;

  document.getElementById("today").innerHTML = dateline[Style];
}

WriteTodaysDate(TodaysDateStyle);

// Convert months
function getMonthName(month) {
  const d = new Date();
  d.setMonth(month - 1);
  const monthName = d.toLocaleString("default", {
    month: "long"
  });
  return monthName;
}


// Back button
function goBack() {
  window.history.back();
}
