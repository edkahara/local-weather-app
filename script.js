$(document).ready(function() {
  //set variables
  var image = document.createElement('img');
  var imageURL = "https://openweathermap.org/img/w/";
  var imageFormat = ".png";
  var webURL = "https://api.openweathermap.org/data/2.5/weather?";
  var lat;
  var lon;
  var id = "&APPID=ba0a8a5f3fd1703e953e4ae6e2570a93";
  var celsius = "&units=metric";
  var fahrenheit = "&units=imperial";

  //either get the latitude and longitude of a location or display an alert message
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }

  //show an alert message if one of the erros below occurs
  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for geolocation");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occured");
        break;
    }
  }

  //show location, temperature and weather conditions
  function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    var rootInKelvin = webURL + "lat=" + lat + "&lon=" + lon + id;
    var rootInCelsius = webURL + "lat=" + lat + "&lon=" + lon + celsius + id;
    var rootInFahrenheit = webURL + "lat=" + lat + "&lon=" + lon + fahrenheit + id;

    //get the city, country and description of the weather
    function locale() {
      $.getJSON(rootInKelvin, function(json) {
        var description = json.weather[0].description;
        var city = json.name;
        var country = json.sys.country;
        var weatherIcon = json.weather[0].icon;
        image.src = imageURL + weatherIcon + imageFormat;
        $('.weatherLocation').append(image);
        $('img').addClass('img-responsive center-block');
        $('.weatherLocation').append('<li>' + '<p class = "text-center">' + city + ', ' + country + '</p>' + '<p class = "text-center">' + description + '</p></li>');
      });
    }
    locale();

    //show the temperature in celcius
    function inCelsius() {
      $.getJSON(rootInCelsius, function(json) {
        var tempInCelsius = json.main.temp;
        $('.weatherInfo').append('<li><p class = "text-center">' + tempInCelsius + '&#8451; ' + '<br/><button class = "btn btn-primary" id = "convertToFahrenheit">In Fahrenheit</button><button class = "hidden btn btn-   primary" id = "convertToCelsius">In Celsius</button><p></li>');
      });
    }
    inCelsius();

    //show the temperature in fahrenheit
    function inFahrenheit() {
      $.getJSON(rootInFahrenheit, function(json) {
        var tempInFahrenheit = json.main.temp;
        $('.weatherInfo').append('<li><p class = "text-center">' + tempInFahrenheit + '&#8457; ' + '<br/><button class = "hidden btn btn-primary" id = "convertToFahrenheit">In Fahrenheit</button><button class = "btn btn-primary" id = "convertToCelsius">In Celsius</button><p></li>');
      });
    }

    //on click, convert temperature to fahrenheit
    $('.weatherInfo').delegate('#convertToFahrenheit', 'click', function() {
      var $li = $(this).closest('li');
      inFahrenheit();
      $li.remove();
    });

    //on click, convert temperature to celcius
    $('.weatherInfo').delegate('#convertToCelsius', 'click', function() {
      var $li = $(this).closest('li');
      inCelsius();
      $li.remove();
    });
  }
});
