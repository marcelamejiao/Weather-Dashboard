var state = {};

function init () {
    $("#search-button").on('click',function(){

        // Search city and get the coordinates
        var city = $("#input-city").val();
        var promise = convertCityToCoordinates(city);
        promise.then(function(coordinates){
            console.log(coordinates);
        });
        
        // Get the city's weather
        // Render the city's weather on the screen
        // Render the 5 day forecast 
        // Render search history
    });
}

function loadState() {
    var json = localStorage.getItem("weather_dashboard");

    if (json !== null) {
        state = JSON.parse(json);
    }  
}

function saveState() {
    var json = JSON.stringify(state);

    localStorage.setItem("weather_dashboard", json);
}

function convertCityToCoordinates(city)
{
    return fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(city) + '&key=AIzaSyBWkMk0SZcUUxPMUw__hBkOQRaahoZMZHo')
        .then(response => response.json())
        .then(data => {
            // Gets the city longitude and latitude coordinates
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;

            var coordinates = {
                latitude: lat,
                longitude: lng
            };
            return coordinates;           
        });
}

init();