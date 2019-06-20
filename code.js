// basic term in comments
// places: a resteraunt or park. a physical establishment
// area: city 
// ===============
// google maps API
// ===============
// Sadly must be global because it is accessed by multiple functions and used by many google funcitons
let map;
// info window is the window that pops up when marker is clicked
let infowindow = new google.maps.InfoWindow();

// initialize map
function initialize(term) {
    // geocode 
    let geocoder = new google.maps.Geocoder();
    // get the geocode from address. 
    geocoder.geocode({ 'address': term }, function (results, status) {
        // if there are results
        if (status === 'OK') {
            // display to map
            findPlace(results);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

// callback takes info from search. 
// when a location is entered it displays the list of places i.e parks resteraunts
// and makes a marker on the map. 
function callback(results, status) {
    // store results for display in text form
    let places = [];
    // check to make sure there are infact places near by
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        // iterate through and push the markers through to display
        for (let i = 0; i < results.length; i++) {
            let place = results[i]; 
            place.marker = createMarker(results[i]); 
            places.push(place);
        }
        
        parks(places);
        // center map on results
        map.setCenter(results[0].geometry.location);
    }
}


// find the places
function findPlace(results){
    // query
    let service;
    // get the geocode for area to search in  
    let lat = results[0].geometry.location.lat();
    let lng = results[0].geometry.location.lng();
    // get the weather
    getWeather(lat, lng);
    // set search location to addr
    let place = new google.maps.LatLng(lat, lng);
    // center map on the search location
    map = new google.maps.Map($('#map')[0], {
        center: place,
        zoom: 12
    });
    
    // area to search the query
    let request = {
        location: place,
        // radius from center of town in meters
        // kilometer is 1k meters. mile is 1.6 km
        radius: '8000',
        query: 'park'
    };
    // initiate places
    service = new google.maps.places.PlacesService(map);
    // search for places in geocode
    service.textSearch(request, callback);
}

// create markers on map
function createMarker(place) {
    
    // set markers
    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    // if the marker is clicked
    // This can only be done in vanilla js because the marker is google generated
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
    return marker;
}



// get results and display picture, name, link or place on map
function parks(place){
    place.forEach(function(park){
        // if the park has no picture data remove it
        if(!park.photos){
           console.log("No pictures");
           return 
        }
        let picSrc = park.photos[0].getUrl();
        $('.results').append(`
        <div class="result" id="${park.id}">
            <img class="result-img" src="${picSrc}" alt="${park.name}">
            <a class="name">${park.name}</a>
        </div>
       `); 
    });
    // Now check for clicks on the created links
    watchParks(place);
}
// checks if the result div is clicked. then opens the info window on the map
function watchParks(park){
    $(document).on('click', '.result', function(){
       let divId = this.id;
       park.forEach(function(place){
           let parkId = place.id;
           if(parkId === divId){
               infowindow.setContent(place.name);
               infowindow.open(map, place.marker);
           }
       });
    });
}

// =================
// Weather API
// =================
// initiate the weather API. get location and retrieve temp, clouds, UV index, heat index
function getWeather(lat, lng){
    // change when formatted
    // &lat=38.123&lon=-78.543
    fetch(`https://api.weatherbit.io/v2.0/current?&lat=${lat}&lon=${lng}&key=df10f63a96934282a5e65dde3bec6c8e`)
        .then(response => response.json())
        .then(responseJson => displayWeather(responseJson))
        .catch(error => alert("Weather Api Error. Please try again later"));

}

// displays weather in the DOM
function displayWeather(response){
    console.log(response);
    let data = response.data[0];
    let temperature = convertTemp(data.temp);
    // get sunscreen reccomendations
    let suggestion = sunscreen(data.uv);
    console.log(data.temp);
    $('.temperature').text(`${temperature}`);
    console.log(data.weather.description);
    $('.weather-description').text(`${data.weather.description}`);
    console.log(data.uv);
    $('.uv-index').text(`${Math.floor(data.uv)}`);
    console.log(suggestion);
    // sunscreen reccomendations
    $('.sunscreen').text(`${suggestion}`);
    console.log(temperature);
}

// convert the temperature to imperial
function convertTemp(celsius){ 
    let temp = Math.floor(Math.round(celsius));  
    return (temp * 9 / 5) + 32;
}

// sunscreen reccomendations
function sunscreen(uvData){
    let suggestion = [
        'It\'s night time you don\'t need sunscreen.',
        'Probably best to wear a hat if you don\'t want a sun burn.',
        'I would reccomend wearing wearing a hat and putting on sunscreen.',
        'Be sure to put on plenty of sunscreen and wear a hat.',
        'If you dont want to put on lots of sunscreen I would wait to take a walk until after 7p.m'
    ];
    let data = Math.floor(uvData);

    if(data === 0){
        return suggestion[0];
    } else if (data <= 3  && data >0){
        return suggestion[1]
    }else if(data >=4 && data <= 6){
        return suggestion[2]
    }else if(data >= 5 && data <=7){
        return suggestion[3];
    }else if(data >=8){
        return suggestion[4];
    }
}

// watch the form for submit
function watchForm(){
    $(document).on('submit', 'form', function (e) {
        // prevent default
        e.preventDefault();
        // prepare the page for results
        prepPage();
        // clear previous results
        $('.result').remove();
        // get search term
        let term = $("#term").val();
        console.log(term);
        // displays map and initializes
        initialize(term);
    });
}

// prepare page for search results
// This will be animated in the future
function prepPage(){
    $('.text').addClass('hidden');
    $('.results').removeClass('hidden');
    $('.weather').removeClass('hidden');
}

(function(){
  
  watchForm();
  
}());