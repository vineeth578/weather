  // Select elements
  const locationElement = document.getElementById('location');
  const updateTimeElement = document.getElementById('update-time');
  const bgToggleBtn = document.getElementById('bg-toggle-btn');
  const currentDateElement = document.getElementById('current-date');
  const currentTimeElement = document.getElementById('current-time');
  const weatherIcon = document.getElementById('weather-icon').firstElementChild;
  const temperatureElement = document.getElementById('temperature');
  const clockRange = document.getElementById('clock-range');
  const timeDisplay = document.getElementById('time-display');
  const timeLabels = document.getElementById('time-labels');

  let isTransparent = false; // Initialize state for background toggle
let isTextWhite = false; // Initialize state for text color toggle

// Add event listener for background toggle button
bgToggleBtn.addEventListener('click', () => {
    if (isTransparent) {
        // Set original blue background and text color
        document.body.style.backgroundColor = '#318CE7'; // Original blue background
        document.body.style.color = '#000000'; // Set text color to black
        bgToggleBtn.textContent = 'Change Background';
    } else {
        // Set transparent white background and change text color
        document.body.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Transparent white background
        document.body.style.color = '#318CE7'; // Set text color to blue
        bgToggleBtn.textContent = 'Revert Background';
    }
    isTransparent = !isTransparent; // Toggle the background state
});


  // Update location dynamically based on user's location
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;

          // Fetch location info using reverse geocoding API (example uses geocode.xyz)
          fetch(`https://geocode.xyz/${latitude},${longitude}?json=1`)
              .then(response => response.json())
              .then(data => {
                  const { city, state, country } = data;
                  locationElement.textContent = `${city}, ${state}, ${country}`;
                  updateTimeElement.textContent = `Updated a few seconds ago`;
              })
              .catch(error => {
                  locationElement.textContent = 'Unable to retrieve location';
                  console.error(error);
              });

          // Initialize the map
          const map = L.map('map').setView([latitude, longitude], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          L.marker([latitude, longitude]).addTo(map)
              .bindPopup('You are here.')
              .openPopup();
      }, error => {
          locationElement.textContent = 'Geolocation is disabled or not supported.';
          console.error(error);
      });
  } else {
      console.error('Geolocation is not supported by this browser.');
  }

  // Update date and time dynamically
  function updateDateTime() {
      const now = new Date();
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

      currentDateElement.textContent = now.toLocaleDateString(undefined, dateOptions);
      currentTimeElement.textContent = now.toLocaleTimeString(undefined, timeOptions);
  }

  // Call updateDateTime every second to keep it live
  setInterval(updateDateTime, 1000);

  // Sample weather condition and temperature (will come from your API)
  const weatherCondition = 'Clear';  // Replace with actual condition from API
  const temperature = 28; // Replace with actual temperature from API

  // Change the icon based on weather condition
  switch (weatherCondition) {
      case 'Clear':
          weatherIcon.className = 'fas fa-sun';
          break;
      case 'Rain':
          weatherIcon.className = 'fas fa-cloud-showers-heavy';
          break;
      case 'Clouds':
          weatherIcon.className = 'fas fa-cloud';
          break;
      case 'Snow':
          weatherIcon.className = 'fas fa-snowflake';
          break;
      default:
          weatherIcon.className = 'fas fa-cloud';
  }

  // Update the temperature dynamically
  temperatureElement.textContent = `${temperature}°C`;

  // Function to convert minutes to HH:MM format
  function formatTimeFromRange(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = mins < 10 ? `0${mins}` : mins;
      return `${formattedHours}:${formattedMinutes}`;
  }

  // Get current time
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const totalCurrentMinutes = currentHours * 60 + currentMinutes;

  // Set range input to current time and max value to 1440 (next 24 hours)
  clockRange.value = totalCurrentMinutes;
  clockRange.max = 1440; // 24 hours in minutes
  timeDisplay.textContent = formatTimeFromRange(clockRange.value);

  // Create hour labels
  for (let i = 0; i <= 24; i++) {
      const label = document.createElement('div');
      const labelTime = formatTimeFromRange(i * 60); // i hours in minutes
      label.textContent = labelTime;
      timeLabels.appendChild(label);
  }

  // Update the time display whenever the range changes
  clockRange.addEventListener('input', function () {
      const selectedMinutes = parseInt(clockRange.value);
      const totalMinutes = totalCurrentMinutes + selectedMinutes;
      timeDisplay.textContent = formatTimeFromRange(totalMinutes);
  });

     // Sample weather data for 10 days (replace this with your actual API data)
     const weatherData = [
      { day: 'Monday', date: '2024-10-21', condition: 'Clear', temperature: 28, icon: 'fas fa-sun' },
      { day: 'Tuesday', date: '2024-10-22', condition: 'Clouds', temperature: 25, icon: 'fas fa-cloud' },
      { day: 'Wednesday', date: '2024-10-23', condition: 'Rain', temperature: 20, icon: 'fas fa-cloud-showers-heavy' },
      { day: 'Thursday', date: '2024-10-24', condition: 'Clear', temperature: 30, icon: 'fas fa-sun' },
      { day: 'Friday', date: '2024-10-25', condition: 'Snow', temperature: -2, icon: 'fas fa-snowflake' },
      { day: 'Saturday', date: '2024-10-26', condition: 'Clouds', temperature: 22, icon: 'fas fa-cloud' },
      { day: 'Sunday', date: '2024-10-27', condition: 'Rain', temperature: 18, icon: 'fas fa-cloud-showers-heavy' },
      { day: 'Monday', date: '2024-10-28', condition: 'Clear', temperature: 26, icon: 'fas fa-sun' },
      { day: 'Tuesday', date: '2024-10-29', condition: 'Clear', temperature: 27, icon: 'fas fa-sun' },
      { day: 'Wednesday', date: '2024-10-30', condition: 'Rain', temperature: 19, icon: 'fas fa-cloud-showers-heavy' },
  ];

  const slidesContainer = document.getElementById('slides');
  let currentSlide = 0;

  // Generate slides based on weather data
  weatherData.forEach(weather => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = `
          <h2>${weather.day}</h2>
          <p>${weather.date}</p>
          <p><i class="${weather.icon}"></i></p>
          <p>${weather.condition}</p>
          <p>${weather.temperature}°C</p>
      `;
      slidesContainer.appendChild(slide);
  });

  // Update slide position based on currentSlide index
  function updateSlidePosition() {
      const slideWidth = slidesContainer.clientWidth;
      slidesContainer.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
  }

  // Control buttons
  document.getElementById('prev-btn').addEventListener('click', () => {
      currentSlide = (currentSlide > 0) ? currentSlide - 1 : weatherData.length - 1;
      updateSlidePosition();
  });

  document.getElementById('next-btn').addEventListener('click', () => {
      currentSlide = (currentSlide < weatherData.length - 1) ? currentSlide + 1 : 0;
      updateSlidePosition();
  });

  // Initialize the slide position
updateSlidePosition();
  
const ctx = document.getElementById('weatherChart').getContext('2d');
const weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Months
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [30, 28, 25, 22, 20, 24, 28, 30, 32, 30, 25, 20], // Sample temperature data
                borderColor: 'rgba(255, 99, 132, 1)', // Red
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
            {
                label: 'Precipitation (mm)',
                data: [60, 50, 80, 70, 100, 120, 90, 80, 50, 40, 60, 70], // Sample precipitation data
                borderColor: 'rgba(54, 162, 235, 1)', // Blue
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
            },
            {
                label: 'Humidity (%)',
                data: [75, 70, 65, 60, 55, 50, 55, 60, 65, 70, 75, 80], // Sample humidity data
                borderColor: 'rgba(75, 192, 192, 1)', // Teal
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Wind Speed (km/h)',
                data: [10, 15, 12, 18, 20, 22, 24, 26, 20, 18, 15, 10], // Sample wind speed data
                borderColor: 'rgba(153, 102, 255, 1)', // Purple
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
            },
        ],
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Months',
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
    },
});