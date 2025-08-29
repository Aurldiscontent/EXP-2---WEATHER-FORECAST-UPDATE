// Replace with your OpenWeatherMap API key (or use the server proxy)
const API_KEY = 'fa918f176f8bb8c114be172e9e3ab6c9';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const loader = document.getElementById('loader');
const errorBox = document.getElementById('error');
const card = document.getElementById('card');

const locationEl = document.getElementById('location');
const iconEl = document.getElementById('icon');
const descEl = document.getElementById('description');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');

function showLoader(on){
  loader.classList.toggle('hidden', !on);
}
function showError(msg){
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
  card.classList.add('hidden');
}
function clearError(){
  errorBox.textContent = '';
  errorBox.classList.add('hidden');
}

function updateUI(data){
  clearError();
  card.classList.remove('hidden');
  const name = data.name;
  const country = data.sys && data.sys.country ? data.sys.country : '';
  const weather = data.weather && data.weather[0] ? data.weather[0] : null;
  const temp = data.main ? Math.round(data.main.temp) : '—';
  const humidity = data.main ? data.main.humidity : '—';
  const wind = data.wind ? data.wind.speed : '—';

  locationEl.textContent = `${name} ${country}`;
  if(weather){
    descEl.textContent = weather.description;
    const iconCode = weather.icon;
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = weather.description;
  } else {
    descEl.textContent = '';
    iconEl.src = '';
    iconEl.alt = '';
  }

  tempEl.textContent = temp;
  humidityEl.textContent = humidity;
  windEl.textContent = wind;
}

function fetchWeatherByCity(city){
  if(!city) { showError('Please enter a city name'); return; }
  clearError();
  showLoader(true);

  // ✅ Use your API key here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('City not found or request failed');
      return response.json();
    })
    .then(data => updateUI(data))
    .catch(err => showError(err.message))
    .finally(()=> showLoader(false));
}

function fetchWeatherByCoords(lat, lon){
  clearError();
  showLoader(true);

  // ✅ Use your API key here
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Location request failed');
      return response.json();
    })
    .then(data => updateUI(data))
    .catch(err => showError(err.message))
    .finally(()=> showLoader(false));
}

// events
searchBtn.addEventListener('click', () => {
  fetchWeatherByCity(cityInput.value.trim());
});
cityInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') fetchWeatherByCity(cityInput.value.trim());
});
geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('Geolocation not supported in this browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    err => showError('Unable to get location: ' + err.message)
  );
});