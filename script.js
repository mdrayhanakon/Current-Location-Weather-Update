const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector(".arrow-back");

let api;

locationBtn.addEventListener("click", () => {
if (navigator.geolocation) { // if browser support geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
} else {
    alert("Your browser not support geolocation api");
}
});

function onSuccess(position) {
const { latitude, longitude } = position.coords; // getting lat and lon of the user device from coords obj
api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=6bfcd5e73a6b7ea29c9f754a3f93f198`;
fetchData();
}

function onError(error) {
// if any error occur while getting user location then we'll show it in infoText
infoTxt.innerText = error.message;
infoTxt.classList.add("error");
}

function fetchData() {
infoTxt.innerText = "Getting weather details...";
infoTxt.classList.add("pending");
// getting api response and returning it with parsing into js obj and in another 
// then function calling weatherDetails function with passing api result as an argument
fetch(api).then(response => response.json()).then(result => weatherDetails(result)).catch(() => {
    infoTxt.innerText = "Something went wrong";
    infoTxt.classList.replace("pending", "error");
});
}

function weatherDetails(info) {
if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    infoTxt.classList.replace("pending", "error");
} else {
    // let's get required properties value from the whole weather information
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;
    // using custom weather icon according to the id which api gives to us
    if (id == 800) {
        wIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
        wIcon.src = "icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
        wIcon.src = "icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
        wIcon.src = "icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
        wIcon.src = "icons/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
        wIcon.src = "icons/rain.svg";
    }

    // let's pass these values to a particular html element
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
}
}

arrowBack.addEventListener("click", () => {
wrapper.classList.remove("active");
});