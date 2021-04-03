# 06-HW-WeatherDashboard
BCS Homework 06 - Weather Dashboard

## Description
Our client is planning on taking some time to travel the world and see the sights when COVID-19 ends.  Whilst travelling, they would like to be able to check the weather as they go to aid them in their activity & wardrobe planning.

## Criteria
- The site is a weather dashboard
    - Weather API from openweathermap.org
- City search form
- City search history (using localStorage)
- Weather display results:
    - Current Conditions
        - Temperature
        - Humidity
        - Wind Speed
        - UV Index (with scale - Favorable, Moderate, Severe)
    - Future Conditions (5-Day Forecast)
        - Date
        - Weather Icon
        - Temperature
        - Wind Speed
        - Humidity

## Deployment

## Screenshots

## Psuedo Code
- User inputs city name
- Accept user input on enter key or button press
- Validate input is not empty
- Clear user input form
- Define URLSearhParams with user input
- Make OpenWeatherMap API Fetch Call to get Lat & Lon
- Make OpenWeatherMap One Call API Fetch call
- Extract required data from promise into an object with:
    - Current Conditions
        - Temperature
        - Humidity
        - Wind Speed
        - UV Index (with scale - Favorable, Moderate, Severe)
    - Future Conditions (5-Day Forecast)
        - Date
        - Weather Icon
        - Temperature
        - Wind Speed
        - Humidity
- Display object data
- Store city name in localStorage
- Event handler for previous city searches

## Inspiration