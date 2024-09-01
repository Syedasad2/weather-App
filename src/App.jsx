import { useEffect, useState } from 'react';
import './index.css'; // Ensure Tailwind CSS is imported

const topCities = [
  "Karachi",
  "Lahore",
  "Abbottabad",
  "Islamabad",
  "Bahawalpur",
  "Multan",
  "Gwadar",
  "Hyderabad",
  "Rawalpindi",
  "Sukkur",
  "Beijing",
  "Amsterdam",
  "São Paulo"
];

function App() {
  const [chosen, setChosen] = useState(topCities[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const query = currentPosition
      ? `lat=${currentPosition.lat}&lon=${currentPosition.lon}`
      : `q=${chosen}`;

    fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=367013bed623197d94b26be9e58ee90b&units=${unit}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [chosen, unit, currentPosition]);

  const handleCityChange = (e) => {
    setChosen(e.target.value);
  };

  const handleUnitChange = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  };

  const temp = weatherData ? Math.round(weatherData.main.temp) : null;
  const feelsLike = weatherData ? Math.round(weatherData.main.feels_like) : null;

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-center" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1561553543-e4c7b608b98d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}>
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-screen flex flex-col items-center overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Weather App</h1>

        <div className="flex flex-col gap-4 mb-6 w-full">
          <button 
            onClick={handleCurrentLocation} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full"
          >
            Use Current Location
          </button>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between w-full">
            <select 
              onChange={handleCityChange} 
              value={chosen} 
              className="border border-gray-300 rounded-lg py-2 px-4 shadow-sm focus:ring-2 focus:ring-blue-500 transition duration-300 w-full md:w-auto"
            >
              {topCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <button 
              onClick={handleUnitChange} 
              className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300 w-full md:w-auto"
            >
              Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
            </button>
          </div>
        </div>

        {loading ? (
          <h2 className="text-lg font-semibold text-gray-700 text-center">Loading...</h2>
        ) : error ? (
          <h2 className="text-lg font-semibold text-red-600 text-center">Error: {error.message}</h2>
        ) : weatherData ? (
          <div className="text-center text-gray-800">
            <img 
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
              alt={weatherData.weather[0].description} 
              className="mx-auto mb-4"
            />
            <h2 className="text-3xl font-semibold">{weatherData.weather[0].description.toUpperCase()}</h2>
            <h3 className="text-2xl mt-2">
              {temp}°{unit === 'metric' ? 'C' : 'F'} (Feels Like: {feelsLike}°{unit === 'metric' ? 'C' : 'F'})
            </h3>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">Humidity:</span>
                <span>{weatherData.main.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Pressure:</span>
                <span>{weatherData.main.pressure} hPa</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Wind Speed:</span>
                <span>{weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Wind Direction:</span>
                <span>{weatherData.wind.deg}°</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sunrise:</span>
                <span>{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sunset:</span>
                <span>{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">Select a city to see the weather</div>
        )}
      </div>
    </div>
  );
}

export default App;
