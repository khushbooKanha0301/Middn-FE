import React, { useEffect, useState } from "react";
import { Form, Dropdown, FormControl } from "react-bootstrap";
import Search from "../content/images/search.svg";
import listData from "../component/countryData";

const SearchDropdown = (props) => {
  const {
    setImageUrl,
    setSelectedOption,
    selectedOption,
    setCountryCallingCode,
    countryCallingCode,
    setSearchText,
    searchText,
    setImageSearchUrl,
    imageSearchUrlSet,
  } = props;

  const [isMobile, setIsMobile] = useState(false);
  const [searchTextOrigin, setSearchTextOrigin] = useState(null);
  const [openDr, setOpenDr] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(listData);

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearchChange = (event) => {
    if (searchTextOrigin === null) {
      setSearchText(event.target.value);
    } else {
      setSearchTextOrigin(null);
    }

    const searchValue = event.target.value.toLowerCase();
    const filteredData = listData.filter(
      (data) =>
        data.country.toLowerCase().includes(searchValue) ||
        data.code.toLowerCase().includes(searchValue)
    );
    setFilteredOptions(filteredData);
    if (searchValue === "") {
      setSearchText(null);
      setImageSearchUrl(null);
    }
  };

  const handleCheckboxChange = (option) => {
    setFilteredOptions(listData);
    setSelectedOption(option);
    setCountryCallingCode(option.code);
    const imageUrl = phoneCountryData(option.code);
    setImageUrl(imageUrl);
    setImageSearchUrl(imageUrl);
    setSearchText(`${option.country} (${option.code})`);
    setSearchTextOrigin(option);
    setOpenDr(false);
  };

  const phoneCountryData = (code) => {
    const result = listData.find((item) => item?.code === code);
    return `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`;
  };

  return (
    <div
      className={`search-dropdown custom-dropdown justify-between relative`}
    >
      <Dropdown
        className="custom-dropdown-xl"
        show={openDr}
        onToggle={(isOpen) => setOpenDr(isOpen)}
      >
        <Dropdown.Toggle>
          {listData.find((item) => item?.code === countryCallingCode)?.cca3}
          <div className="dropdown-menu-inner">
            {searchText && imageSearchUrlSet ? (
              <img
                src={imageSearchUrlSet}
                alt="Flag"
                className="rectangle-data"
              />
            ) : null}
            <FormControl
              type="text"
              placeholder="Search Coin"
              className="mr-3 mb-2"
              value={searchText}
              onChange={handleSearchChange}
            />
            <img src={Search} alt="" className="search-icon" />
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdownMenu" show={openDr}>
          <div className="filter-option">
            {filteredOptions.map((data, key) => (
              <div
                key={`${data.code}_${data.country}`}
                className={`yourself-option form-check`}
                onClick={() => handleCheckboxChange(data)}
              >
                <label className="form-check-label">
                  <img
                    src={phoneCountryData(data.code)}
                    alt="Flag"
                    className="rectangle-data"
                  />
                  {data.country} ({data.code})
                </label>
                <div
                  className={`form-check-input check-input ${
                    JSON.stringify(selectedOption) === JSON.stringify(data)
                      ? "selected"
                      : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
export default SearchDropdown;
