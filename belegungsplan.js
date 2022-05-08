'use strict';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const ids = days.map(day => new Array(14).fill(1).map((_, index) => `${day}-${index + 8}`)).reduce(
  (acc, curr) => {
    acc.push(...curr);
    return acc
  }, []
);

ids.forEach(id =>
  document.getElementById(id).innerHTML = '&nbsp;'
)

fetch('belegung.json').then(response => {
  if (!response.ok) {
    console.error('Could not load the schedule.', response)
    return []
  }
  return response.json()
}).then(data => {
  data
    .filter(course => days.includes(course.day))
    .forEach(course => {
      for (let hour = course.start; hour < course.end; hour++) {
        const element = document.getElementById(`${course.day}-${hour}`)
        if (element.innerHTML !== '&nbsp;') {
          element.innerHTML += '<br/>' + course.name
          element.style = 'color: red'
        } else {
          element.innerHTML = course.name
        }
      }
    })
});
