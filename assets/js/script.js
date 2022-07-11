var state = {
    history:[]
};

function init () {
    loadState();
    renderHistory();

    $("#search-button").on('click',function(){
        // Search city and get the coordinates
        var city = $("#input-city").val();
        renderWeather(city);

        // Ensure the city is not duplicated
        if (state.history.indexOf(city) === -1) {
            state.history.push(city);
            saveState()
        }

        renderHistory();

        
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

function renderWeather(city) {
    // get the coordinates of the city
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(city) + '&key=AIzaSyBWkMk0SZcUUxPMUw__hBkOQRaahoZMZHo')
        .then(response => response.json())
        .then(data => {
            // Gets the city longitude and latitude coordinates
            var latitude = data.results[0].geometry.location.lat;
            var longitude = data.results[0].geometry.location.lng;

            var coordinates = {
                latitude: latitude,
                longitude: longitude
            };
            return coordinates;           
        })
        .then(function(coordinates) {
            // with the coordinates of the city obtain the weather
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + coordinates.latitude + "&lon=" + coordinates.longitude +"&units=metric&appid=d7b05bd3309734b1667a4dcf67a3c01a")
            .then(response => response.json())
            .then(function(weather){
                return weather;
            })
            .then(function(weather){
                // Render the weather
                var today = new Date();
                var todayString = ' (' +today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() + ')';

                $("#city").text(city + todayString);
                $("#temperature").text(weather.current.temp + "°C");
                $("#wind").text(weather.current.wind_speed + " km/h");
                $("#humidity").text(weather.current.humidity + " %");
                $("#uv-index").text(weather.current.uvi);
                
            });
        })
        ;
}

function renderHistory() {
    $("#city-list").empty();
    for (var i = 0; i < state.history.length; i++){
        var city = $("<button class='col-12 rounded btn btn-secondary'></button>");
        city.text(state.history[i]);
        city.on('click', function() {
            var button = $(this);
            renderWeather(button.text());
        });

        $("#city-list").append(city);
    }
    
}

init();