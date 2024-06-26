import React, { useState, useEffect } from "react";
import { Card, Col,  Row, Dropdown, ProgressBar } from "react-bootstrap";
import StatisticsChart from "./StatisticsChart";
import ThisMonth from "./ThisMonth";
import Sheet from "react-modal-sheet";

//This component is used for Statistics transaction graph which is applied on dashboard
export const Statistics = () => {
  const categories = [
    { value: "1", label: "January 2022" },
    { value: "2", label: "February 2022" },
    { value: "3", label: "March 2022" },
    { value: "4", label: "April 2022" },
    { value: "5", label: "May 2022" },
    { value: "6", label: "June 2022" },
    { value: "7", label: "July 2022" },
    { value: "8", label: "August 2022" },
    { value: "9", label: "September 2022" },
    { value: "10", label: "October 2022" },
    { value: "11", label: "November 2022" },
    { value: "12", label: "December 2022" },
  ];

  const [selectedOption, setSelectedOption] = useState({
    value: "1",
    label: "January 2022",
  });

  const [showOptions, setShowOptions] = useState(categories);
  const [category, setCategory] = useState("January 2022");
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handleDrawerOverlay = () => {
    setShowDropdown(false);
  };

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
    setCategory(option.label);
    setShowDropdown(false);
  };

  const handleCheckboxChangeOnMobile = (option) => {
    setSelectedOption(option);
  };

  const handlePhoneNumberMobile = (option) => {
    setSelectedOption(option);
    setCategory(option.label);
    setShowDropdown(false);
  };

  return (
    <Card className="cards-dark statistics statisticsGraphs">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title as="h3" className="font-family-poppins">
            Statistics
          </Card.Title>
          <div className="statisticBox d-flex items-center phone-number-dropdown token-sales-filter  justify-between relative">
            {!isMobile && (
              <>
                {/* <Form.Control type="text" value={category} disabled/> */}
                <div
                  className="form-control"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {category}
                </div>
                <Dropdown
                  className="account-setting-dropdown"
                  show={showDropdown}
                  onToggle={(isOpen) => setShowDropdown(isOpen)}
                >
                  <Dropdown.Toggle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                    </svg>
                  </Dropdown.Toggle>
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
                </Dropdown>
              </>
            )}

            {isMobile && (
              <>
                <div
                  className="form-control"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {category}
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
                  onClick={() => setShowDropdown(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>
                </button>
                <div
                  className={
                    showDropdown ? "mobile-setting-dropdown-overlay" : ""
                  }
                  onClick={handleDrawerOverlay}
                ></div>
                <Sheet
                  isOpen={showDropdown}
                  onClose={() => setShowDropdown(false)} // Close the dropdown when the Sheet is closed
                >
                  <Sheet.Container className="statisticBox phone-number-dropdown">
                    <Sheet.Header />
                    <Sheet.Content>
                      <div tabindex="-1" aria-labelledby="drawer-swipe-label">
                        <div className="drawer-swipe-wrapper">
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
                            {selectedOption ? (
                              <>
                                <button
                                  type="button"
                                  class="btn btn-primary mx-1"
                                  onClick={() =>
                                    handlePhoneNumberMobile(selectedOption)
                                  }
                                >
                                  Save
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  class="btn btn-primary mx-1"
                                >
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
