const axios = require('axios');

const getWeatherByCity = async (city) => {
  if (!city || !process.env.OPENWEATHER_API_KEY) {
    return null;
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    return {
      cityName: data.name,
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    return null;
  }
};

module.exports = { getWeatherByCity };