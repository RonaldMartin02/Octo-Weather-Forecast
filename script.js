
const weatherAPIKey = "81343f55a1630dd7b543103974260191"
const searchButton = document.querySelector("#search-button");
var cSearch = document.querySelector("#cInput");
var weatherForecastDiv = document.querySelector(".weatherData");
var futureForecastDiv = document.querySelector(".futureForecast");
var currentInfoDiv = document.querySelector(".Current-Data");
var dDiv = document.querySelector(".Data");
var cardsDiv = document.querySelector(".Weather-Cards");
var iDiv = document.querySelector(".icon")
var stateSelect = document.querySelector("#state-select");


function generateWeatherInfo(lat, lon) {
  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKey}`;
  const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKey}`;

  // Clear existing content in currentInfoDiv and cardsDiv
  currentInfoDiv.textContent = "";
  cardsDiv.textContent = "";

  // Fetch current weather data
  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      // Create elements for current weather info
      const currentCity = document.createElement("h2");
      currentCity.textContent = data.name;
      currentInfoDiv.appendChild(currentCity);

      const currentTemp = document.createElement("h4");
      currentTemp.textContent = "Current Temp: " + Math.round(data.main.temp) + "°";
      currentInfoDiv.appendChild(currentTemp);

      const currentHumidity = document.createElement("h4");
      currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";
      currentInfoDiv.appendChild(currentHumidity);

      const currentWind = document.createElement("h4");
      currentWind.textContent = "Wind Speed: " + data.wind.speed + "mph";
      currentInfoDiv.appendChild(currentWind);

      const currentPic = document.createElement("img");
      currentPic.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
      );
      currentPic.setAttribute("alt", data.weather[0].description);
      currentInfoDiv.appendChild(currentPic);
    })
    .catch(function (err) {
      console.error(err);
      alert("An error occurred while fetching the current weather data.");
    });

  // Fetch 5-day weather forecast
  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      // Initialize a variable to keep track of the current day
      let currentDay = null;

      // Loop through the forecast data
      for (let i = 0; i < data.list.length; i++) {
        const forecastItem = data.list[i];
        const forecastDate = forecastItem.dt_txt.split(" ")[0];

        // Check if it's a new day
        if (forecastDate !== currentDay) {
          // Create a new div for the day
          const dayDiv = document.createElement("div");
          dayDiv.classList.add("weather-day");

          // Create an element for the date
          const dateElement = document.createElement("h3");
          dateElement.textContent = forecastDate;
          dayDiv.appendChild(dateElement);

          // Add other weather information elements (e.g., temperature, humidity, wind) here
          // You can create and append these elements to `dayDiv` here
          var info = document.createElement("div");
          let currentTemp = document.createElement('h4');
          currentTemp.textContent = "Temp: " + Math.round(forecastItem.main.temp) + "°";
          dayDiv.appendChild(currentTemp);

          let currentWind = document.createElement('h4');
          currentWind.textContent = "Wind Speed: " + forecastItem.wind.speed + "mph";
          dayDiv.appendChild(currentWind);

          let currentHumidity = document.createElement('h4');
          currentHumidity.textContent = "Humidity: " + forecastItem.main.humidity + "%";
          dayDiv.appendChild(currentHumidity);

          let imgDiv = document.createElement("div");
          let currentPic = document.createElement("img");
          currentPic.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastItem.weather[0].icon + "@2x.png");
          currentPic.setAttribute("alt", forecastItem.weather[0].description);
          imgDiv.appendChild(currentPic);
          dayDiv.appendChild(imgDiv);

          // Append the div for the day's forecast to cardsDiv
          cardsDiv.appendChild(dayDiv);
          // Update the currentDay variable
          currentDay = forecastDate;
        }
      }
    })
    .catch(function (err) {
      console.error(err);
      alert("An error occurred while fetching the forecast data.");
    });
    if (currentInfoDiv.children.length > 0) {
      currentInfoDiv.classList.add('active'); // Add the 'active' class to show the current forecast
    }
}

