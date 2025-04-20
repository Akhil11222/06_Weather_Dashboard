// Wait until the webpage fully loads
document.addEventListener("DOMContentLoaded", () => {
  // ▼▼▼ Configuration and Elements ▼▼▼
  const API_KEY = "5f56d525d1619d0a2cd2eac4ce55588e"; // Weather API key
  const cityInput = document.getElementById("city-input"); // City input field
  const addCityBtn = document.getElementById("add-city-btn"); // Add city button
  const cityList = document.getElementById("city-list"); // List of saved cities
  const weatherContainer = document.getElementById("weather-container"); // Weather display area

  // ▼▼▼ Cities Storage ▼▼▼
  let cities = JSON.parse(localStorage.getItem("cities")) || []; // Load saved cities from browser memory

  // Show initial list of cities
  renderCities();

  // ▼▼▼ Add City Button Click Handler ▼▼▼
  addCityBtn.addEventListener("click", () => {
    const city = cityInput.value.trim(); // Get cleaned input
    if (city && !cities.includes(city)) {
      // Check valid and new city
      cities.push(city); // Add to cities list
      saveCities(); // Save to browser memory
      renderCities(); // Update displayed list
    }
    cityInput.value = ""; // Clear input field
  });

  // ▼▼▼ City Click Handler (Get Weather) ▼▼▼
  cityList.addEventListener("click", async (e) => {
    if (e.target.tagName === "LI") {
      // Only handle clicks on list items
      const city = e.target.textContent; // Get city name from list
      const weatherData = await fetchWeatherData(city); // Get weather info
      displayWeather(weatherData); // Show weather data
    }
  });

  // ▼▼▼ Display City List ▼▼▼
  function renderCities() {
    cityList.innerHTML = ""; // Clear current list
    cities.forEach((city) => {
      // For each saved city
      const li = document.createElement("li"); // Create list item
      li.textContent = city; // Set city name
      cityList.appendChild(li); // Add to list
    });
  }

  // ▼▼▼ Get Weather Data from API ▼▼▼
  async function fetchWeatherData(city) {
    // API URL with city name and units (metric = Celsius)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url); // Send request to weather API
    if (!response.ok) {
      // If city not found
      alert("City not found!");
      return; // Exit function
    }
    const data = await response.json(); // Convert response to JSON
    return data; // Return weather data
  }

  // ▼▼▼ Show Weather Information ▼▼▼
  function displayWeather(data) {
    // Create HTML template with weather info
    weatherContainer.innerHTML = `
      <h3>${data.name}</h3> <!-- City name -->
      <p>Temperature: ${data.main.temp}°C</p> <!-- Current temp -->
      <p>Weather: ${data.weather[0].description}</p> <!-- Weather condition -->
    `;
  }

  // ▼▼▼ Save Cities to Browser Memory ▼▼▼
  function saveCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }
});
