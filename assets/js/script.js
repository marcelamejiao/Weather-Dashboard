var state = {
    history:[]
};

function init () {
    loadState();
    renderHistory();

    $("#search-button").on('click',function(){
        // Search city and get the coordinates
        var city = $("#input-city").val();
        // Make sure the city has been provided
        if (city === "") {
            window.alert("Please provide a city.");
            return;
        }

        renderWeather(city);

        // Ensure the city is not duplicated
        if (state.history.indexOf(city) === -1) {
            state.history.push(city);
            saveState()
        }

        renderHistory();
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

                // Generate the weather icons
                var iconHtml = '';
                for(var currentWeather of weather.current.weather) {
                    iconHtml += "<img width='64px' title='" + currentWeather.description + "' src='http://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png' />";
                }

                // Set the values
                $("#city").html(city + todayString + iconHtml);
                $("#temperature").text(weather.current.temp + "°C");
                $("#wind").text(weather.current.wind_speed + " km/h");
                $("#humidity").text(weather.current.humidity + " %");
                
                // Set the UV Index
                $("#uv-index").text(weather.current.uvi);
                if (weather.current.uvi <= 2) {
                    $("#uv-index").addClass('favorable');
                } else if (weather.current.uvi <= 5) {
                    $("#uv-index").addClass('moderate');
                } else if (weather.current.uvi > 5) {
                    $("#uv-index").addClass('severe');
                }

                // Render the 5 day forecast
                var template = $('#five-days-forecast .template');
                
                // Remove old forecasts
                $('#five-days-forecast .forecast').remove();
                for (var i = 1; i < 6; i++) {
                    var forecast = template.clone();
                    // Remove the template class so that it is visible
                    forecast.removeClass('template');
                    forecast.addClass('forecast');

                    // Get the weather for this day
                    var dayWeather = weather.daily[i];

                    // Get the day's date
                    var date = new Date(dayWeather.dt * 1000);

                    // Generate the weather icons
                    var iconHtml = '';
                    for(var currentWeather of dayWeather.weather) {
                        iconHtml += "<img width='64px' title='" + currentWeather.description + "' src='http://openweathermap.org/img/wn/" + currentWeather.icon + "@2x.png' />";
                    }

                    // Set the values
                    forecast.find('.date').text(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
                    forecast.find('.icon').html(iconHtml);
                    forecast.find('.temperature').text(dayWeather.temp.day + "°C");
                    forecast.find('.wind').text(dayWeather.wind_speed + " km/h");
                    forecast.find('.humidity').text(dayWeather.humidity + " %");

                    // Add the forecast to the 5-day-forecast
                    $('#five-days-forecast').append(forecast);
                }
            });
        })
        ;
}

function renderHistory() {
    // Avoid duplicate buttons
    $("#city-list").empty();

    // Redner the buttons
    for (var i = 0; i < state.history.length; i++){
        var city = $("<button class='col-12 rounded btn btn-secondary m-1'></button>");
        city.text(state.history[i]);
        city.on('click', function() {
            var button = $(this);
            renderWeather(button.text());
        });

        $("#city-list").append(city);
    }
}

init();