// save place to local storage and append to the table in the card.
var pastSearches = [];
var apiData;
var uvqueryURL;
var latVar;
var lonVar;
var x;
var previousSearches;
var APIKey = "92ce17e1323ad237fdf4a085b335d5bf";
var fivedayqueryURL;

renderButtons();

var storedCities = localStorage.getItem("weatherCities");
console.log(storedCities);
if (storedCities === null) {
    weatherCities = ["Raleigh"];
}
else {
    weatherCities = JSON.parse(storedCities);
    lastCityIndex = localStorage.getItem("lastCityIndex");
}

function renderButtons() {
    $("#pastLocations").empty(); 
        previousSearches = localStorage.getItem("previous").split(",") 
    if (previousSearches) {
        previousSearches = localStorage.getItem("previous").split(",") 
        console.log("previous searches ", previousSearches);
        for (var i = 0; i < previousSearches.length; i++) {
            var a = $("<button>");
            a.addClass("pastSearches");
            a.attr("data-name", previousSearches[i]);
            a.text(previousSearches[i]);
            $("#pastLocations").append(a);
        }
    }
}

// cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1); 

$("#searchButton").on("click", function (event) {
    setCurrentInfo();
    setFiveDayForecast();
    $("#data").empty();
    $("#search-input").empty();
});

// $(document).on("click", ".pastSearches", function (event) {
//     setCurrentInfo();
// })

$(document).on("click", ".pastSearches", function () {
    setPastInfo($(this).text());
    // setFiveDayForecast();
});

function setCurrentInfo() {
    event.preventDefault();

    // var APIKey = localStorage.getItem("APIKey");

    var userSearchLocation = $("#search-input").val().trim();
    previousSearches = localStorage.getItem("previous");
    if (previousSearches) {
        previousSearches += ',' + userSearchLocation
    } else {
        previousSearches = userSearchLocation
    }

    localStorage.setItem("previous", previousSearches)

    console.log(userSearchLocation);

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearchLocation + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        apiData = response;
        console.log(queryURL);
        console.log(response);

        var iconSrc = 'https://openweathermap.org/img/wn/10d@2x.png';
        // 'https://openweathermap.org/img/wn/' + response.weather[0].iconCode + "@2x.png"; 

        $("#current").html(`<h1>${response.name}</h1>`)
        let m = moment().format("MM" + " /DD" + " /YY");
        var x = document.getElementById("date").textContent = (m)
        $("#icon").html(iconSrc)
        $("#data").html(`<div><h4>Temperature: ${response.main.temp}ºF</h4></div>
            <h4>Humidity: ${response.main.humidity}%</h4>
            <h4>Wind: ${response.wind.speed}mph</h4>`)

        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" +
            response.coord.lat +
            "&lon=" + response.coord.lon + "&appid=" + APIKey;

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (response) {
            var uvValue = response.value;
            var uvDisplay = $("#uvIndex");
            uvDisplay.text("UV Index: " + uvValue);
            uvValue = parseFloat(uvValue);
            if (uvValue < 3) {
                $("#uvIndex").attr("class", "p-1 bg-success text-white");
            }
            else if (uvValue < 8) {
                $("#uvIndex").attr("class", "p-1 bg-warning text-dark");
            }
            else if (uvValue >= 8) {
                $("#uvIndex").attr("class", "p-1 bg-danger text-white");
            }
        })

        // convert to farenheit
        // var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        //     $(".tempF").text("Temperature (Kelvin) " + tempF);
    });
}

function setPastInfo() {
    event.preventDefault();

    // var APIKey = localStorage.getItem("APIKey");

    var buttonText = $('.pastSearches').text();
    console.log(userSearchLocation);

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + buttonText + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        apiData = response;
        console.log(queryURL);
        console.log(response);

        $("#current").html(`<h1>${response.name}</h1>`)
        let m = moment().format("MM" + " /DD" + " /YY");
        var x = document.getElementById("date").textContent = (m)
        $("#icon").html
        $("#data").append(`<div><h4>Temperature: ${response.main.temp}ºF</h4></div>
            <h4>Humidity: ${response.main.humidity}%</h4>
            <h4>Wind: ${response.wind.speed}mph</h4>
            <h4>UV Index: ${response.main.visibility}</h4>`)

        // convert to farenheit
        // var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        //     $(".tempF").text("Temperature (Kelvin) " + tempF);
    });
}

function setFiveDayForecast() {
   // to only get one piece of data per day
//    var APIKey = localStorage.getItem("APIKey");

   var userSearchLocation = $("#search-input").val().trim();
   fivedayqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userSearchLocation + "&units=imperial&appid=" + APIKey;
   console.log(response);
//    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            $('#forecastData').append(`<div><h5>Temp: ${response.main.temp}ºF</h5></div>
            <h5>Humidity: ${response.main.humidity}%<h5>`)
            $('#forecastIcon').append(response.weather.id)
//    }
};