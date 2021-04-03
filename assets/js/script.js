var searchFormEl = document.querySelector('#search-form');

var citySearchLat = "";
var citySearchLon = "";

const excludes = "&exclude=minutely,hourly,alerts";

var OWMApiKey = "&appid=8161cdf2d2a69066a121e9f145638d0a";

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#city-input').value;

    if (!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }
    console.log(searchInputVal);

    searchApi(searchInputVal);
}


function searchApi(citySearch) {
    // fetch request gets a list of all the repos for the node.js organization
    // var citySearch = "Sydney";
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + citySearch + OWMApiKey;

    fetch(requestUrl)
        .then(function (response) {
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


                });
        });
}
searchFormEl.addEventListener('submit', handleSearchFormSubmit);