import { useState } from "react";
import { Loader } from "./Loader";

export function DataShow({ selectedSuggestion, loading}) {
  const [show, setShow] = useState(false);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split("T")[0]
  );
  const handleShowMenu = () => setShow(!show);

  if (!selectedSuggestion) return;
  const { name, country, current, current_units, daily, hourly } =
    selectedSuggestion;
  const date = new Date(current.time);
  const formatDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const Day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const current_day = Day[date.getDay()];
  const getWeatherCondition = (code, maxTemp, rain) => {
    // ☀️ Clear or Sunny
    if (code === 0) {
      if (maxTemp >= 25) return "Hot & Sunny";
      return "Sunny";
    }

    // 🌤️ Partly cloudy
    if (code === 1 || code === 2) return "Partly_cloudy";

    // ☁️ Overcast / Cloudy
    if (code === 3) return "OverCast";

    // 🌫️ Fog
    if (code === 45 || code === 48) return "Foggy";

    // 🌦️ Drizzle (light rain)
    if (code >= 51 && code <= 57) return "Drizzle";

    // 🌧️ Rain
    if (code >= 61 && code <= 67) return "Rainy";

    // ❄️ Snow
    if (code >= 71 && code <= 77) return "Snow";

    // 🌧️ Rain showers
    if (code >= 80 && code <= 82) return "Rainy";

    if (code >= 85 && code <= 87) return "Snow";

    // ⛈️ Thunderstorm
    if (code >= 95 && code <= 99) return "Storm";
  };

  const iconMap = {
    Sunny: "../images/icon-sunny.webp",
    "Hot & Sunny": "../images/icon-sunny.webp",
    Partly_cloudy: "../images/icon-partly-cloudy.webp",
    OverCast: "../images/icon-overcast.webp",
    // Cloudy: "../images/icon-cloudy.webp",
    Rainy: "../images/icon-rain.webp",
    Drizzle: "../images/icon-drizzle.webp",
    Snow: "../images/icon-snow.webp",
    Foggy: "../images/icon-fog.webp",
    Storm: "../images/icon-storm.webp",
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="grid">
      <div className="box1">
        {/* --- Current Weather --- */}
        <div className="display_weather">
          <div className="display_place">
            <h2>
              {name}, {country}
            </h2>
            <p className="Date">
              {current_day}, {formatDate}
            </p>
          </div>

          <div className="display_temp">
            <img
              src={iconMap[getWeatherCondition(current.weather_code)]}
              alt=""
              className="display-icons"
            />
            <h3>{`${current.temperature_2m.toFixed(0)}°`}</h3>
          </div>
        </div>

        {/* --- Extra details --- */}
        <div className="display_relative">
          <div className="weather_feel">
            <p>Feels like</p>
            <h4>{`${current.apparent_temperature.toFixed(0)}°`}</h4>
          </div>
          <div className="weather_feel">
            <p>Humidity</p>
            <h4>{`${current.relative_humidity_2m}%`}</h4>
          </div>
          <div className="weather_feel">
            <p>Wind</p>
            <h4>
              {current.wind_speed_10m.toFixed(0)}{" "}
              {current_units.wind_speed_10m === "mp/h"
                ? "mph"
                : current_units.wind_speed_10m}
            </h4>
          </div>
          <div className="weather_feel">
            <p>Precipitation</p>
            <h4>
              {current.precipitation}{" "}
              {current_units.precipitation === "mm" ? "mm" : "in"}
            </h4>
          </div>
        </div>

        {/* --- Daily Forecast --- */}
        <div className="display_daily_forecast">
          <h5>Daily forecast</h5>
          <div className="forecast_grid">
            {daily.time.map((days, i) => {
              const forecastDate = new Date(days);
              const current_day = Day[forecastDate.getDay()];

              const code = daily.weather_code[i];
              const maxTemp = daily.temperature_2m_max[i];
              const minTemp = daily.temperature_2m_min[i];
              const rain = daily.precipitation_sum[i];
              const condition = getWeatherCondition(code, maxTemp, rain);
              const icon = iconMap[condition];

              return (
                <div className="daily_forecast" key={i}>
                  <div className="flex">
                    <p className="forecast_day">{current_day.slice(0, 3)}</p>
                    <img
                      src={icon}
                      alt={condition}
                      className="forecast-icons"
                      width={80}
                    />
                  </div>
                  <p className="forecast_condition"></p>
                  <div className="min_max_temp">
                    <p className="forecast_temp">{maxTemp.toFixed(0)}°</p>
                    <p className="forecast_temp">{minTemp.toFixed(0)}°</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- Hourly forecast box (unchanged) --- */}
      <div className="box2">
        <div className="hourly_forecast">
          <h5>Hourly forecast</h5>
          <button
            className="dropdown-trigger dropdown-trigger2"
            onClick={handleShowMenu}
          >
            <p className="hourly_day">{Day[new Date(selectedDay).getDay()]}</p>
            <img src="../images/icon-dropdown.svg" alt="dropdown-icon" />
          </button>
        </div>

        <div className={`dropdown-menu-hourly ${show ? "" : "hidden"}`}>
          {daily.time.map((day, i) => (
            <button
              className="menu-hourly-day"
              key={i}
              onClick={() => {
                setSelectedDay(day);
                setShow(false);
              }}
            >
              {new Date(day).toLocaleDateString("en-US", { weekday: "long" })}
            </button>
          ))}
        </div>

        {/* Dummy hourly items for now */}
        <div className="hourly_time">
          {hourly.time
            .map((hour, i) => ({
              hour,
              temp: hourly.temperature_2m[i],
              code: hourly.weather_code[i],
              prep: hourly.precipitation[i],
            }))
            .filter((h) => h.hour.startsWith(selectedDay))
            .map((h, i) => {
              const hourDate = new Date(h.hour);
              const hours = hourDate.getHours();
              const condition = getWeatherCondition(h.code, h.temp, h.prep);
              const icon = iconMap[condition];
              const formattedHours =
                hours > 12
                  ? `${hours - 12} PM`
                  : `${hours === 0 ? 12 : hours} AM`;
              return (
                <div className="hourly_time_flex" key={i}>
                  <div className="hourly_flex">
                    <img src={icon} alt={condition} width={50} />
                    <p>{formattedHours}</p>
                  </div>
                  <p>{h.temp.toFixed(0)}°</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
