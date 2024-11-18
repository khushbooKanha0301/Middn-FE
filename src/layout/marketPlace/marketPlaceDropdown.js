import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import Select from "react-select";
import { KingIcon, RightIcon, ShieldIcon } from "../../component/SVGIcon";

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
  {
    value: 2,
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
    text: "BNB",
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

const MarketPlaceDropdown = () => {
  const [selectedOptionAny, setSelectedOptionAny] = useState(data[0]);
  const [selectedYouReceive, setSelectedYouReceive] = useState(data[0]);
  const handleChangeAny = (selectedOption) => {
    setSelectedOptionAny(selectedOption);
  };

  const handleChangeYouReceive = (selectedOption) => {
    setSelectedYouReceive(selectedOption);
  };
  return (
    <div className="market-place-dropdown">
      <Row className="flex-nowrap justify-between">
        <Col sm={6} style={{ paddingRight: "30px" }}>
          <div className="d-flex varification gap-2">
            <div className="circle" />
            <div>
              <p className="d-flex items-center gap-2">
                <span>User 1-22</span>
                <RightIcon width="13.37px" height="13.37px" />
                <KingIcon width="20" height="20" />
                <div className="border-requires" />
                <ShieldIcon width="16" height="16" />
                <span
                  style={{
                    color: "#808191",
                    fontWeight: "600",
                    fontFamily: "Inter",
                  }}
                >
                  Requires Verification
                </span>
              </p>
              <p className="d-flex items-center gap-3">
                <span>1024 orders</span>
                <div className="border-requires" />
                <span style={{ textTransform: "uppercase" }}>
                  100.00% completion
                </span>
              </p>
            </div>
          </div>
          <div className="d-flex gap-2 timing">
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>
                12 Minutes
              </span>
              <p
                style={{
                  color: "#808191",
                  fontWeight: "600",
                  fontSize: "13px",
                  fontFamily: "Inter",
                }}
              >
                Payment Time Limit
              </p>
            </div>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>
                6.21 Minutes
              </span>
              <p
                style={{
                  color: "#808191",
                  fontWeight: "600",
                  fontSize: "13px",
                  fontFamily: "Inter",
                }}
              >
                Avg. Release Time
              </p>
            </div>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600" }}>
                8,912.14 USDT
              </span>
              <p
                style={{
                  color: "#808191",
                  fontWeight: "600",
                  fontSize: "13px",
                  fontFamily: "Inter",
                }}
              >
                Available
              </p>
            </div>
          </div>
          <div>
            <h5
              style={{
                borderBottom: "1px solid #404042",
                lineHeight: "20px",
                padding: "16px 0px",
                marginBottom: "24px",
                fontFamily: "eudoxus sans",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Bank Transfer
            </h5>
            <div>
              <h5
                style={{
                  fontFamily: "eudoxus sans",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                Advertisers' Terms (Please read carefully)
              </h5>
              <p
                style={{
                  color: "#808191",
                  fontSize: "13px",
                  fontFamily: "Inter",
                  fontWeight: "600",
                  marginBottom: " 0px",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              </p>
            </div>
          </div>
        </Col>
        <Col sm={5} className="">
          <div className="price-dropdown">
            <p
              style={{
                color: "#808191",
                fontWeight: "600",
                fontSize: "13px",
                fontFamily: "Inter",
              }}
            >
              Price{" "}
              <span style={{ color: "#fff", fontFamily: "eudoxus sans" }}>
                16,234
              </span>
            </p>
            <div className="price-dropdown-wrapper">
              <span>You Pay</span>
              <div
                className="marketplace-select-option"
                style={{ margin: "0px" }}
              >
                <div lg="marketplace-dropdown">
                  <Form.Group
                    className="form-group within-focus marketplace-dropdown-wrapper"
                    style={{ margin: "0px", padding: "0px" }}
                  >
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        name="price"
                        placeholder="2000"
                        options={data}
                        onChange={handleChangeAny}
                      />
                      <div
                        className="selected-dropdown"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
                        </svg>
                        <span
                          style={{
                            marginLeft: "4px",
                            fontSize: "16px",
                            fontWeight: "unset",
                          }}
                        >
                          EUR
                        </span>
                      </div>
                      {/* <Select
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
                      /> */}
                    </div>
                  </Form.Group>
                </div>
              </div>
            </div>
            <div className="price-dropdown-wrapper">
              <span>You Receive</span>
              <div
                className="marketplace-select-option"
                style={{ margin: "0px" }}
              >
                <div lg="marketplace-dropdown">
                  <Form.Group
                    className="form-group within-focus marketplace-dropdown-wrapper"
                    style={{ margin: "0px", padding: "0px" }}
                  >
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        name="Binance"
                        placeholder="Binance"
                      />
                      <div
                        className="selected-dropdown"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
                        </svg>
                        <span
                          style={{
                            marginLeft: "4px",
                            fontSize: "16px",
                            fontWeight: "unset",
                          }}
                        >
                          BNB
                        </span>
                      </div>
                      {/* <Select
                        defaultValue={selectedYouReceive}
                        value={selectedYouReceive}
                        className="select-dropdown"
                        isSearchable={false}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                        classNamePrefix="select-dropdown"
                        options={data1}
                        onChange={handleChangeYouReceive}
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
                      /> */}
                    </div>
                  </Form.Group>
                </div>
              </div>
            </div>
            <div
              className="form-action-group gap-2 d-flex"
              style={{ paddingTop: "8px" }}
            >
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Continue</Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MarketPlaceDropdown;
