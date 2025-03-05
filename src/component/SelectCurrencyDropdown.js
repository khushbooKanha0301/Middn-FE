import React, { useEffect, useState } from "react";
import { Dropdown, FormControl } from "react-bootstrap";
import Search from "../content/images/search.svg";
import { countryInfo } from "../component/countryData";
import Sheet from "react-modal-sheet";

//This component is used forcurrency dropdown applied on account setting page
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
  const [openDr, setOpenDr] = useState(false);
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

  const handleDropdownClick = () => {
    setShowCurrencyOptions(countryInfo);
    setOpenDr(true);
  };

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
    setShowCurrencyOptions(countryInfo);
    setCurrentPre(option);
    const imageUrl = currencyCountryData(option);
    setImageCurrencyUrl(imageUrl);
    setCurrencyPre(option);
    setCurrency(option);
    setImageCurrencySearchUrl(imageUrl);
    setOpenDr(false);
  };

  const handleCheckboxCurrencyChangeOnMobile = (option) => {
    setCurrentPre(option);
    setCurrencyPre(option);
    const imageUrl = currencyCountryData(option);
    setImageCurrencySearchUrl(imageUrl);
  };

  const handlePhoneNumberCurrencyMobile = (option) => {
    setCurrentPre(option);
    setCurrency(option);
    setCurrencyPre(option);
    const imageUrl = currencyCountryData(option);
    setImageCurrencyUrl(imageUrl);
    setOpenDr(false);
  };

  return (
    <>
      {!isMobile ? (
        <>
          <Dropdown
            className="custom-dropdown-xl"
            show={openDr}
            onToggle={(isOpen) => setOpenDr(isOpen)}
          >
            <Dropdown.Toggle onClick={handleDropdownClick}>
              {
                countryInfo.find((item) => item.currency.code === currentPre)
                  ?.currency.code
              }
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
              </svg>
            </Dropdown.Toggle>
            {openDr && (
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
                  {showCurrencyOptions?.map((data, key) => (
                    <div
                      key={`${data.currency.code}`}
                      className={`yourself-option form-check`}
                      onClick={() =>
                        handleCheckboxCurrencyChange(data?.currency?.code)
                      }
                    >
                      <label className="form-check-label">
                        <img
                          src={currencyCountryData(data.currency.code)}
                          alt="Flag"
                          className="rectangle-data"
                        />
                        {data?.currency?.code}
                      </label>
                      <div
                        className={`form-check-input check-input ${
                          currentPre === data?.currency?.code ? "selected" : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </Dropdown.Menu>
            )}
          </Dropdown>
        </>
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
            className={openDr ? "mobile-setting-dropdown-overlay" : ""}
            onClick={handleDropdownClick}
          ></div>
          <Sheet
            isOpen={openDr}
            onClose={() => {
              setOpenDr(false);
              setShowCurrencyOptions([]);
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
                      {showCurrencyOptions?.map((data, key) => (
                        <div
                          key={`${data.currency.code}`}
                          className={`yourself-option form-check`}
                          onClick={() =>
                            handleCheckboxCurrencyChangeOnMobile(
                              data?.currency?.code
                            )
                          }
                        >
                          <label className="form-check-label">
                            <img
                              src={currencyCountryData(data.currency.code)}
                              alt="Flag"
                              className="rectangle-data"
                            />
                            {data?.currency?.code}
                          </label>
                          <div
                            className={`form-check-input check-input ${
                              currentPre === data?.currency?.code
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
                          currentPre
                            ? () => handlePhoneNumberCurrencyMobile(currentPre)
                            : null
                        }
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        class="btn mx-1 bg-gray text-white"
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

export default SelectCurrencyDropdown;
