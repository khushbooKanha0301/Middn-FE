import React, { useEffect, useState } from "react";
import { Dropdown, FormControl } from "react-bootstrap";
import Search from "../content/images/search.svg";
import listData from "../component/countryData";
import Sheet from "react-modal-sheet";

const SelectOptionDropdown = (props) => {
  const {
    setImageUrl,
    setSelectedOption,
    selectedOption,
    setCountryCallingCode,
    setSearchText,
    searchText,
    setImageSearchUrl,
    imageSearchUrlSet,
  } = props;

  const [isMobile, setIsMobile] = useState(false);
  const [openDr, setOpenDr] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchTextOrigin, setSearchTextOrigin] = useState(null);

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
    const imageUrl = phoneCountryData(option.cca3);
    setImageUrl(imageUrl);
    setImageSearchUrl(imageUrl);
    setSearchText(`${option.country} (${option.code})`);
    setSearchTextOrigin(option);
    setOpenDr(false);
  };

  const handleCheckboxChangeOnMobile = (option) => {
    setSelectedOption(option);
    const imageUrl = phoneCountryData(option.cca3);
    setImageSearchUrl(imageUrl);
    setSearchText(`${option.country} (${option.code})`);
    setSearchTextOrigin(option);
  };

  const handlePhoneNumberMobile = (option) => {
    setSelectedOption(option);
    setCountryCallingCode(option.code);
    const imageUrl = phoneCountryData(option.cca3);
    setImageUrl(imageUrl);
    setOpenDr(false);
  };

  const phoneCountryData = (cca3) => {
    const result = listData.find((item) => item?.cca3 === cca3);
    return `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`;
  };

  const handleDropdownClick = () => {
    setFilteredOptions(listData);
    setOpenDr(true);
  };

  return (
    <>
      {!isMobile ? (
        <Dropdown
          className="custom-dropdown-xl"
          show={openDr}
          onToggle={(isOpen) => setOpenDr(isOpen)}
        >
          <Dropdown.Toggle onClick={handleDropdownClick}>
            {listData.find((item) => item?.iso === selectedOption?.iso)?.cca3 || "United States"}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
            </svg>
          </Dropdown.Toggle>

          {openDr && (
            <Dropdown.Menu className="dropdownMenu">
              <div className="dropdown-menu-inner">
                {searchText && imageSearchUrlSet && (
                  <img
                    src={imageSearchUrlSet}
                    alt="Flag"
                    className="rectangle-data"
                  />
                )}
                <FormControl
                  type="text"
                  placeholder="Search..."
                  className="mr-3 mb-2"
                  value={searchText}
                  onChange={handleSearchChange}
                />
                <img src={Search} alt="" className="search-icon" />
              </div>
              <div className="filter-option">
                {filteredOptions.map((data) => (
                  <div
                    key={`${data.code}_${data.country}`}
                    className={`yourself-option form-check`}
                    onClick={() => handleCheckboxChange(data)}
                  >
                    <label className="form-check-label">
                      <img
                        src={phoneCountryData(data.cca3)}
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
          )}
        </Dropdown>
      ) : (
        <>
          <button
            className="text-white font-medium rounded-lg text-sm"
            type="button"
            data-drawer-target="drawer-swipe"
            data-drawer-show="drawer-swipe"
            data-drawer-placement="bottom"
            data-drawer-edge="true"
            data-drawer-edge-offset="bottom-[60px]"
            aria-controls="drawer-swipe"
            onClick={handleDropdownClick}
          >
            <p className="text-white mb-0 personalDataLocation">
            {listData.find((item) => item?.iso === selectedOption?.iso)?.cca3 || "United States"}
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
            </svg>
          </button>
          <div
            className={openDr ? "mobile-setting-dropdown-overlay" : ""}
            onClick={handleDropdownClick}
          ></div>
          <Sheet
            isOpen={openDr}
            onClose={() => {
              setOpenDr(false);
              setFilteredOptions([]);
            }}
          >
            <Sheet.Container className="custom-dropdown">
              <Sheet.Header />
              <Sheet.Content>
                {openDr && (
                  <div className="drawer-swipe-wrapper">
                    <div
                      className="drawer-swiper"
                      onClick={handleDropdownClick}
                    />
                    <div className="dropdown-menu-inner">
                      {searchText && imageSearchUrlSet && (
                        <img
                          src={imageSearchUrlSet}
                          alt="Flag"
                          className="rectangle-data"
                        />
                      )}
                      <FormControl
                        type="text"
                        placeholder="Search..."
                        className="mr-3 mb-2"
                        value={searchText}
                        onChange={handleSearchChange}
                      />
                      <img src={Search} alt="" className="search-icon" />
                    </div>

                    <div className="filter-option">
                      {filteredOptions.map((data) => (
                        <div
                          key={`${data.code}_${data.country}`}
                          className="yourself-option form-check"
                          onClick={() => handleCheckboxChangeOnMobile(data)}
                        >
                          <label className="form-check-label">
                            <img
                              src={phoneCountryData(data.cca3)}
                              alt="Flag"
                              className="rectangle-data"
                            />
                            {data.country} ({data.code})
                          </label>
                          <div
                            className={`form-check-input check-input ${
                              JSON.stringify(selectedOption) ===
                              JSON.stringify(data)
                                ? "selected"
                                : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="edit-btn flex justify-center">
                      <button
                        type="button"
                        className="btn btn-primary mx-1"
                        onClick={
                          selectedOption
                            ? () => handlePhoneNumberMobile(selectedOption)
                            : null
                        }
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn mx-1 bg-gray text-white"
                        onClick={() => setOpenDr(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
          </Sheet>
        </>
      )}
    </>
  );
};

export default SelectOptionDropdown;
