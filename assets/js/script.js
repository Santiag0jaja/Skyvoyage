document.addEventListener('DOMContentLoaded', function() {
    // Configuración del evento para el botón del clima
    document.getElementById('weather-btn').addEventListener('click', getWeather);
    
    // Configuración del formulario de contacto
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will contact you soon.');
        this.reset();
    });
});

async function getWeather() {
    const city = document.getElementById('city').value;
    const resultDiv = document.getElementById('weather-result');
    const cityName = document.getElementById('city-name');
    const forecastDetails = document.getElementById('forecast-details');

    cityName.textContent = city;
    resultDiv.style.display = 'block';
    forecastDetails.innerHTML = '<p>Loading weather data...</p>';

    const apiKey = '06a5825b3521e6efa2cc4d5807ea408b'; // Consider using environment variables in production
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error fetching weather data');
        }
        const data = await response.json();
        
        // Verificar si hay datos disponibles
        if (!data.list || data.list.length === 0) {
            throw new Error('No weather data available for this location');
        }
        
        const forecasts = data.list.slice(0, 7); // Tomar los primeros 7 pronósticos

        forecastDetails.innerHTML = '';
        forecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const temperature = forecast.main.temp.toFixed(1);
            const weatherDescription = forecast.weather[0].description;
            const iconCode = forecast.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
            
            const forecastHTML = `
                <div class="forecast-item">
                    <div class="forecast-date">${date.toLocaleDateString()}</div>
                    <div class="forecast-temp">${temperature}°C</div>
                    <div class="forecast-desc">
                        <img src="${iconUrl}" alt="${weatherDescription}">
                        ${weatherDescription}
                    </div>
                </div>
            `;
            forecastDetails.innerHTML += forecastHTML;
        });
    } catch (error) {
        console.error('Weather API Error:', error);
        forecastDetails.innerHTML = `
            <div class="error">
                <p>Error fetching weather data. Please try again.</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}