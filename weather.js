
// =================
// Weather API
// =================
// initiate the weather API. get location and retrieve temp, clouds, UV index, heat index
function getWeather(lat, lng) {
    // change when formatted
    // &lat=38.123&lon=-78.543
    fetch(`https://api.weatherbit.io/v2.0/current?&lat=${lat}&lon=${lng}&key=df10f63a96934282a5e65dde3bec6c8e`)
        .then(response => response.json())
        .then(responseJson => displayWeather(responseJson))
        .catch(error => $('.weather-error').removeClass('hidden'));
}

// displays weather in the DOM
function displayWeather(response) {
    // data.weather.icon
    let data = response.data[0];
    // icon src
    let iconSrc = `pics/weatherIcons/icons/${data.weather.icon}.png`;
    let temperature = convertTemp(data.temp);
    // get sunscreen reccomendations
    let suggestion = sunscreen(data.uv);
    $('.temperature').text(`${temperature}`);
    // weather icons
    $('.weather-icon').attr('src', `${iconSrc}`);
    $('.weather-icon').attr('alt', `${iconSrc}`);
    $('.weather-description').text(`${data.weather.description}`);
    $('.uv-index').text(`${Math.floor(data.uv)}`);
    // sunscreen reccomendations
    $('.sunscreen').text(`${suggestion}`);
}

// convert the temperature to imperial
function convertTemp(celsius) {
    let temp = Math.round(Math.floor(celsius));
    return (temp * 9 / 5) + 32;
}

// sunscreen reccomendations
function sunscreen(uvData) {
    let suggestion = [
        'It\'s night time you don\'t need sunscreen.',
        'Probably best to wear a hat if you don\'t want a sun burn.',
        'I would reccomend wearing wearing a hat and putting on sunscreen.',
        'Be sure to put on plenty of sunscreen and wear a hat.',
        'If you dont want to put on lots of sunscreen I would wait to take a walk until after 7p.m'
    ];
    let data = Math.floor(uvData);

    if (data === 0) {
        return suggestion[0];
    } else if (data <= 3 && data > 0) {
        return suggestion[1]
    } else if (data >= 4 && data <= 6) {
        return suggestion[2]
    } else if (data >= 5 && data <= 7) {
        return suggestion[3];
    } else if (data >= 8) {
        return suggestion[4];
    }
}
