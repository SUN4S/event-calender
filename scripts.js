// Adds initial data to sessionStorage
sessionStorage.setItem(
  "2022-01-08/10:50",
  JSON.stringify(
    {
      title: "Annual meeting",
      date: "2022-01-08",
      startTime: '15:00',
      endTime: '16:00',
      type: 'meeting',
      description: 'Some random information to fill in description box'
    }
  )
);

// variables
const dt = new Date();

const createEvent = document.getElementById('createEvent');
const eventForm = document.getElementById('eventForm');

const month = document.getElementById("month");
const days = document.getElementsByClassName("days");

const title = document.getElementById('title');
const date = document.getElementById('date');
const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');
const type = document.getElementById('type');
const description = document.getElementById('description');

const submitBtn = document.getElementById('submitButton');
const deleteBtn = document.getElementById('deleteButton');
const closeBtn = document.getElementById('close');

// Current key checks shich event is selected
let currentKey = '';

// Function for calender building and rendering
const renderDate = () => {
  dt.setDate(1);
  let day = dt.getDay();
  let today = new Date();
  let endDate = new Date(
  dt.getFullYear(),
  dt.getMonth() + 1,
  0
  ).getDate();
  let prevDate = new Date(
  dt.getFullYear(),
  dt.getMonth(),
  0
  ).getDate();
  let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
  ];

  month.innerHTML = months[dt.getMonth()]+ ' ' + dt.getFullYear();
  let cells = "";

  // Maps throught dates Before current day
  for (x = day; x > 0; x--) {
    cells += "<div class='prev_date'><h4>" + (prevDate - x + 1) + "</h4></div>";
  }
  // Finds current day
  for (i = 1; i <= endDate; i++) {
    if (i == today.getDate() && dt.getMonth() == today.getMonth()) {
      // Couldn't come up with a better way to manage cells than just giving them unique IDs
      cells += `
      <div 
        class='today' 
        id='${today.getFullYear()}-${
          (today.getMonth() + 1) < 10 
          ? '0' + (today.getMonth() + 1) 
          : (today.getMonth() + 1)}-${(i < 10) ? '0' + i : i}'>
      <h4>${i}</h4></div>`;
    }
    // Fills in the rest of calender days
    else {
      // Couldn't come up with a better way to manage cells than just giving them unique IDs
      cells += `
      <div 
        id='${today.getFullYear()}-${
          (dt.getMonth() + 1) < 10 
          ? '0' + (dt.getMonth() + 1) 
          : (dt.getMonth() + 1)}-${(i < 10) ? '0' + i : i}'
      <h4>${i}</h4></div>`;
    }
  }

  // Basically pushes calender dates to container
  days[0].innerHTML = cells;

  // Maps throught data in sessionStorage and adds events to calender
  for(let key of Object.keys(sessionStorage)) {
    if(document.getElementById(key.slice(0, 10))) {
      let dataParse = JSON.parse(sessionStorage.getItem(key));
      // Same as with cells, events all have unique IDs to manage them easier
      let toInsert = `
      <div 
        class="${dataParse.type}"
        id="event-${key}"
        onclick="eventPreview('${key}')">
      ${dataParse.title}
      </div>`
      document.getElementById(key.slice(0, 10)).insertAdjacentHTML('beforeend', toInsert);
    }
  }
}

// Calender bytton functionality
const moveDate = (para) => {
  para == "prev" 
  ? dt.setMonth(dt.getMonth() - 1)
  : dt.setMonth(dt.getMonth() + 1);

  renderDate();
}

// listener waits for form submission, checks start/end times and add info to session
eventForm.addEventListener('submit', event => {
  event.preventDefault();
  // actual logic, e.g. validate the form
  
  if (startTime.value > endTime.value){
    alert('Cannot finish earlier than started');
    return 0;
  }

  const resultValues = {
    title: title.value,
    date: date.value,
    startTime: startTime.value,
    endTime: endTime.value,
    type: type.value,
    description: description.value
  }

  sessionStorage.setItem(
    resultValues.date + '/' + resultValues.startTime,
    JSON.stringify(resultValues)
  );

  renderDate();
  emptyData();
});

// function that wait for and event button click and opens form, and makes inputs disabled
const eventPreview = (eventKey) => {
  createEvent.style.display = 'none';
  eventForm.style.display = 'flex';
  currentKey = eventKey;
  title.disabled = true;
  date.disabled = true;
  startTime.disabled = true;
  endTime.disabled = true;
  type.disabled = true;
  description.disabled = true;
  submitBtn.disabled = true;
  submitBtn.style.display = 'none';
  deleteBtn.style.display = 'block';

  fillData(eventKey);
}

// listens for 'Add new event' button click and opens form, and makes inputs editable
createEvent.addEventListener('click', () => {
  createEvent.style.display = 'none';
  eventForm.style.display = 'flex';
  title.disabled = false;
  date.disabled = false;
  startTime.disabled = false;
  endTime.disabled = false;
  type.disabled = false;
  description.disabled = false;
  submitBtn.disabled = false;
  submitBtn.style.display = 'block';
  deleteBtn.style.display = 'none';
});

// Function to fill the form with event data
const fillData = (eventKey) => {
  const data = JSON.parse(sessionStorage.getItem(eventKey));
  title.value = data.title;
  date.value = data.date;
  startTime.value = data.startTime;
  endTime.value = data.endTime;
  type.value = data.type;
  description.value = data.description
}

// sets input values to empty
const emptyData = () => {
  title.value = '';
  date.value = '';
  startTime.value = '';
  endTime.value = '';
  type.value = '';
  description.value = '';
}

// event that listens for the Delete button click and removes from item session
deleteButton.addEventListener('click', () => {
  const eventKey = currentKey;
  const deleteEvent = (eventKey) => {
    console.log(currentKey);
    if(confirm("Are you sure you want to delete current event?") == true) {
      sessionStorage.removeItem(currentKey);
      createEvent.style.display = 'block';
      eventForm.style.display = 'none';
      renderDate();
    } else {
      alert("Aborted delete")
    }
  }
  deleteEvent();
  emptyData();
})

// Close button return to 'Add new event' button
closeBtn.addEventListener('click', () => {
  createEvent.style.display = 'block';
  eventForm.style.display = 'none';
  emptyData();
})