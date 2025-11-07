// Server.jsx
import axios from "axios";

export const api = axios.create({
  baseURL: `https://api.open-meteo.com/v1/forecast`,
});

export async function getWeatherData(lat, lon, name, country, unit) {
  const res = await api.get(
    `?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,precipitation_probability,precipitation&forecast_days=7&current=relative_humidity_2m,precipitation,wind_speed_10m,temperature_2m,apparent_temperature,weather_code&temperature_unit=${unit.unit_temp}&wind_speed_unit=${unit.wind_speed}&precipitation_unit=${unit.perp}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto
    `
  );
  return { ...res.data, name, country };
}
