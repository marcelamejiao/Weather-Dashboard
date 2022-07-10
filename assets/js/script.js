var state = {};

function init () {
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

// $("#search-button").on('click',function(){

// });

// function convertAddressToCoordinates(address)
// {
//     fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address) + '&key=AIzaSyBWkMk0SZcUUxPMUw__hBkOQRaahoZMZHo')
//     .then(response => response.json())
//     .then(data => {
//         // Gets the address longitude and latitude coordinates
//         var lat = data.results[0].geometry.location.lat;
//         var lng = data.results[0].geometry.location.lng;
//     })
// }

init();