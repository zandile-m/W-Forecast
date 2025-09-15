
function formatCurrentDate() {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let date = now.getDate();
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
    "December",
  ];
  let month = months[now.getMonth()];
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, `0`);
  return `${day} ${date} ${month}<br/><small>Last updated at ${hours}:${minutes}</small>`;
}

function formatTimeData(timestamp) {
  let now = new Date(timestamp);
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, `0`);
  return `${hours}:${minutes}`;
}

function showWeatherDataForSearchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let apiKey = "41c63daacbbca70e4cab465b3c854000";
  let city = cityInput.value;
  if (city === ``) {
    return;
  }

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  let weatherPromise = axios.get(apiUrl);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  let forecastPromise = axios.get(apiUrl);

  function handle(response) {
    let weatherResponse = response[0];
    let forecastResponse = response[1];
    handleOpenWeatherMapResponse(weatherResponse.data);
    displayWeatherForecast(forecastResponse);
  }

  function handleError(error) {
    alert("Please enter a valid city and try again");
  }

  Promise.all([weatherPromise, forecastPromise]).then(handle, handleError);
}

function getTemperatureForWeatherForecast(response, index) {
  let temperatureForecastCelsius = response.data.list[index].main.temp;
  temperatureForecastsCelsius[index] = temperatureForecastCelsius;
  return displayTemperature(temperatureForecastCelsius);
}

function displayWeatherForecast(response) {
  let weatherForecastElement = document.querySelector("#weather-forecast");
  weatherForecastElement.innerHTML = null;
  let weatherForecast = null;

  for (let index = 0; index < 6; index++) {
    weatherForecast = response.data.list[index];
    weatherForecastElement.innerHTML += `
            <div class="col">
              <p>
                <strong>${formatTimeData(weatherForecast.dt * 1000)}</strong>
                <br />
                <span id="weather-forecast-temp-${index}">
                ${getTemperatureForWeatherForecast(response, index)}</span>°
                <br />
                <img src="http://openweathermap.org/img/wn/${
                  weatherForecast.weather[0].icon
                }@2x.png" alt="">
              </p>
            </div>`;
  }
}

function handleOpenWeatherMapResponse(weatherData) {
  console.log(weatherData);
  weatherReportElement.style.display = "block";

  currentDateElement.innerHTML = formatCurrentDate();

  temperatureCelsius = weatherData.main.temp;

  temperatureElement.innerHTML = displayTemperature(temperatureCelsius);

  temperatureMinCelsius = weatherData.main.temp_min;
  temperatureMinElement.innerHTML = displayTemperature(temperatureMinCelsius);

  temperatureMaxCelsius = weatherData.main.temp_max;
  temperatureMaxElement.innerHTML = displayTemperature(temperatureMaxCelsius);

  let humidity = Math.round(weatherData.main.humidity);
  humidityElement.innerHTML = humidity;

  let windSpeed = Math.round(weatherData.wind.speed);
  windElement.innerHTML = windSpeed;

  let currentCity = weatherData.name;
  currentCityElement.innerHTML = currentCity;

  let currentCountry = weatherData.sys.country;
  currentCountryElement.innerHTML = currentCountry;

  let currentWeatherDescription = weatherData.weather[0].main;
  currentWeatherDescriptionElement.innerHTML = currentWeatherDescription;

  let sunriseTime = weatherData.sys.sunrise;
  sunriseTimeElement.innerHTML = formatTimeData(sunriseTime * 1000);

  let sunsetTime = weatherData.sys.sunset;
  sunsetTimeElement.innerHTML = formatTimeData(sunsetTime * 1000);

  weatherIconElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"/>`;
}

function showWeatherDataForLocation(position) {
  console.log("position is", position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "41c63daacbbca70e4cab465b3c854000";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  let weatherPromise = axios.get(apiUrl);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  let forecastPromise = axios.get(apiUrl);

  function handle(responses) {
    let weatherResponse = responses[0];
    let forecastResponse = responses[1];

    handleOpenWeatherMapResponse(weatherResponse.data);
    displayWeatherForecast(forecastResponse);
  }

  Promise.all([weatherPromise, forecastPromise]).then(handle);
}

function showWeatherDataForCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showWeatherDataForLocation);
}

function updateTemperatureToFahrenheit(event) {
  event.preventDefault();
  updateTemperature("fahrenheit");
}

function updateTemperatureToCelsius(event) {
  event.preventDefault();
  updateTemperature("celsius");
}

function calculateFahrenheit(temperatureCelsius) {
  return (temperatureCelsius * 9) / 5 + 32;
}

function displayTemperature(temperatureCelsius) {
  if (temperatureUnit === "celsius") {
    return Math.round(temperatureCelsius);
  } else {
    return Math.round(calculateFahrenheit(temperatureCelsius));
  }
}

function updateTemperature(unit) {
  temperatureUnit = unit;

  if (unit == "fahrenheit") {
    changetoCelsius.classList.remove("active");
    changeToFahrenheit.classList.add("active");
  } else {
    changeToFahrenheit.classList.remove("active");
    changetoCelsius.classList.add("active");
  }

  temperatureElement.innerHTML = displayTemperature(temperatureCelsius);

  temperatureMinElement.innerHTML = displayTemperature(temperatureMinCelsius);

  temperatureMaxElement.innerHTML = displayTemperature(temperatureMaxCelsius);

  for (let index = 0; index < 6; index++) {
    let element = document.querySelector(`#weather-forecast-temp-${index}`);
    element.innerHTML = displayTemperature(temperatureForecastsCelsius[index]);
  }
}

let temperatureCelsius = null;
let temperatureMaxCelsius = null;
let temperatureMinCelsus = null;
let temperatureForecastsCelsius = [];
let temperatureUnit = "celsius";

let weatherReportElement = document.querySelector("#weather-report");
let currentDateElement = document.querySelector(".current-date");
let temperatureElement = document.querySelector("#temperature-digits");
let temperatureMinElement = document.querySelector("#min-temp");
let temperatureMaxElement = document.querySelector("#max-temp");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind-speed");
let currentCityElement = document.querySelector("#current-city");
let currentCountryElement = document.querySelector("#current-country");
let currentWeatherDescriptionElement = document.querySelector(
  "#weather-description"
);
let sunriseTimeElement = document.querySelector("#sunrise-time");
let sunsetTimeElement = document.querySelector("#sunset-time");
let weatherIconElement = document.querySelector("#current-weather-icon");

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", showWeatherDataForSearchCity);
let currentCityButton = document.querySelector("#current-city-button");
currentCityButton.addEventListener("click", showWeatherDataForCurrentLocation);
let changeToFahrenheit = document.querySelector("#fahrenheit");
changeToFahrenheit.addEventListener("click", updateTemperatureToFahrenheit);
let changetoCelsius = document.querySelector("#celsius");
changetoCelsius.addEventListener("click", updateTemperatureToCelsius);

window.addEventListener("load", showWeatherDataForCurrentLocation);
