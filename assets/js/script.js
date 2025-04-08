document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Toggle body overflow when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => {
                        const target = +stat.getAttribute('data-count');
                        const count = +stat.innerText;
                        const increment = target / 100;
                        
                        if (count < target) {
                            const timer = setInterval(() => {
                                stat.innerText = Math.ceil(+stat.innerText + increment);
                                if (+stat.innerText >= target) {
                                    stat.innerText = target;
                                    clearInterval(timer);
                                }
                            }, 20);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelector('.stats-container').querySelectorAll('*').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Weather API functionality
    const weatherBtn = document.getElementById('weather-btn');
    if (weatherBtn) {
        weatherBtn.addEventListener('click', getWeather);
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.disabled = true;
            
            // Reset form and button after 3 seconds
            setTimeout(() => {
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Simulate submission
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                emailInput.value = '';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    // Add animation class when elements come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Run once on load and then on scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});

// Weather API function
async function getWeather() {
    const city = document.getElementById('city').value;
    const resultDiv = document.getElementById('weather-result');
    const currentWeatherDiv = document.getElementById('current-weather');
    const cityName = document.getElementById('city-name');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherDesc = document.getElementById('weather-desc');
    const feelsLike = document.getElementById('feels-like');
    const windSpeed = document.getElementById('wind-speed');
    const humidity = document.getElementById('humidity');
    const forecastDetails = document.getElementById('forecast-details');
    const weatherBtn = document.getElementById('weather-btn');

    if (!city) {
        alert('Please select a city first');
        return;
    }

    // Show loading state
    weatherBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    weatherBtn.disabled = true;
    
    cityName.textContent = city;
    currentWeatherDiv.style.display = 'flex';
    forecastDetails.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading weather data...</div>';

    const apiKey = '06a5825b3521e6efa2cc4d5807ea408b'; // Consider using environment variables in production
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error fetching weather data');
        }
        const data = await response.json();
        
        // Check if data is available
        if (!data.list || data.list.length === 0) {
            throw new Error('No weather data available for this location');
        }
        
        // Current weather (first forecast)
        const current = data.list[0];
        const currentDate = new Date(current.dt * 1000);
        
        weatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        weatherTemp.textContent = `${Math.round(current.main.temp)}°C`;
        weatherDesc.textContent = current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1);
        feelsLike.textContent = `${Math.round(current.main.feels_like)}°C`;
        windSpeed.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
        humidity.textContent = `${current.main.humidity}%`;
        
        // 5-day forecast (every 8th item for daily forecast at noon)
        const dailyForecasts = [];
        for (let i = 0; i < data.list.length; i += 8) {
            dailyForecasts.push(data.list[i]);
        }
        
        forecastDetails.innerHTML = '';
        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en', { day: 'numeric', month: 'short' });
            const temperature = Math.round(forecast.main.temp);
            const weatherDescription = forecast.weather[0].description;
            const iconCode = forecast.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
            
            const forecastHTML = `
                <div class="forecast-item">
                    <div class="forecast-day">${dayName}</div>
                    <div class="forecast-date">${dateStr}</div>
                    <img src="${iconUrl}" alt="${weatherDescription}" class="forecast-icon">
                    <div class="forecast-temp">${temperature}°C</div>
                    <div class="forecast-desc">${weatherDescription}</div>
                </div>
            `;
            forecastDetails.innerHTML += forecastHTML;
        });
    } catch (error) {
        console.error('Weather API Error:', error);
        forecastDetails.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error fetching weather data. Please try again later.</p>
                <p class="small">${error.message}</p>
            </div>
        `;
    } finally {
        // Reset button state
        weatherBtn.innerHTML = '<i class="fas fa-search-location"></i> Get Forecast';
        weatherBtn.disabled = false;
    }
}