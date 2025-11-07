import { useEffect, useState } from "react";
import "../src/App.css";

export function Units({ isMetric, setIsMetric }) {
  const [unit_hide, setUnit_hide] = useState(false);

  const handleUnits = () => {
    setUnit_hide(!unit_hide);
  };

  const handleSwitch = () => {
    setIsMetric(!isMetric);
  };

  return (
    <header>
      <img
        src="../images/logo.svg"
        alt="weather-logo"
        className="weather_logo"
      />
      <div className="dropdown">
        <button className="dropdown-trigger" onClick={handleUnits}>
          <div>
            <img src="../images/icon-units.svg" alt="units-icon" />
            Units
            <img src="../images/icon-dropdown.svg" alt="dropdown-icon" />
          </div>
        </button>

        <div className={`dropdown-menu ${unit_hide ? "" : "hidden"}`}>
          {/* Switch button */}
          <button className="unit_changer" onClick={handleSwitch}>
            {`Switch to ${isMetric ? "imperial" : "metric"}`}
          </button>

          {/* Temperature */}
          <p>Temperature</p>
          <div className={`option ${isMetric ? "active" : ""}`}>
            Celsius (°C)
            {isMetric && <img src="../images/icon-checkmark.svg" alt="" />}
          </div>
          <div className={`option ${!isMetric ? "active" : ""}`}>
            Fahrenheit (°F)
            {!isMetric && <img src="../images/icon-checkmark.svg" alt="" />}
          </div>
          <hr />

          {/* Wind Speed */}
          <p>Wind Speed</p>
          <div className={`option ${isMetric ? "active" : ""}`}>
            km/h {isMetric && <img src="../images/icon-checkmark.svg" alt="" />}
          </div>
          <div className={`option ${!isMetric ? "active" : ""}`}>
            mph
            {!isMetric && <img src="../images/icon-checkmark.svg" alt="" />}
          </div>
          <hr />

          {/* Precipitation */}
          <p>Precipitation</p>
          <div className={`option ${isMetric ? "active" : ""}`}>
            Millimeter(mm){" "}
            {isMetric && <img src="../images/icon-checkmark.svg" alt="" />}
          </div>
          <div className={`option ${!isMetric ? "active" : ""}`}>
            Inches(in){" "}
            {!isMetric && <img src="../images/icon-checkmark.svg" alt="" />}
          </div>
        </div>
      </div>
    </header>
  );
}
