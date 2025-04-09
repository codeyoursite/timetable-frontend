let atrr = "ftime";
let data = null;
let ul = document.getElementById("ul");

fetch("https://calendar-server-ecru.vercel.app/api/events")
  .then(response => response.text())
  .then(text => {
    let parsedData = JSON.parse(text);
    if (typeof parsedData === 'string') {
      parsedData = JSON.parse(parsedData);
    }
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      parsedData = sortArray(parsedData, atrr)
      data = parsedData;
      
      let arr = [];
      if (ul) {
        for (let i = 0; i < parsedData.length; i++) {
          if (new Date(parsedData[i].stime).getMonth() == new Date().getMonth()){
            let event = parsedData[i];
            createItem(event)
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
  let close = document.getElementById("close")
  close.addEventListener("click", () => {
      console.log("Click event")
      module.style.display = "none";
  });

  
  function createItem(event) {
    let li = document.createElement("li");
    li.setAttribute("id", "Item"+event.id);
    li = buildItem(li, event)
    li.style.display="None"
    ul.appendChild(li);
  }
  
  function buildItem(li, event){
    li.innerHTML = `
    <strong>Event:</strong> ${event.name}<br>
    <strong>Start Time:</strong> ${new Date(event.stime).toLocaleString()}<br>
    <strong>End Time:</strong> ${new Date(event.ftime).toLocaleString()}
    `;
    let btn = document.createElement("button");
    btn.setAttribute("id", "btn" + event.id);
    btn.innerHTML = `Delete`;
    btn.classList.add("btn")
    btn.classList.add("btn-secondary")
    btn.addEventListener("click", (e) => {
      deleteItem(event.id);
    })
    li.appendChild(btn);
    let btn2 = document.createElement("button");
    btn2.setAttribute("id", "btn2" + event.id);
    btn2.innerHTML = `Update`;
    btn2.classList.add("btn")
    btn2.classList.add("btn-secondary")
    li.appendChild(btn2);
    btn2.addEventListener("click", (e) => {
      update(event.id);
    })
    return li
  }
  
  function deleteItem(id) {
    fetch("https://calendar-server-ecru.vercel.app/api/events", {"method": "DELETE",
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
    fetch(`https://calendar-server-ecru.vercel.app/api/events/${id}`)
    .then(response => response.json())
    .then(text => {
      console.log(text);
      let url = `http://127.0.0.1:5500?event=${text.name}&eventStart=${text.stime}&eventEnd=${text.ftime}&id=${text.id}`
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
    //     atrr = "stime";
    //   } else {
      //     sort.textContent = "Sort: Finish Time";
      
//     atrr = "ftime";
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
let cal = document.getElementsByClassName("calendar")[0]
for (let i = 0; i < 7; i++) {
  let div = document.createElement("div")
  div.setAttribute("class", "day")
  div.setAttribute("id", days[i]
  )
  div.innerText = days[i].substring(0, 3);
  cal.appendChild(div);
}

// Adding to cal (div)
function addToWeek(parsedData) {
  for (let item of parsedData) {
    let date = item.stime;
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
  console.log(day,id,isEvent)
  // Event Logic
  if (isEvent){
    let day_div = document.getElementById(day);
    div.setAttribute("class", "event")


    // New Event Listener
    div.addEventListener("click", () => {
      let currentData = data;
      for (let item of data){
        if (item.id == id) {
          currentData = item;
          break;
        }
      }

      module.style.display = "block";
    
      let title = document.getElementById("title");
      title.textContent = name;
      let estart = document.getElementById("estart");
      estart.textContent = new Date(currentData.stime).toLocaleString();
      let eend = document.getElementById("eend");
      eend.textContent = new Date(currentData.ftime).toLocaleString();
      
      let upd = document.getElementById("update");
      let del = document.getElementById("delete");

      recreateNode(upd);
      recreateNode(del);
      
      upd = document.getElementById("update");
      del = document.getElementById("delete");
      
      console.log("Event Listener now")
      upd.addEventListener("click", (e) => {
        console.log("Update Clicked")
        update(id);
      });
      del.addEventListener("click", (e) => {
        console.log("clicked")
        deleteItem(id);
      });
      console.log(data);
    }); 

    // Old event listener

    div.addEventListener("click", () => {
      console.info(id)
      let itemid = document.getElementById("Item" + id);
      if (itemid.style.display === "block") {
        itemid.style.display = "none";
      } else {
        const children = document.getElementById("ul").children;
        for (let child of children) {
          child.style.display = "none";
        }
        itemid.style.display = "block";
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
  let dates = stringify(month,year)
  current_date = 0

  while (current_date < dates.length){
    console.log(current_date)
    for(let day = 0; day < days.length; day++){
      let d = new Date(dates[current_date])
      console.log(d.getDay())
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

// Make a function that creates strings in the form dd/mm/yy for all dates in December

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
  console.log(dayObj);
  document.getElementById(dayObj).classList.add("today")
}

highlight();

