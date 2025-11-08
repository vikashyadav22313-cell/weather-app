import "../src/App.css";

export function SearchBox({
  searchInput,
  setSearchInput,
  getWeather,
  suggestions,
  loading,
  show,
  setShow,
  handleSelect,
}) {
  const handleChange = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      setShow(false);
    }
  };
  const handleIsEmpty = (e) => {
    if (e.target.value !== "") {
      setShow(true);
    }
  };
  return (
    <div className="searchbox">
      <h1>{"How's the sky looking today?"}</h1>

      <div className="search_grid">
        <div className="searchbox_input">
          <img src="../images/icon-search.svg" alt="search-icon" />
          <label htmlFor="search"></label>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search for a Place..."
            autoComplete="off"
            value={searchInput}
            onChange={handleChange}
            onClick={handleIsEmpty}
          />
        </div>
        <button type="submit" className="search_btn" onClick={getWeather}>
          Search
        </button>
      </div>

      {show && (
        <div className="autoFill">
          {loading && (
            <p className="spinner_box">
              <img
                src="../images/icon-loading.svg"
                alt="loading-icon"
                className="spinner"
              />{" "}
              Search in progress
            </p>
          )}
          {!loading && searchInput && suggestions.length > 0 && (
            <ul className="autofill_flex">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.latitude + suggestion.longitude}
                  onClick={() => {
                    handleSelect(suggestion);
                  }}
                  className="autofill_list"
                >
                  <button className="autofill_btn">
                    <p className="city_name">
                      {suggestion.name}, {suggestion.country}
                    </p>
                    {suggestion.admin1 && (
                      <p>
                        {suggestion.admin2 ? `${suggestion.admin2}, ` : ""}
                        {suggestion.admin1}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
