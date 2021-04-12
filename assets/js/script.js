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
    updateSearchHistory();
}

function getSearchHistory() {
    //Pulls search history from localStorage if there is any
    searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (searchHistory === null) {
        return;
    }

    console.log("Pulled Search History");
    console.log(searchHistory);

    document.querySelector("#search-history").innerHTML = "";
}

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#city-input').value;

    if (!searchInputVal) {
        document.querySelector(".modal-title").textContent = "Invalid Input"
        document.querySelector(".modal-body").textContent = "Please enter a city to search for."
        $("#myModal").modal();
        console.error('You need a search input value!');
        return;
    }

    searchApi(searchInputVal);
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

    document.querySelector("#search-history").innerHTML = "Search History";
    searchHistory.forEach(function (citySearches) {
        var searchHistoryBtn = document.createElement("button");
        searchHistoryBtn.classList.add("search-history-btn", "btn", "btn-info", "btn-block");
        searchHistoryBtn.id = citySearches;
        searchHistoryBtn.innerHTML = citySearches;
        document.querySelector("#search-history").append(searchHistoryBtn);
    })

    var searchHistoryButtons = document.querySelectorAll(".search-history-btn");
    searchHistoryButtons.forEach(function (eachButton) {
        eachButton.addEventListener("click", function (e) {
            var city = eachButton.textContent;
            searchApi(city);
        });
    });
}

function searchCoords(cityLat, cityLon) {
    var requestLatLonUrl = 'https://api.openweathermap.org/data/2.5/onecall?' + cityLat + cityLon + excludes + "&units=metric" + OWMApiKey;
    fetch(requestLatLonUrl)
        .then(function (response) {

        })
}


function searchApi(citySearch) {
    // fetch request gets a list of all the repos for the node.js organization
    // var citySearch = "Sydney";
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + citySearch + OWMApiKey;

    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    console.log(data.city.coord.lat);
                    console.log(data.city.coord.lon);
                });
            } else {

                document.querySelector(".modal-title").textContent = "Invalid Input"
                document.querySelector(".modal-body").textContent = "Please enter a valid city name."
                $("#myModal").modal();
                console.log("Not a valid city");
                // throw response.json();
            }
        })
        .catch(function (error) {
            console.log("Error");
        });

    //     .then(function (data) {
    // console.log(data);
    // console.log(data.city.coord);
    // console.log(data.city.coord.lat);
    // console.log(data.city.coord.lon);
    // citySearchLat = "lat=" + data.city.coord.lat;
    // citySearchLon = "&lon=" + data.city.coord.lon;
    // console.log(citySearchLat);
    // console.log(citySearchLon);

    // var requestLatLonUrl = 'https://api.openweathermap.org/data/2.5/onecall?' + citySearchLat + citySearchLon + excludes + "&units=metric" + OWMApiKey;
    // console.log(requestLatLonUrl);
    // fetch(requestLatLonUrl)
    //     .then(function (response) {
    //         if (!response.ok) {
    //             throw response.json();
    //         }
    //         return response.json();
    //     })
    //     .then(function (data) {
    //         console.log(data);

    //         console.log("Current Conditions");
    //         console.log("Temperature: " + data.current.temp);
    //         console.log("Humidity: " + data.current.humidity);
    //         console.log("Wind Speed: " + data.current.wind_speed);
    //         console.log("UV Index: " + data.current.uvi);//(with scale - Favorable, Moderate, Severe)
    //         console.log("Future Conditions(5 - Day Forecast");

    //         printCurrent(citySearch, data);
    //         printFiveDayForecast(data);
    //     });

}

function printCurrent(citySearch, city) {

    var unixTime = moment.unix(city.current.dt).format();

    var timezoneOffset = city.timezone_offset / 3600;
    var cityNameEl = document.querySelector("#current-city");
    cityNameEl.innerHTML = citySearch;
    var currentDateEl = document.querySelector("#current-date");
    currentDateEl.innerHTML = moment(unixTime).utcOffset(timezoneOffset).format("dddd Do MMM YYYY [at] h:mm A");
    var currentIconEl = document.querySelector("#current-icon");
    currentIconEl.innerHTML = '<img src="http://openweathermap.org/img/wn/' + city.current.weather[0].icon + '@2x.png"/>';
    var currentTempEl = document.querySelector("#current-temp");
    currentTempEl.innerHTML = "Temperature: " + Math.round(city.current.temp) + "&deg C";
    var currentHumEl = document.querySelector("#current-hum");
    currentHumEl.innerHTML = "Humidity: " + city.current.humidity + "%";
    var currentWindEl = document.querySelector("#current-wind");
    currentWindEl.innerHTML = "Wind Speed: " + (city.current.wind_speed * 3.6) + "km/h";
    var currentUVEl = document.querySelector("#current-UV");
    currentUVEl.innerHTML = "UV Index: " + city.current.uvi;

}

function printFiveDayForecast(city) {
    for (i = 1; i < 6; i++) {
        var dailyUnixTime = moment.unix(city.daily[i].dt).format()
        var dailyTimezoneOffset = city.timezone_offset / 3600;
        console.log(city.daily[i]);
        console.log(moment(dailyUnixTime).utcOffset(dailyTimezoneOffset).format("D/M/YY"));
        console.log(city.daily[i].temp.min + "&deg C - " + city.daily[i].temp.max + "&deg C");
        console.log(city.daily[i].wind_speed * 3.6 + " km/h");
        console.log(city.daily[i].humidity + "%");

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
        // dayCard.innerHTML = [
        //     '<h5>Day</h5>            <p>Humidity: ${city.daily[i].humidity}</p>
        //     ',

        // ];
        document.querySelector("#fiveDayResults").appendChild(dayCard);
    }
    document.querySelector("#fiveDayForecast").textContent = "5 Day Forecast";
}
init();
searchFormEl.addEventListener('submit', handleSearchFormSubmit);