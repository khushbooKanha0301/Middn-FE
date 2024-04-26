import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import Select from "react-select";
import { KingIcon, RightIcon } from "../../component/SVGIcon";
import MarketPlaceDropdown from "./marketPlaceDropdown";
import { useNavigate } from "react-router-dom";

const data = [
  {
    value: 1,
    text: "EUR",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
      </svg>
    ),
  },
];
const data1 = [
  {
    value: 1,
    text: "All Payment",
  },
];
const data2 = [
  {
    value: 1,
    text: "All Regions",
  },
];
const MarketPlace = () => {
  const navigate = useNavigate();
  const [selectedOptionAny, setSelectedOptionAny] = useState(data[0]);
  const [selectedOptionBTC, setSelectedOptionBTC] = useState(data[1]);
  const [selectedOptionAnywhere, setSelectedOptionAnywhere] = useState(data[2]);
  const [isBuyActive, setIsBuyActive] = useState(true);
  const [isSellActive, setIsSellActive] = useState(false);

  const handleBuyClick = () => {
    setIsBuyActive(true);
    setIsSellActive(false);
    navigate(`/marketplace`);
  };

  const handleSellClick = () => {
    setIsBuyActive(false);
    setIsSellActive(true);
    // navigate(`/marketplace-buy`);
  };

  const onBuySellClick = async () => {
    navigate(`/marketplace-buy`);
  };

  const handleChangeAny = (e) => {
    setSelectedOptionAny(e);
  };
  const handleChangeBTC = (e) => {
    setSelectedOptionBTC(e);
  };
  const handleChangeAnywhere = (e) => {
    setSelectedOptionAnywhere(e);
  };
  return (
    <div class="marketplace-view">
      <div className="marketplace-title">
        <h4>Marketplace</h4>
        <div className="order-icon">
          <svg
            width="17"
            height="20"
            viewBox="0 0 17 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.7806 5.71938L11.5306 0.469375C11.4609 0.399749 11.3782 0.344539 11.2871 0.306898C11.1961 0.269257 11.0985 0.249923 11 0.25H2C1.60218 0.25 1.22064 0.408035 0.93934 0.68934C0.658035 0.970645 0.5 1.35218 0.5 1.75V18.25C0.5 18.6478 0.658035 19.0294 0.93934 19.3107C1.22064 19.592 1.60218 19.75 2 19.75H15.5C15.8978 19.75 16.2794 19.592 16.5607 19.3107C16.842 19.0294 17 18.6478 17 18.25V6.25C17.0001 6.15148 16.9807 6.05391 16.9431 5.96286C16.9055 5.87182 16.8503 5.78908 16.7806 5.71938ZM11.75 2.81031L14.4397 5.5H11.75V2.81031ZM15.5 18.25H2V1.75H10.25V6.25C10.25 6.44891 10.329 6.63968 10.4697 6.78033C10.6103 6.92098 10.8011 7 11 7H15.5V18.25ZM12.5 10.75C12.5 10.9489 12.421 11.1397 12.2803 11.2803C12.1397 11.421 11.9489 11.5 11.75 11.5H5.75C5.55109 11.5 5.36032 11.421 5.21967 11.2803C5.07902 11.1397 5 10.9489 5 10.75C5 10.5511 5.07902 10.3603 5.21967 10.2197C5.36032 10.079 5.55109 10 5.75 10H11.75C11.9489 10 12.1397 10.079 12.2803 10.2197C12.421 10.3603 12.5 10.5511 12.5 10.75ZM12.5 13.75C12.5 13.9489 12.421 14.1397 12.2803 14.2803C12.1397 14.421 11.9489 14.5 11.75 14.5H5.75C5.55109 14.5 5.36032 14.421 5.21967 14.2803C5.07902 14.1397 5 13.9489 5 13.75C5 13.5511 5.07902 13.3603 5.21967 13.2197C5.36032 13.079 5.55109 13 5.75 13H11.75C11.9489 13 12.1397 13.079 12.2803 13.2197C12.421 13.3603 12.5 13.5511 12.5 13.75Z"
              fill="white"
            />
          </svg>
          <span className="title">Order</span>
          <span className="badge">1</span>
        </div>
      </div>
      <ul className="filter-btn nav" style={{ margin: "48px 0px" }}>
        <li className="nav-item">
          <a
            className={isBuyActive ? "active nav-link" : "nav-link"}
            onClick={handleBuyClick}
          >
            Buy
          </a>
        </li>
        <li className="nav-item">
          <a
            className={isSellActive ? "active nav-link" : "nav-link"}
            onClick={handleSellClick}
          >
            Sell
          </a>
        </li>
      </ul>

      <Row className="justify-content-between align-items-center marketplace-select-option">
        <Col lg="auto default-active-keys marketplace-dropdown">
          <Form.Group className="form-group within-focus marketplace-dropdown-wrapper">
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                name="price"
                placeholder="Enter Amount"
                options={data}
                onChange={handleChangeAny}
              />
              <Select
                defaultValue={selectedOptionAny}
                value={selectedOptionAny}
                className="select-dropdown"
                isSearchable={false}
                components={{
                  IndicatorSeparator: () => null,
                }}
                classNamePrefix="select-dropdown"
                options={data}
                onChange={handleChangeAny}
                getOptionLabel={(e) => (
                  <div
                    style={{
                      display: "flex",
                      width: "249px",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="selected-dropdown">
                      {e.icon}
                      <span>{e.text}</span>
                    </div>
                  </div>
                )}
              />
            </div>
          </Form.Group>
          <Select
            defaultValue={selectedOptionBTC}
            isSearchable={false}
            placeholder="All Payment"
            value={selectedOptionBTC}
            className="select-dropdown"
            components={{
              IndicatorSeparator: () => null,
            }}
            classNamePrefix="select-dropdown"
            options={data1}
            onChange={handleChangeBTC}
            getOptionLabel={(e) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="selected-dropdown">
                  <span>{e.text}</span>
                </div>
              </div>
            )}
          />
          <Select
            defaultValue={selectedOptionAnywhere}
            value={selectedOptionAnywhere}
            placeholder="All Regions"
            isSearchable={false}
            className="select-dropdown"
            components={{
              IndicatorSeparator: () => null,
            }}
            classNamePrefix="select-dropdown"
            options={data2}
            onChange={handleChangeAnywhere}
            getOptionLabel={(e) => (
              <div className="selected-dropdown">
                <span>All Regions</span>
              </div>
            )}
          />
        </Col>
        <Col lg="auto default-active-keys ">
          <Select
            defaultValue={selectedOptionAny}
            value={selectedOptionAny}
            className="select-dropdown"
            isSearchable={false}
            components={{
              IndicatorSeparator: () => null,
            }}
            classNamePrefix="select-dropdown"
            options={data}
            onChange={handleChangeAny}
            getOptionLabel={(e) => (
              <div className="selected-dropdown">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2.9998V5.9998C14 6.13241 13.9473 6.25959 13.8536 6.35335C13.7598 6.44712 13.6326 6.4998 13.5 6.4998H10.5C10.3674 6.4998 10.2402 6.44712 10.1464 6.35335C10.0527 6.25959 10 6.13241 10 5.9998C10 5.86719 10.0527 5.74002 10.1464 5.64625C10.2402 5.55248 10.3674 5.4998 10.5 5.4998H12.2931L11.3787 4.58543C10.4495 3.65193 9.1878 3.12527 7.87063 3.12105H7.8425C6.53636 3.11799 5.28151 3.62922 4.34937 4.54418C4.25389 4.63331 4.12731 4.68155 3.99672 4.67855C3.86612 4.67555 3.74189 4.62157 3.65059 4.52815C3.55929 4.43472 3.50817 4.30928 3.50818 4.17865C3.50819 4.04803 3.55932 3.92259 3.65062 3.82918C4.78033 2.72505 6.29988 2.11098 7.87952 2.12022C9.45916 2.12946 10.9714 2.76128 12.0881 3.87855L13 4.79293V2.9998C13 2.86719 13.0527 2.74002 13.1464 2.64625C13.2402 2.55248 13.3674 2.4998 13.5 2.4998C13.6326 2.4998 13.7598 2.55248 13.8536 2.64625C13.9473 2.74002 14 2.86719 14 2.9998ZM11.6506 11.4554C10.7093 12.3749 9.44337 12.8863 8.12747 12.8786C6.81156 12.8709 5.55175 12.3447 4.62125 11.4142L3.70688 10.4998H5.5C5.63261 10.4998 5.75979 10.4471 5.85355 10.3534C5.94732 10.2596 6 10.1324 6 9.9998C6 9.86719 5.94732 9.74002 5.85355 9.64625C5.75979 9.55248 5.63261 9.4998 5.5 9.4998H2.5C2.36739 9.4998 2.24021 9.55248 2.14645 9.64625C2.05268 9.74002 2 9.86719 2 9.9998V12.9998C2 13.1324 2.05268 13.2596 2.14645 13.3534C2.24021 13.4471 2.36739 13.4998 2.5 13.4998C2.63261 13.4998 2.75979 13.4471 2.85355 13.3534C2.94732 13.2596 3 13.1324 3 12.9998V11.2067L3.91438 12.1211C5.02951 13.2418 6.544 13.8739 8.125 13.8786H8.15812C9.72568 13.8826 11.2317 13.2689 12.35 12.1704C12.4413 12.077 12.4924 11.9516 12.4924 11.8209C12.4925 11.6903 12.4413 11.5649 12.35 11.4715C12.2587 11.378 12.1345 11.324 12.0039 11.3211C11.8733 11.3181 11.7467 11.3663 11.6512 11.4554H11.6506Z"
                    fill="white"
                  />
                </svg>
                <span>Manual</span>
              </div>
            )}
          />
        </Col>
      </Row>
      <div className="table-responsive marketplaceList">
        <MarketPlaceDropdown />
        <div style={{ overflow: "auto" }}>
          <div className="flex-table">
            <div className="flex-table-body justify-content-between">
              <div style={{ width: "219px" }}>
                <div className="marketplace-price">
                  <div className="circle" />
                  <div>
                    <h5 className="d-flex">
                      User 1-22
                      <RightIcon width="13.37px" height="13.37px" />
                      <KingIcon width="20" height="20" />
                    </h5>
                    <p>1024 orders</p>
                    <p>100.00% completion</p>
                  </div>
                </div>
              </div>
              <div style={{ width: "199px", textAlign: "center" }}>
                <span>0.923 USD</span>
              </div>
              <div
                className="marketplace-amount"
                style={{ width: "199px", textAlign: "center" }}
              >
                <p>600.00 USDT</p>
                <p>$454.000-$465.000</p>
              </div>
              <div
                className="marketplace-payment"
                style={{ width: "199px", textAlign: "center" }}
              >
                <span> Bank Transfer </span>
              </div>
              <div style={{ width: "158px", textAlign: "center" }}>
                <Button
                  variant="primary"
                  onClick={() => {
                    onBuySellClick();
                  }}
                  style={{ width: "98px" }}
                >
                  Buy
                </Button>
              </div>
            </div>
            <div className="flex-table-body justify-content-between">
              <div style={{ width: "219px" }}>
                <div className="marketplace-price">
                  <div className="circle" />
                  <div>
                    <h5 className="d-flex">
                      User 1-22
                      <RightIcon width="13.37px" height="13.37px" />
                      <KingIcon width="20" height="20" />
                    </h5>
                    <p>1024 orders</p>
                    <p>100.00% completion</p>
                  </div>
                </div>
              </div>
              <div style={{ width: "199px", textAlign: "center" }}>
                <span>0.923 USD</span>
              </div>
              <div
                className="marketplace-amount"
                style={{ width: "199px", textAlign: "center" }}
              >
                <p>600.00 USDT</p>
                <p>$454.000-$465.000</p>
              </div>
              <div
                className="marketplace-payment"
                style={{ width: "199px", textAlign: "center" }}
              >
                <span> Bank Transfer </span>
              </div>
              <div style={{ width: "158px", textAlign: "center" }}>
                <Button
                  variant="primary"
                  onClick={() => {
                    onBuySellClick();
                  }}
                  style={{ width: "98px" }}
                >
                  Buy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
