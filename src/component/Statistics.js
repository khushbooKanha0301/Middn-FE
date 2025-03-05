import React, { useState, useEffect } from "react";
import { Card, Col, Row, Dropdown, ProgressBar } from "react-bootstrap";
import StatisticsChart from "./StatisticsChart";
import ThisMonth from "./ThisMonth";
import Sheet from "react-modal-sheet";

//This component is used for Statistics transaction graph which is applied on dashboard
export const Statistics = () => {
  
  const categories = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(2022, index); // Adjust year as needed
    return {
      label: date.toLocaleString("default", { month: "long", year: "numeric" }),
      value: date.getMonth() + 1, // Use month number as the unique value
    };
  });

  const [selectedOption, setSelectedOption] = useState(categories[0]);
  const [showOptions, setShowOptions] = useState();
  const [openDr, setOpenDr] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
    setOpenDr(false);
  };

  const handleCheckboxChangeOnMobile = (option) => {
    setSelectedOption(option);
  };

  const handlePhoneNumberMobile = (option) => {
    setSelectedOption(option);
    setOpenDr(false);
  };

  const handleDropdownClick = () => {
    setShowOptions(categories);
    setOpenDr(true);
  };

  return (
    <Card className="cards-dark statistics statisticsGraphs">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title as="h3" className="font-family-poppins">
            Statistics
          </Card.Title>
          <div className="statisticBox d-flex items-center custom-dropdown token-sales-filter  justify-between relative">
            {!isMobile ? (
              <>
                <div
                  className="form-control"
                  onClick={handleDropdownClick}
                >
                  {selectedOption.label}
                </div>

                <Dropdown
                  className="custom-dropdown-xl"
                  show={openDr}
                  onToggle={(isOpen) => setOpenDr(isOpen)}
                >
                  <Dropdown.Toggle onClick={handleDropdownClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                    </svg>
                  </Dropdown.Toggle>
                  {openDr && (
                    <Dropdown.Menu className="dropdownMenu">
                      <div className="filter-option">
                        {showOptions.map((data, key) => (
                          <div
                            key={data.value}
                            className={`yourself-option form-check`}
                            onClick={() => handleCheckboxChange(data)}
                          >
                            <div
                              className={`form-check-input check-input ${
                                JSON.stringify(selectedOption) ===
                                JSON.stringify(data)
                                  ? "selected"
                                  : ""
                              }`}
                            />
                            <label className="form-check-label">
                              {data.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </>
            ) : (
              <>
                <div
                  className="form-control"
                  onClick={handleDropdownClick}
                >
                  {selectedOption.label}
                </div>
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
                    setShowOptions([]);
                  }}
                >
                  <Sheet.Container className="statisticBox custom-dropdown">
                    <Sheet.Header />
                    <Sheet.Content>
                      {openDr && (
                        <div className="drawer-swipe-wrapper">
                          <div
                            className="drawer-swiper"
                            onClick={handleDropdownClick}
                          />
                          <div className="filter-option">
                            {showOptions.map((data, key) => (
                              <div
                                key={data.value}
                                className={`yourself-option form-check`}
                                onClick={() =>
                                  handleCheckboxChangeOnMobile(data)
                                }
                              >
                                <div
                                  className={`form-check-input check-input 
                              ${
                                JSON.stringify(selectedOption) ===
                                JSON.stringify(data)
                                  ? "selected"
                                  : ""
                              }`}
                                />
                                <label className="form-check-label">
                                  {data.label}
                                </label>
                              </div>
                            ))}
                          </div>
                          <div className="edit-btn flex justify-center">
                            <button
                              type="button"
                              className="btn btn-primary mx-1"
                              onClick={
                                selectedOption
                                  ? () =>
                                      handlePhoneNumberMobile(selectedOption)
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
          </div>
        </div>
        <div className="transaction-view">
          <div className="transaction">
            <div className="transaction-wrapper">
              <div className="transaction-number">0</div>
              <div className="transaction-label font-family-inter">
                Total Transaction
              </div>
            </div>
            <div className="divider"></div>
            <div className="transaction-wrapper-month">
              <ThisMonth />
            </div>
          </div>
          <div className="transaction-chart">
            <StatisticsChart />
          </div>
        </div>
        <div className="charts-details">
          <Row className="g-0">
            <Col>
              <div className="chart-item">
                <div className="item-label">
                  <img
                    src={require("../content/images/bitcoin.png")}
                    alt="Bitcoin"
                  />{" "}
                  Bitcoin
                </div>
                <div className="item-count">0</div>
                <ProgressBar className="bitcoin" now={5} />
              </div>
            </Col>
            <Col>
              <div className="chart-item">
                <div className="item-label">
                  <img
                    src={require("../content/images/ether.png")}
                    alt="ether"
                  />{" "}
                  ETHER
                </div>
                <div className="item-count">0</div>
                <ProgressBar className="ether" now={5} />
              </div>
            </Col>
            <Col>
              <div className="chart-item">
                <div className="item-label">
                  <img src={require("../content/images/bnb.png")} alt="BNB" />{" "}
                  BNB
                </div>
                <div className="item-count">0</div>
                <ProgressBar className="bnb" now={5} />
              </div>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Statistics;