function getCityCoordinates() {
  var cityName = cSearch.value;
  var state = stateSelect.value;
  console.log(cityName + " " + state)
  if (!cityName) return;

  const geoCodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${state}&limit=1&appid=${weatherAPIKey}`;

  fetch(geoCodingApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (!data.length) {
        alert(`No coordinates found for ${cityName}`);
      } else {
        saveCityState(cityName, state);
        const lat = data[0].lat;
        const lon = data[0].lon;
        generateWeatherInfo(lat, lon);
      }
    })
    .catch(function (err) {
      console.error(err);
      alert("An error occurred while fetching the coordinates.");
    });
}

function saveCityState(city, state) {
  const geoCodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state}&limit=1&appid=${weatherAPIKey}`;
  
  fetch(geoCodingApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data.length) {
        alert(`No coordinates found for ${city}, ${state}`);
      } else {
        const lat = data[0].lat;
        const lon = data[0].lon;
        generateWeatherInfo(lat, lon); // Call generateWeatherInfo here
        addSavedLocationButton(city, state);
      }
    })
    .catch(function (err) {
      console.error(err);
      alert("An error occurred while fetching weather data.");
    });
}

function displaySavedLocations() {
  const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];

  // Create a div to hold the buttons
  const buttonsDiv = document.querySelector('#saved-locations');
  for (let i = 0; i < savedLocations.length; i++) {
    const sLocButton = document.createElement('button');
    sLocButton.textContent = savedLocations[i].city + ", " + savedLocations[i].state;
    sLocButton.setAttribute('data-city', savedLocations[i].city);
    sLocButton.setAttribute('data-state', savedLocations[i].state);

    sLocButton.addEventListener('click', function () {
      const city = this.getAttribute('data-city');
      const state = this.getAttribute('data-state');
      fetchWeatherForSavedLocation(city, state);
    });

    buttonsDiv.append(sLocButton);
  }
}
function addSavedLocationButton(city, state) {
  const buttonsDiv = document.querySelector('#saved-locations');

  // Check if a button for the same location already exists
  const existingButton = Array.from(buttonsDiv.children).find(button => {
    const [existingCity, existingState] = button.textContent.split(', ');
    return city === existingCity && state === existingState;
  });

  if (!existingButton) {
    const sLocButton = document.createElement('button');
    
    sLocButton.textContent = city + ", " + state;
    sLocButton.id = 'first-saved-button';
    sLocButton.addEventListener('click', () => {
      // Fetch weather data for the saved location when the button is clicked
      const geoCodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state}&limit=1&appid=${weatherAPIKey}`;
      fetch(geoCodingApiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (!data.length) {
            alert(`No coordinates found for ${city}, ${state}`);
          } else {
            const lat = data[0].lat;
            const lon = data[0].lon;
            generateWeatherInfo(lat, lon);
          }
        })
        .catch(function (err) {
          console.error(err);
          alert("An error occurred while fetching weather data.");
        });
    });
    
    buttonsDiv.appendChild(sLocButton);

    const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    savedLocations.push({ city, state });
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }
}
function loadSavedLocationsWeather() {
  const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
  for (const location of savedLocations) {
    const { city, state } = location;
    // Update this part by only adding buttons for the saved locations
    addSavedLocationButton(city, state);
  }
  const firstSavedButton = document.querySelector('#first-saved-button');

  if (firstSavedButton) {
    // Trigger a click event on the first saved button
    firstSavedButton.click();
  }
}


searchButton.addEventListener("click", function () {
  const cityName = cSearch.value;
  const state = stateSelect.value;
  if (!cityName) return;

  saveCityState(cityName, state);
  addSavedLocationButton(cityName, state);
});
// Load saved locations' weather when the page loads
loadSavedLocationsWeather();if (currentInfoDiv.children.length > 0) {
  currentInfoDiv.classList.add('active'); // Add the 'active' class to show the current forecast
}