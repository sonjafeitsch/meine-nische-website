"use strict";

dayjs.extend(window.dayjs_plugin_isoWeek);

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

fetch("belegung.json")
  .then((response) => {
    if (!response.ok) {
      console.error("Could not load the schedule.", response);
      return [];
    }
    return response.json();
  })
  .then((data) => {
    let selectedDate = dayjs();
    document.getElementById("next-week-button").onclick = () => {
      selectedDate = selectedDate.add(1, "week");
      document.getElementById("previous-week-button").disabled = false;
      clearSchedule();
      fillSchedule(selectedDate, data);
    };
    document.getElementById("previous-week-button").onclick = () => {
      selectedDate = selectedDate.subtract(1, "week");
      if (
        dayjs().startOf("isoWeek").unix() >=
        selectedDate.startOf("isoWeek").unix()
      ) {
        document.getElementById("previous-week-button").disabled = true;
      }
      clearSchedule();
      fillSchedule(selectedDate, data);
    };
    if (
      dayjs().startOf("isoWeek").unix() >=
      selectedDate.startOf("isoWeek").unix()
    ) {
      document.getElementById("previous-week-button").disabled = true;
    }
    clearSchedule();
    fillSchedule(selectedDate, data);
  });

function fillSchedule(selectedTime, schedule) {
  const start = selectedTime.startOf("isoWeek");
  document.getElementById("schedule-start").innerHTML =
    start.format("DD.MM.YYYY");
  const end = selectedTime.endOf("isoWeek");
  document.getElementById("schedule-end").innerHTML = end.format("DD.MM.YYYY");
  schedule
    .filter((course) => days.includes(course.day))
    .forEach((course) => fillCell(course, course.day));
  schedule
    .filter((course) => course.day.match(/\d\d\d\d-\d\d-\d\d/))
    .filter((course) => {
      const date = dayjs(course.day);
      date.hour(course.start);
      return date.isAfter(start) && date.isBefore(end);
    })
    .forEach((course) =>
      fillCell(course, dayjs(course.day).format("dddd").toLowerCase())
    );
}

function fillCell(course, idPrefix) {
  for (let hour = course.start; hour < course.end; hour++) {
    const element = document.getElementById(`${idPrefix}-${hour}`);
    if (element.innerHTML !== "&nbsp;") {
      element.innerHTML += "<br/>" + course.name;
      element.style = "color: red";
    } else {
      if (course.link && course.link.length > 0) {
        element.innerHTML =
          "<td><a href=" + course.link + ">" + course.name + "</a></td>";
      } else {
        element.innerHTML = course.name;
      }
    }
  }
}

function clearSchedule() {
  const ids = days
    .map((day) =>
      new Array(14).fill(1).map((_, index) => `${day}-${index + 8}`)
    )
    .reduce((acc, curr) => {
      acc.push(...curr);
      return acc;
    }, []);

  ids.forEach((id) => (document.getElementById(id).innerHTML = "&nbsp;"));
}
