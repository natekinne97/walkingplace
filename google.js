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
            $('.google-error').removeClass('hidden');
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
function findPlace(results) {
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
function parks(place) {
    place.forEach(function (park) {
        // if the park has no picture data remove it
        if (!park.photos) {
            console.log("No pictures");
            return
        }
        let picSrc = park.photos[0].getUrl();
        $('.results').append(`
        <div class="result" id="${park.id}">
            <img class="result-img" src="${picSrc}" alt="${park.name}">
            <p class="name">${park.name}</p>
        </div>
       `);
    });
    // Now check for clicks on the created links
    watchParks(place);
}
// checks if the result div is clicked. then opens the info window on the map
function watchParks(park) {
    $(document).on('click', '.result', function () {
        let divId = this.id;
        park.forEach(function (place) {
            let parkId = place.id;
            if (parkId === divId) {
                infowindow.setContent(place.name);
                infowindow.open(map, place.marker);
            }
        });
    });
}
