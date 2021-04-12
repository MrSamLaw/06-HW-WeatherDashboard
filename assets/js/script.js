var searchFormEl = document.querySelector("#search-form");
var searchHistoryEl = document.querySelector("#search-history");
var searchResultsEl = document.querySelector("#search-results");

var citySearchLat = "";
var citySearchLon = "";

var searchHistory = [];

const excludes = "&exclude=minutely,hourly,alerts";

var OWMApiKey = "&appid=8161cdf2d2a69066a121e9f145638d0a";

function init() {
    getSearchHistory();
    renderSearchHistory();
}

function getSearchHistory() {
    //Pulls search history from localStorage if there is any
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (searchHistory === null) {
        return;
    }
}

function renderSearchHistory() {
    document.querySelector("#search-history").innerHTML = "";
    searchHistory.forEach(function (citySearches) {
        var searchHistoryBtn = document.createElement("button");
        searchHistoryBtn.classList.add("search-history-btn", "btn", "btn-info", "btn-block");
        searchHistoryBtn.id = citySearches;
        searchHistoryBtn.innerHTML = citySearches;
        document.querySelector("#search-history").prepend(searchHistoryBtn);
    })

    var searchHistoryButtons = document.querySelectorAll(".search-history-btn");
    searchHistoryButtons.forEach(function (eachButton) {
        eachButton.addEventListener("click", function (e) {
            var city = eachButton.textContent;
            searchApi(city);
        });
    });
}

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#city-input').value;

    if (!searchInputVal) {
        document.querySelector(".modal-title").textContent = "Invalid Input"
        document.querySelector(".modal-body").textContent = "Please enter a city to search for."
        $("#myModal").modal();
        return;
    }

    searchApi(searchInputVal);
}

function searchApi(citySearch) {

    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + citySearch + OWMApiKey;

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    searchCoords(citySearch, data.city.coord.lat, data.city.coord.lon);
                });
            } else {
                document.querySelector(".modal-title").textContent = "Invalid Input"
                document.querySelector(".modal-body").innerHTML = "<strong>" + citySearch + "</strong>" + " is not a valid city name." + "<br />"
                document.querySelector(".modal-body").innerHTML += "Please enter a valid city name.";
                $("#myModal").modal();
            }
        })
}

function updateSearchHistory(citySearch) {
    console.log("Update Search History");
    console.log("searchHistory Length = " + searchHistory.length);

    if (!searchHistory.includes(citySearch)) {
        console.log(searchHistory)
        if (citySearch != null) {
            searchHistory.push(citySearch);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        }
    }
    renderSearchHistory();
}

function searchCoords(citySearch, cityLat, cityLon) {
    citySearchLat = "lat=" + cityLat;
    citySearchLon = "&lon=" + cityLon;
    var requestLatLonUrl = 'https://api.openweathermap.org/data/2.5/onecall?' + citySearchLat + citySearchLon + excludes + "&units=metric" + OWMApiKey;
    console.log(requestLatLonUrl);
    fetch(requestLatLonUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            printCurrent(citySearch, data);
            printFiveDayForecast(data);
        });
    updateSearchHistory(citySearch);
}

function printCurrent(citySearch, city) {
    console.log(city);
    var unixTime = moment.unix(city.current.dt).format();

    var timezoneOffset = city.timezone_offset / 3600;
    var cityNameEl = document.querySelector("#current-city");
    cityNameEl.innerHTML = citySearch;
    var currentDateEl = document.querySelector("#current-date");
    currentDateEl.innerHTML = moment(unixTime).utcOffset(timezoneOffset).format("dddd Do MMM YYYY [at] h:mm A");
    var currentDescEl = document.querySelector("#current-description");
    currentDescEl.innerHTML = city.current.weather[0].description;
    var currentIconEl = document.querySelector("#current-icon");
    currentIconEl.innerHTML = '<img src="http://openweathermap.org/img/wn/' + city.current.weather[0].icon + '@2x.png"/>';
    var currentTempEl = document.querySelector("#current-temp");
    currentTempEl.innerHTML = "Temperature: " + Math.round(city.current.temp) + "&deg C";
    var currentHumEl = document.querySelector("#current-hum");
    currentHumEl.innerHTML = "Humidity: " + city.current.humidity + "%";
    var currentWindEl = document.querySelector("#current-wind");
    currentWindEl.innerHTML = "Wind Speed: " + (Math.round(city.current.wind_speed * 3.6)) + "km/h";
    var currentUVEl = document.querySelector("#current-UV");
    currentUVEl.innerHTML = "UV Index: " + city.current.uvi;
    uvIndex(city.current.uvi, currentUVEl);
}


function uvIndex(index, currentUVEl) {
    if (index <= 2) {
        currentUVEl.innerHTML += '<span class="badge uv-low">low</span>';
    } else if (index <= 5) {
        currentUVEl.innerHTML += '<span class="badge uv-med">medium</span>';
    } else if (index <= 7) {
        currentUVEl.innerHTML += '<span class="badge uv-high">high</span>';
    } else if (index <= 10) {
        currentUVEl.innerHTML += '<span class="badge uv-vhigh">very high</span>';
    } else {
        currentUVEl.innerHTML += '<span class="badge uv-extreme">extreme</span>';
    }
}

function printFiveDayForecast(city) {
    document.querySelector("#fiveDayResults").innerHTML = "";
    for (i = 1; i < 6; i++) {
        var dailyUnixTime = moment.unix(city.daily[i].dt).format()
        var dailyTimezoneOffset = city.timezone_offset / 3600;

        var dayCard = document.createElement("div");
        dayCard.innerHTML = [
            `<h5 class="card-title">${moment(dailyUnixTime).utcOffset(dailyTimezoneOffset).format("dddd Do")}</h5>
          <img src="https://openweathermap.org/img/wn/${city.daily[i].weather[0].icon
            }@2x.png">
          <p class="card-text">${city.daily[i].weather[0].description}</p>
          <p class="card-text">Temperature: ${Math.round(city.daily[i].temp.day)}°C</p>
          <p class="card-text">Wind Speed: ${Math.round(city.daily[i].wind_speed * 3.6)}km/h</p>
          <p class="card-text">Humidity: ${city.daily[i].humidity}%</p>`,
        ];
        dayCard.classList.add("card");
        document.querySelector("#fiveDayResults").appendChild(dayCard);
    }
    document.querySelector("#fiveDayForecast").textContent = "5 Day Forecast";
}
init();
searchFormEl.addEventListener('submit', handleSearchFormSubmit);