import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import QueationMarkImage from "../../content/images/queation-mark.png";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";

const depositOptions = [
  {
    value: "Deposit IDR to USDT (E-Wallet)",
    fee: "2.2% Fee",
    tabIndex: 1,
  },
  {
    value: "Deposit IDR to USDT (Online Banking)",
    fee: "10000 IDR Fee",
    tabIndex: 2,
  },
  {
    value: "Tokocrypto (Bank transfer)",
    fee: "0%",
    tabIndex: 3,
  },
];
const transactionDetails = [
  { label: "Price", value: "1 USDT ≈ 16,699.9862989 IDR" },
  { label: "Fee", value: "10,000.00 IDR" },
  { label: "Pay With", value: "Online Banking" },
];
const data = [
  {
    value: 1,
    text: "IDR",
    name: "Indonesian Rupiah",
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
    text: "USDT",
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
    text: "USDT",
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

const BankDepositBuyer = () => {
  const navigate = useNavigate();
  const [selectedOptionAny, setSelectedOptionAny] = useState(data[0]);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Select Coin", "Select Network", "Deposit Address"];
  const [escrowType, setEscrowType] = useState(depositOptions[0].value);
  const handleOptionClick = (value) => {
    setEscrowType(value);
  };

  const handleChangeAny = (e) => {
    setSelectedOptionAny(e);
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div style={{ color: "#fff" }}>
            <Typography
              variant="h5"
              sx={{ color: "#fff", fontSize: "16px", marginBottom: "30px" }}
            >
              Select currency
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#fff", fontSize: "13px", marginBottom: "10px" }}
            >
              Currency
            </Typography>
            <div className="currency-step-select w-100 mb-3">
              <div
                style={{ position: "relative" }}
                className="deposit-dropdown deposit-deposit-wrapper"
              >
                <Select
                  value={selectedOptionAny} // Use only the value prop, defaultValue is not necessary here
                  className="select-dropdown w-100 mt-0 mb-3 d-block"
                  isSearchable={false}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  classNamePrefix="select-dropdown"
                  options={data1}
                  onChange={handleChangeAny}
                  getOptionLabel={(option) => (
                    <>
                      <div className="selected-dropdown d-flex align-items-center">
                        {option.icon}
                        <span className="text-white fs-13 ml-2">
                          {option.text}
                        </span>
                      </div>
                    </>
                  )}
                  getOptionValue={(option) => option.value}
                  formatOptionLabel={(option) => (
                    <div className="selected-dropdown d-flex align-items-center">
                      {option.icon}
                      <span className="text-white fs-13">{option.text}</span>
                      <span className="text-muted ms-2 fs-13 fw-600">
                        {option.currency}
                      </span>
                      <span className="text-muted">{option.name}</span>
                    </div>
                  )}
                />
              </div>
            </div>
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontSize: "16px",
                marginBottom: "30px",
              }}
            >
              Recommended
            </Typography>
            <div>
              {depositOptions.map((option, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                    }}
                  >
                    <Box className="market-place-buy-sell">
                      <div
                        className="yourself-option form-check"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => handleOptionClick(option.value)}
                      >
                        <div
                          className={`form-check-input check-input  ${
                            escrowType === option.value ? "selected" : ""
                          }`}
                          style={{ top: "3px" }}
                        />
                        {option.value}
                      </div>
                    </Box>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: "#808191",
                      marginTop: "12px",
                      marginBottom: "20px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {option.fee}
                  </Typography>
                </Box>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div style={{ color: "#fff" }}>
            <Typography
              variant="h3"
              sx={{ fontSize: "16px", marginBottom: "30px" }}
            >
              Select currency{" "}
            </Typography>
            <Form.Group className="form-group">
              <Form.Label
                className="form-control"
                style={{
                  lineHeight: "16px",
                  fontSize: "12px",
                  color: "#FFFFFF99",
                }}
              >
                Spend
              </Form.Label>
              <Box sx={{ display: "flex" }} className="select-currency-box">
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  name="fname"
                  value="250,000.00-71,000,000.00"
                  style={{ color: "#fff", fontSize: "16px", minWidth: "280px" }}
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
                    <div className="selected-dropdown">
                      {e.icon}
                      <span>{e.text}</span>
                    </div>
                  )}
                />
              </Box>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label
                className="form-control"
                style={{
                  lineHeight: "16px",
                  fontSize: "12px",
                  color: "#FFFFFF99",
                }}
              >
                Spend
              </Form.Label>
              <Box sx={{ display: "flex" }} className="select-currency-box">
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  name="fname"
                  value="0.00"
                  style={{ color: "#fff", fontSize: "16px", minWidth: "280px" }}
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
                  options={data1}
                  onChange={handleChangeAny}
                  getOptionLabel={(e) => (
                    <div className="selected-dropdown">
                      {e.icon}
                      <span>{e.text}</span>
                    </div>
                  )}
                />
              </Box>
            </Form.Group>
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontSize: "16px",
                marginBottom: "30px",
                paddingTop: "20px",
              }}
            >
              Pay with
            </Typography>
            <Form.Group className="form-group">
              <Box className="select-currency-box select-currency-pay-with-box">
                <Select
                  defaultValue={selectedOptionAny}
                  value={selectedOptionAny}
                  className="select-dropdown"
                  isSearchable={false}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  classNamePrefix="select-dropdown"
                  options={data1}
                  onChange={handleChangeAny}
                  getOptionLabel={(e) => (
                    <div className="selected-dropdown">
                      {e.icon}
                      <span>{e.text}</span>
                    </div>
                  )}
                />
              </Box>
            </Form.Group>
            <Typography
              variant="p"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
                fontSize: "14px",
                color: "#808191",
              }}
            >
              Estimated price
              <span style={{ color: "#fff" }}>1 USDT ≈ 16699.98629876 IDR</span>
            </Typography>
          </div>
        );
      case 2:
        return (
          <div style={{ color: "#fff" }}>
            <Typography
              variant="h5"
              sx={{ color: "#fff", fontSize: "16px", marginBottom: "30px" }}
            >
              Select currency
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: "#fff",
                fontSize: { md: "32px", xs: "20px" },
                marginBottom: "16px",
                lineHeight: "20px",
              }}
            >
              119.16177441USDT
            </Typography>
            <Typography
              component="p"
              style={{
                color: "#808191",
                fontSize: { md: "18px", xs: "14px" },
                lineHeight: "20px",
                fontFamily: "Inter",
                fontWeight: "600",
                marginBottom: "30px",
              }}
            >
              You’ll pay 2,000,000.00 IDR
            </Typography>
            {transactionDetails.map((detail, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                  fontFamily: "Eudoxus Sans",
                  fontWeight: "600",
                }}
              >
                <span style={{ color: "#808191" }}>{detail.label}</span>
                <span>{detail.value}</span>
              </Box>
            ))}
            <Box
              sx={{ display: "flex", gap: "18px" }}
              className="queation-mark-currancy-block"
            >
              <img
                src={QueationMarkImage}
                alt="QueationMarkImage"
                style={{ width: "24px", height: "24px" }}
              />
              Please note that execution price is subject to the actual payment
              completion time. Please complete the payment within 30mins.
            </Box>
            <div
              className="select-currency-checkbox"
              style={{
                gap: "18px",
                color: "#808191",
                marginTop: "37px",
                display: "flex",
              }}
            >
              <div class="custom-input-seller">
                <div class="form-check ps-0 d-flex">
                  <input type="checkbox" id="vehicle1" className="me-2" />
                  <label
                    class="text-muted"
                    for="vehicle1"
                    style={{
                      fontFamily: "Eudoxus Sans",
                      fontSize: "14px",
                      fontWeight: 700,
                      lineHeight: "17.64px",
                      letterSpacing: "0.5px",
                      marginTop: "-3px",
                    }}
                  >
                    I have read and I agree to the Fiat Services 
                    <a
                      href="https://www.binance.com/en/legal/terms-fiat"
                      style={{ color: "#808191" }}
                    >
                      Terms of Use 
                    </a>
                    and I authorize the debit of the above amount through the
                    chosen payment method. Refresh
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div style={{ color: "#fff" }}>Unknown step</div>;
    }
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <div>
      {getStepContent(activeStep)}
      <div className="deposite-buttons" style={{ marginTop: "37px" }}>
        {activeStep < 3 && (
          <>
            <Button
              className="btn btn-secondary cancel-button"
              sx={{
                color: "#fff",
                opacity: "1",
                background: "#373A43",
                "&:hover": {
                  background: "#373A43",
                },
              }}
              onClick={() => activeStep && handleBack()}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary next-button"
              variant="contained"
              color="primary"
              onClick={() => {
                activeStep === 2 ? navigate("/confirm-order") : handleNext();
              }}
            >
              {activeStep === 2 ? "Buy USDT" : "Next Step"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default BankDepositBuyer;
