let form = document.getElementById("form")
// Url search params
let url = new URL(document.location.toString()).searchParams
let searchparams = null;

if (url.size == 4) {
    searchparams = 1;
    document.getElementById("name").value = url.get("event")
    document.getElementById("stime").value = formatDateTime(url.get("eventStart"))
    document.getElementById("ftime").value = formatDateTime(url.get("eventEnd"))
}

const WEB_URL = "/frontend"
const dev_mode = true;
// ternary operator
const API_URL = "https://calendar-server-ecru.vercel.app/api" // dev_mode ? "http://localhost:8080/api/" : "https://api.example.com/api/"

console.log("URL", API_URL)
// Set Default Time to now on stime
// let current_date = new Date()
// document.getElementById("stime").value = current_date.toDateString();

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let name = document.getElementById("name").value
    let stime = new Date(document.getElementById("stime").value)
    let ftime = new Date(document.getElementById("ftime").value)
    console.log(form, name, stime, ftime)
    if (stime >= ftime) {
        console.error("Nahhhhh")
    } else {
        send(name, stime, ftime)
    }
});

function changeLoc() {
    window.location.href = `${WEB_URL}/events.html`;
}

function send(name, stime, ftime) {
    let event = {"name": name,
        "stime": stime,
        "ftime": ftime
    }
    console.log(event)
    if (searchparams == 1) {
        event.id = url.get("id")
        fetch(`${API_URL}/event/${url.get("id")}`, {"method": "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(event)
        }).then(data => data.json())
        .then(data => console.log(data))
        .then(changeLoc)
    } else {
        console.log(`${API_URL}/event/`)
        fetch(`${API_URL}/event/`, {method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(event)
        }).then(data => data.json())
        .then(data => console.log(data))

        .then(changeLoc)
    
    }
}

function formatDateTime(value) {
    const date = new Date(value); // Parse the input value into a Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Return in the format YYYY-MM-DDTHH:MM
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
