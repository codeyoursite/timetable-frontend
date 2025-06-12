let atrr = "end_time";
let data = null;
let ul = document.getElementById("ul");
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const WEB_URL = "/frontend"
const API_URL = "https://calendar-server-ecru.vercel.app/api"

fetch(`${API_URL}/event`)
  .then(response => response.text())
  .then(text => {
    let parsedData = JSON.parse(text);
    if (typeof parsedData === 'string') {
      parsedData = JSON.parse(parsedData);
    }
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      parsedData = sortArray(parsedData, atrr)
      data = parsedData;
      console.log( ul)
      
      let arr = [];
      if (ul) {
        console.log(data)
        for (let i = 0; i < parsedData.length; i++) {
          if (new Date(parsedData[i].start_time).getMonth() == new Date().getMonth()){
            let event = parsedData[i];
            console.log(event)
            arr.push(event);
          }
        }
      }
      data = arr;
      addToWeek(arr);
      
    }
  })

  let module = document.getElementById("module")
  module.style.display = "none";
  
  
  function createItem(event) {
    let lis = buildItem(event)
    for (li of lis){
      ul.appendChild(li);
    }
    
  }
  
  function buildItem(event){
    let lis = []
    for (let i = 0; i < 4; i++) {
      let li = document.createElement("li");

      
      li.setAttribute("class", "Item "+event.id);
 
      lis.push(li)
    }
    lis[0].innerHTML = `<strong>Event:</strong> ${event.name}`
    lis[1].innerHTML = `<strong>Start Time:</strong> ${new Date(event.start_time).toLocaleString()}`
    lis[2].innerHTML = `<strong>End Time:</strong> ${new Date(event.end_time).toLocaleString()}
    `;

    let div = document.createElement("div")

    let btn = document.createElement("button");
    btn.setAttribute("id", "btn" + event.id);
    btn.innerHTML = `Delete`;
    btn.classList.add("btn")
    btn.classList.add("btn-secondary")
    btn.addEventListener("click", (e) => {
      deleteItem(event.id);
    })
    div.appendChild(btn);

    let btn2 = document.createElement("button");
    btn2.setAttribute("id", "btn2" + event.id);
    btn2.innerHTML = `Update`;
    btn2.classList.add("btn")
    btn2.classList.add("btn-secondary")
    div.appendChild(btn2);
    btn2.addEventListener("click", (e) => {
      update(event.id);
    })
    lis[3].appendChild(div)
    return lis
  }
  
  function deleteItem(id) {
    fetch(`${API_URL}/event`, {"method": "DELETE",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({"id": id})
    }).then(removeElement(id)).catch(err => console.error(err))
  }
  
  function removeElement(id){
    let el = document.getElementById(id);
    el.style.display = "none";
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Event deleted successfully!"
    });
  }
  
  function update(id) {
    fetch(`${API_URL}/event/${id}`)
    .then(response => response.json())
    .then(text => {
      console.log(text);


      let url = `${WEB_URL}/?event=${text.name}&eventStart=${text.start_time}&eventEnd=${text.end_time}&id=${text.id}`

      window.location.replace(url);
    }
  )
}

function sortArray(array, attribute){
  let tmp = null;
  for(let i = 0; i < array.length; i++) {
    for(let j = 0; j < array.length; j++) {
      if(array[i][attribute] < array[j][attribute]){
        tmp = array[i]
        array[i] = array[j];
        array[j] = tmp
      }
    }
  }
  return array;
}

function updateDisplay(sorted) {
  let ul = document.getElementById("ul")
  let children = ul.children;
  for (let i = 0; i < children.length; i++) {
    buildItem(children[i], sorted[i]);
  }
}

// let sort = document.getElementById("sort");

// sort.addEventListener("click", () => {
  //   if (sort.textContent == "Sort: Finish Time") {
    //     sort.textContent = "Sort: Start Time";
    //     atrr = "start_time";
    //   } else {
      //     sort.textContent = "Sort: Finish Time";
      
//     atrr = "end_time";
//   }
//   let sorted = sortArray(data, atrr)
//   updateDisplay(sorted)
// });

function recreateNode(el){
  let newEl = el.cloneNode(false);
  while (el.hasChildNodes()) newEl.appendChild(el.firstChild)
  el.parentNode.replaceChild(newEl, el)
  console.log(`Recreated ${el}`)
}


let days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


// Adding to cal (div)
function addToWeek(parsedData) {
  for (let item of parsedData) {
    let date = item.start_time;
    let new_date = new Date(date)
    let d = new_date.getDate()
    createCal(d,item.id, item.name)
  }
}

// this creates an event 
function createCal(day, id,name, isEvent=true) {
  let div = document.createElement("div");
  div.innerHTML = name
  div.setAttribute("id", id)
  // Event Logic
  if (isEvent){
    let day_div = document.getElementById(day);
    div.setAttribute("class", "event")


    
    // Old event listener

    div.addEventListener("click", () => {
      // Get the event
      const event = data.filter((item) =>{
        return item.id === id;
      })[0]
      const ul = document.getElementsByTagName("ul")[0]
      ul.innerHTML = ""
      if (ul.getAttribute('id') !== id){
        for (el of buildItem(event)){
          ul.appendChild(el)
        }
        ul.setAttribute("id", id)
      }
      else{
        ul.setAttribute("id", "")
      }
    });
    
    day_div.appendChild(div)
  }
  else{
    // Date numbers
    let day_div = document.getElementById(days[day]);
    div.setAttribute("class", "date")
    day_div.appendChild(div)
  }
  
}

function createCalendar(month,year){

  let cal = document.getElementById("calendar")
  console.log(month)

  for (let i = 0; i < 7; i++) {
    let div = document.createElement("div")
    div.setAttribute("class", "day")
    div.setAttribute("id", days[i]
    )
    div.innerText = days[i].substring(0, 3);
    cal.appendChild(div);
  }
  let dates = stringify(month,year)
  current_date = 0

  while (current_date < dates.length){
    for(let day = 0; day < days.length; day++){
      let d = new Date(dates[current_date])
      if (d.getDay() == day){
        createCal(d.getDay(),d.getDate(), d.getDate(),false)
        current_date +=1
      }
      else {
        createCal(day,"","",false)
      }
    }
  }
  
}

let months = [4, 6, 9, 11]

function stringify(month, year) {
  let arr = [];
  let numDays = 31;
  if (months.includes(month)) {
    numDays = 30;
  } else if (month == 2) {
    //leap year check
    if (year % 4 == 0) {
      if (year % 100 == 0){
          if (year % 400 == 0) {
            numDays = 29;
          }
          else{
            numDays = 28;
          } 
        }
      else {
        numDays = 29;
      }
      } 
    else {
      numDays = 28;
    }
  }
  for (let i = 1; i < numDays + 1; i++) {
    let temp = i;
    if (i < 10) {
      temp = "0" + temp
    }
    arr.push(`${month}/${temp}/${year}`)
  }
  return arr;
}

createCalendar(new Date().getMonth() + 1, new Date().getFullYear())

// Highlighting current day
function highlight() {
  let dayObj = new Date().getDate()
  document.getElementById(dayObj).classList.add("today")
}

function heading() {
  let date = new Date()
  document.getElementById("month").textContent = date.toLocaleString("default", {month:"long"})
}

heading();
highlight();

const left_button = document.getElementById("left")
left_button.addEventListener("click", ()=>{
  console.log("Click")
  const calendar = document.getElementById("calendar");
  calendar.innerHTML="";
  currentMonth = (currentMonth + 11) % 12
  console.log(currentMonth);
  createCalendar(currentMonth, currentYear)

})

