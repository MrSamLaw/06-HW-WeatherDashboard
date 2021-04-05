var searchFormEl = document.querySelector("#search-form");
var searchHistoryEl = document.querySelector("#search-history");
var searchResultsEl = document.querySelector("#search-results");

var citySearchLat = "";
var citySearchLon = "";

var searchHistory = [];

const excludes = "&exclude=minutely,hourly,alerts";

var OWMApiKey = "&appid=8161cdf2d2a69066a121e9f145638d0a";

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#city-input').value;

    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }
    // updateSearchHistory(searchInputVal);
    searchApi(searchInputVal);
}

function init() {
    getSearchHistory();
}

function getSearchHistory() {
    //Pulls search history from localStorage if there is any
    var storedHistory = JSON.parse(localStorage.getItem("searchHistory"));

    if (storedHistory !== null) {
        searchHistory = storedHistory;
    }
}

function updateSearchHistory(citySearch) {
    console.log("Update Search History");
    console.log("searchHistory Length = " + searchHistory.length);
    for (i = 0; i < searchHistory.length; i++) {
        console.log("i= " + i);
        console.log("citySearch= " + citySearch);
        console.log("searchHistory= " + searchHistory[i]);
        if (citySearch === searchHistory[i]) {
            console.log("break")
            return;
        } else {
            searchHistory.push(citySearch);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        }
        searchHistoryEl.innerHTML = "<button class=\"btn btn-info btn-block\">" + searchHistory[i] + "</button>"
    }
}

function searchApi(citySearch) {
    // fetch request gets a list of all the repos for the node.js organization
    // var citySearch = "Sydney";
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + citySearch + OWMApiKey;

    fetch(requestUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.city.coord);
            console.log(data.city.coord.lat);
            console.log(data.city.coord.lon);
            citySearchLat = "lat=" + data.city.coord.lat;
            citySearchLon = "&lon=" + data.city.coord.lon;
            console.log(citySearchLat);
            console.log(citySearchLon);

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
                    console.log(data);

                    console.log("Current Conditions");
                    console.log("Temperature: " + data.current.temp);
                    console.log("Humidity: " + data.current.humidity);
                    console.log("Wind Speed: " + data.current.wind_speed);
                    console.log("UV Index: " + data.current.uvi);//(with scale - Favorable, Moderate, Severe)
                    console.log("Future Conditions(5 - Day Forecast");
                    for (i = 0; i < 5; i++) {
                        console.log(data.daily[i]);
                    }
                    //   - Date
                    //   - Weather Icon
                    //     - Temperature
                    //     - Wind Speed
                    //       - Humidity

                    printResults(citySearch, data);
                });
        });
}

function printResults(citySearch, city) {
    console.log("Print Results");

    var unixTime = moment.unix(city.current.dt).format();
    console.log(unixTime);

    var timezoneOffset = city.timezone_offset / 3600;
    console.log(timezoneOffset);
    console.log(moment(unixTime).utcOffset(timezoneOffset).format("dddd Do MMM YYYY [at] H:mm A"));
    var cityNameEl = document.querySelector("#current-city");
    cityNameEl.innerHTML = citySearch;
    var currentDateEl = document.querySelector("#current-date");
    currentDateEl.innerHTML = moment(unixTime).utcOffset(timezoneOffset).format("dddd Do MMM YYYY [at] H:mm A");
    // <p id="current-icon">icon</p>
    // <p id="current-temp">Temperature</p>
    // <p id="current-hum">Humidity</p>
    // <p id="current-wind">Wind Speed</p>
    // <p id="current-UV">UV Index</p>
    // searchResultsEl.append(cityNameEl);
}
init();
searchFormEl.addEventListener('submit', handleSearchFormSubmit);