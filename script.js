async function getWeather() {
    const city = document.getElementById('city').value;
    const resultDiv = document.getElementById('weather-result');
    const cityName = document.getElementById('city-name');
    const forecastDetails = document.getElementById('forecast-details');

    cityName.textContent = city;
    resultDiv.style.display = 'block';

    const apiKey = '06a5825b3521e6efa2cc4d5807ea408b';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error fetching weather data');
        }
        const data = await response.json();
        const forecasts = data.list.slice(0, 7);

        forecastDetails.innerHTML = '';
        forecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const temperature = forecast.main.temp.toFixed(1);
            const weatherDescription = forecast.weather[0].description;
            const forecastHTML = `
                <div class="forecast-item">
                    <strong>${date.toLocaleDateString()}:</strong> ${temperature}°C, ${weatherDescription}
                </div>
            `;
            forecastDetails.innerHTML += forecastHTML;
        });
    } catch (error) {
        console.error(error);
        forecastDetails.innerHTML = '<div class="error">Error fetching weather data. Please try again.</div>';
    }
}
