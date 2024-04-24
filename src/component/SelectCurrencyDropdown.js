import React, { useEffect, useState } from "react";
import { Form, Dropdown, FormControl } from "react-bootstrap";
import Search from "../content/images/search.svg";
import { countryInfo } from "../component/countryData";

const SelectCurrencyDropdown = (props) => {
  const {
    setImageCurrencyUrl,
    setCurrentPre,
    currentPre,
    setCurrency,
    currency,
    setCurrencyPre,
    currencyPre,
    setImageCurrencySearchUrl,
    imageCurrencySearchUrlSet,
  } = props;

  const [isMobile, setIsMobile] = useState(false);
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(countryInfo);
  const [openDr, setOpenDr] = useState(true);

  const [searchCurrencyTextOrigin, setSearchCurrencyTextOrigin] =
    useState(null);

  const currencyCountryData = (code) => {
    const result = countryInfo.find((item) => item.currency.code === code);
    return result?.flag;
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearchCurrencyChange = (event) => {
    if (searchCurrencyTextOrigin === null) {
      setCurrencyPre(event.target.value);
    } else {
      setSearchCurrencyTextOrigin(null);
    }

    const searchValue = event.target.value.toLowerCase();
    const filteredData = countryInfo.filter((data) =>
      data.currency.code.toLowerCase().includes(searchValue)
    );
    setShowCurrencyOptions(filteredData);

    if (searchValue === "") {
      setCurrencyPre(null);
      setImageCurrencySearchUrl(null);
    }
  };

  const handleCheckboxCurrencyChange = (option) => {
    setCurrentPre(option);
    const imageUrl = currencyCountryData(option);
    setImageCurrencyUrl(imageUrl);
    setCurrencyPre(option);
    setCurrency(option)
    setImageCurrencySearchUrl(imageUrl);
  };

  const handleCheckboxCurrencyChangeOnMobile= (option) => {
 console.log("option ", option);
    setCurrentPre(option);
    setCurrencyPre(option);
    const imageUrl = currencyCountryData(option);
    //setImageCurrencyUrl(imageUrl);
    setImageCurrencySearchUrl(imageUrl);
  };


  const handlePhoneNumberCurrencyMobile = (option) => {
    setCurrentPre(option);
    setCurrency(option)
    setCurrencyPre(option);
    const imageUrl = currencyCountryData(option);
    setImageCurrencyUrl(imageUrl);
    setOpenDr(true);
  };

  const handleDrawer = () => {
    setOpenDr(!openDr);
  };

  const handleDrawerOverlay = () => {
    setOpenDr(true);
  };

  return (
    <div
      className={`d-flex items-center phone-number-dropdown justify-between relative`}
    >
      {!isMobile && (
        <>
          <Dropdown className="account-setting-dropdown">
            <Dropdown.Toggle>
              {
                countryInfo.find((item) => item.currency.code === currentPre)
                  ?.currency.code
              }
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
              </svg>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdownMenu">
              <div className="dropdown-menu-inner">
                {currentPre && imageCurrencySearchUrlSet ? (
                  <img
                    src={imageCurrencySearchUrlSet}
                    alt="Flag"
                    className="rectangle-data"
                  />
                ) : null}
                <FormControl
                  type="text"
                  placeholder="Search..."
                  className="mr-3 mb-2"
                  value={currencyPre}
                  onChange={handleSearchCurrencyChange}
                />
                <img src={Search} alt="" className="search-icon" />
              </div>
              <div className="filter-option">
                {showCurrencyOptions.map((data, key) => (
                  <div
                    className="yourself-option"
                    onChange={() =>
                      handleCheckboxCurrencyChange(data?.currency?.code)
                    }
                  >
                    <Form.Check
                      key={`${data.currency.code}`}
                      type="checkbox"
                      id={`checkbox-${data.currency.code}`}
                      label={
                        <div>
                          <img
                            src={currencyCountryData(data.currency.code)}
                            alt="Flag"
                            className="rectangle-data"
                          />
                          {data?.currency?.code}
                        </div>
                      }
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    />
                    <div
                      className={`form-check-input check-input ${
                        currentPre === data?.currency?.code ? "selected" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </>
      )}

      {isMobile && (
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
            onClick={handleDrawer}
          >
            <p className="text-white mb-0 personalDataLocation">
              {
                countryInfo.find((item) => item.currency.code === currency)
                  ?.currency.code
              }
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
            </svg>
          </button>
          <div
            className={!openDr ? "mobile-setting-dropdown-overlay" : ""}
            onClick={handleDrawerOverlay}
          ></div>
          <div
            id="drawer-swipe"
            className={`fixed  z-40 w-full overflow-y-auto bg-white  rounded-t-lg dark:bg-gray-800 transition-transform bottom-0 left-0 right-0 ${
              openDr ? "translate-y-full" : ""
            } bottom-[60px]`}
            tabindex="-1"
            aria-labelledby="drawer-swipe-label"
          >
            <div className="drawer-swipe-wrapper">
              <div className="drawer-swiper" onClick={handleDrawerOverlay} />
              <div className="dropdown-menu-inner">
                {currentPre && imageCurrencySearchUrlSet ? (
                  <img
                    src={imageCurrencySearchUrlSet}
                    alt="Flag"
                    className="rectangle-data"
                  />
                ) : null}

                <FormControl
                  type="text"
                  placeholder="Search..."
                  className="mr-3 mb-2"
                  value={currencyPre}
                  onChange={handleSearchCurrencyChange}
                />
                <img src={Search} alt="" className="search-icon" />
              </div>
              <div className="filter-option">
                {showCurrencyOptions.map((data, key) => (
                  <>
                    <div
                      className="yourself-option"
                      onChange={() =>
                        handleCheckboxCurrencyChangeOnMobile(data?.currency?.code)
                      }
                    >
                      <Form.Check
                        key={`${data.currency.code}`}
                        type="checkbox"
                        id={`checkbox-${data.currency.code}`}
                        label={
                          <div>
                            <img
                              src={currencyCountryData(data.currency.code)}
                              alt="Flag"
                              className="rectangle-data"
                            />
                            {data?.currency?.code}
                          </div>
                        }
                        style={{
                          width: " 100%",
                          display: " flex",
                          alignItems: "center",
                        }}
                      />
                      <div
                        className={`form-check-input check-input ${
                          currentPre === data?.currency?.code ? "selected" : ""
                        }`}
                      />
                    </div>
                  </>
                ))}
              </div>
              <div className="edit-btn flex justify-center">
                {currentPre ? (
                  <>
                    <button
                      type="button"
                      class="btn btn-primary mx-1"
                      onClick={() =>
                        handlePhoneNumberCurrencyMobile(currentPre)
                      }
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" class="btn btn-primary mx-1">
                      Save
                    </button>
                  </>
                )}
                <button
                  type="button"
                  class="btn mx-1 bg-gray text-white"
                  onClick={handleDrawerOverlay}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectCurrencyDropdown;
