// basic term in comments
// places: a resteraunt or park. a physical establishment
// area: city 
// Sadly must be global because it is accessed by multiple functions and used by many google funcitons
let map;

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
    // check to make sure there are infact places near by
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        // iterate through and push the markers through to display
        for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
            console.log(results[i]);
        }
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
    // set search location to addr
    let place = new google.maps.LatLng(lat, lng);
    // center map on the search location
    map = new google.maps.Map(document.getElementById('map'), {
        center: place,
        zoom: 15
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
    // info window is the window that pops up when marker is clicked
    let infowindow = new google.maps.InfoWindow();
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
}

// watch the form for submit
function watchForm(){
    $(document).on('submit', 'form', function (e) {
        // prevent default
        e.preventDefault();
        // get search term
        let term = $("#term").val();
        console.log(term);
        // displays map and initializes
        initialize(term);
    })
}


(function(){
  
  //watchForm();
}());