const apiKey = 'd4d45f027c1b7c75a362c3442e9460b9'; // Replace with your OpenWeatherMap API key

document.getElementById('weather-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const location = document.getElementById('location').value;
    getWeather(location);
});

function getWeather(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherInfo = `
                <h2>Weather in ${data.name}</h2>
                <p>&#x1F321; Temperature: ${data.main.temp}°C</p>
                <p>&#x1F4A7; Humidity: ${data.main.humidity}%</p>
                <p>&#9729; Weather: ${data.weather[0].description}</p>
            `;
            document.getElementById('weather-info').innerHTML = weatherInfo;

            // Fetch the 5-day forecast after getting the current weather
            getForecast(location);
        })
        .catch(error => {
            document.getElementById('weather-info').innerHTML = `<p>Location not found. Please correct the name and try again.</p>`;
        });
}

function getForecast(location) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let forecastHTML = '<h2>5-Days Forecast</h2>';
            for (let i = 0; i < data.list.length; i += 8) { // Get data for every 24 hours
                const day = new Date(data.list[i].dt_txt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                });
                forecastHTML += `
                    <div>
                        <p><strong>${day}</strong></p>
                        <p>&#x1F321; Temp: ${data.list[i].main.temp}°C</p>
                        <p>&#9729; Weather: ${data.list[i].weather[0].description}</p>
                    </div>
                `;
            }
            document.getElementById('weather-info').innerHTML += forecastHTML;

            // Show the "Close" button after the forecast is displayed
            document.getElementById('close-forecast').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
}

// Close the forecast and show the form
function closeForecast() {
    document.getElementById('weather-info').innerHTML = ''; // Clear the forecast and weather info
    document.getElementById('close-forecast').style.display = 'none'; // Hide the "Close" button
    document.getElementById('location').focus(); // Focus on the input field
}
