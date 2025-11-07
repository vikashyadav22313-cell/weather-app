import { use, useEffect, useState } from "react";
import { DataShow } from "../component/DataShow";
import { SearchBox } from "../component/SearchBox";
import { Units } from "../component/Units";
import "./App.css";
import axios from "axios";
import { getWeatherData } from "../Api/Server";
import { Loader } from "../component/Loader";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isMetric, setIsMetric] = useState(true);
  const [currentCity, setCurrentCity] = useState(null);
  const [error, setError] = useState(null);
  const handleSelect = (suggestion) => {
    setSearchInput(`${suggestion.name}, ${suggestion.country}`);
    setCurrentCity({
      name: suggestion.name,
      country: suggestion.country,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
    setShow(false);
  };

  const getWeather = async () => {
    if (!searchInput.trim()) {
      return;
    }

    try {
      setShow(true);
      setLoading(true);
      const { data } = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput}`
      );

      if (!data.results || data.results.length === 0) {
        setError("No search results found!");
        setSearchInput("");
        setSuggestions([]);
        setShow(false);
        return;
      }
      setError(null);
      const currentUnit = isMetric
        ? { wind_speed: "kmh", perp: "mm", unit_temp: "celsius" }
        : { wind_speed: "mph", perp: "inch", unit_temp: "fahrenheit" };

      const city = data.results[0];
      setCurrentCity(city); // save city info
      if (!city.latitude || !city.longitude) {
        alert("City data is incomplete. Please try another city.");
        return;
      }

      const DisplayData = await getWeatherData(
        city.latitude,
        city.longitude,
        city.name,
        city.country,
        currentUnit
      );

      setSelectedSuggestion(DisplayData);
      setSuggestions(data.results);
      setShow(false); // hide autofill after fetch
    } catch (error) {
      console.error("Error fetching city data:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = async () => {
    if (!currentCity) return;

    const currentUnit = isMetric
      ? { wind_speed: "kmh", perp: "mm", unit_temp: "celsius" }
      : { wind_speed: "mph", perp: "inch", unit_temp: "fahrenheit" };

    const DisplayData = await getWeatherData(
      currentCity.latitude,
      currentCity.longitude,
      currentCity.name,
      currentCity.country,
      currentUnit
    );

    setSelectedSuggestion(DisplayData);
  };

  useEffect(() => {
    refreshWeather();
    setShow(false);
  }, [isMetric]);

  return (
    <div className="wrapper">
      <div className="main-container">
        <Units
          isMetric={isMetric}
          setIsMetric={setIsMetric}
          setShow={setShow}
        />
        <main>
          <SearchBox
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            getWeather={getWeather}
            suggestions={suggestions}
            loading={loading}
            show={show}
            setShow={setShow}
            handleSelect={handleSelect}
          />
          {error ? (
            <p className="search_error">{error}</p>
          ) : loading ? (
            <Loader />
          ) : (
            <DataShow
              selectedSuggestion={selectedSuggestion}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
