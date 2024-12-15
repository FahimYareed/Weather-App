let valueSearch = document.getElementById("valueSearch");
let city = document.getElementById("city");
let temperature = document.getElementById("temperature");
let description = document.querySelector(".description");
let clouds = document.getElementById("clouds");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");
let wind = document.getElementById("wind");
let form = document.querySelector("form");
let main = document.querySelector("main");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (valueSearch.value != "") {
    searchWeather();
  }
});

let id = "your_api_key_here";
let url =
  "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=" +
  id;

const searchWeather = () => {
  fetch(url + "&q=" + valueSearch.value)
    .then((responsive) => responsive.json())
    .then((data) => {
      console.log(data);
      if (data.cod == 200) {
        const countryCode = data.sys.country;

        city.querySelector("figcaption").innerHTML = `
  <div class="city-details">
    <span class="city-name">${data.name}, ${countryCode}</span>
    <img class="flag-icon" src="https://flagsapi.com/${data.sys.country}/flat/32.png" alt=" " />
  </div>
  <span class="local-date-time" id="localDateTime"></span>
`;

        // Calculate Local Time
        const localDateTime = new Date();
        const timezoneOffset = data.timezone; // Timezone offset in seconds

        // Adjust the local time based on the city's timezone offset
        localDateTime.setSeconds(localDateTime.getSeconds() + timezoneOffset);

        // Format Local Time (HH:mm AM/PM) and Date
        const timeOptions = {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };

        const getDayAbbreviation = (date) => {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return days[date.getUTCDay()];
        };

        const dateOptions = {
          timeZone: "UTC",
          year: "numeric",
          month: "short",
          day: "numeric",
        };

        const formattedTime = localDateTime.toLocaleTimeString(
          "en-US",
          timeOptions
        );
        const formattedDate = localDateTime.toLocaleDateString(
          "en-US",
          dateOptions
        );
        const dayAbbreviation = getDayAbbreviation(localDateTime);

        // Update Local Time and Date
        document.getElementById(
          "localDateTime"
        ).innerText = `${dayAbbreviation}, ${formattedDate}, ${formattedTime}`;

        // Temperature

        const tempCelsius = (data.main.temp - 273.15).toFixed(1);
        temperature.querySelector("img").src =
          "https://openweathermap.org/img/wn/" +
          data.weather[0].icon +
          "@4x.png";
        temperature.querySelector("figcaption span").innerText = tempCelsius;

        // Weather details

        description.innerText = data.weather[0].description;
        clouds.innerText = data.clouds.all;
        humidity.innerText = data.main.humidity;
        pressure.innerText = data.main.pressure;
        wind.innerText = data.wind.speed;
      } else {
        // Error handling
        main.classList.add("error");
        let errorMessage =
          "Sorry, there was an issue fetching the weather data.";

        // Specific error messages based on the API response
        switch (data.cod) {
          case "404":
            errorMessage = "The city you searched for could not be found.";
            break;
          case "401":
            errorMessage = "There was an issue with the API authorization.";
            break;
          case "429":
            errorMessage = "You have exceeded the API request limit.";
            break;
          case "500":
            errorMessage =
              "There was an internal server error. Please try again later.";
            break;
        }

        // Display the error message to the user

        city.querySelector(
          "figcaption"
        ).innerHTML = `<span class="error-message">${errorMessage}</span>`;

        // Remove the error class after a short delay to reset the UI

        setTimeout(() => {
          main.classList.remove("error");
        }, 3000);
      }

      valueSearch.value = "";
    })
    .catch((error) => {
      // Handle any network or other errors
      main.classList.add("error");
      city.querySelector(
        "figcaption"
      ).innerHTML = `<span class="error-message">Sorry, something went wrong. Please check your internet connection and try again.</span>`;

      setTimeout(() => {
        main.classList.remove("error");
      }, 3000);

      console.error("Error fetching weather data:", error);
      valueSearch.value = "";
    });
};

const initApp = () => {
  valueSearch.value = "Dhaka";
  searchWeather();
};

initApp();
