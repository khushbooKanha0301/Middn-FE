import React, { useState } from "react";
import {
  Grid,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import BarCodeImage from "../../../content/images/barcode.png";
import FilesImage from "../../../content/images/files.png";
import SearchDropdown from "../../../component/SearchDropdown";
import { ButtonGroup } from "react-bootstrap";
import Search from "../../../content/images/search.svg";
import PaymentMethodDropdown from "./PaymentMethodDropdown";

const steps = ["Payment Method", "Pricing", "Other Setting"];

const data = [
  {
    value: 1,
    text: "Find Your payment...",
    icon: (
      <>
        <h1>Payment Method</h1>
        <img
          src={Search}
          alt=""
          className="search-icon"
          style={{ marginRight: "10px" }}
        />
      </>
    ),
  },
];
const depositOptions = [
  {
    value: "Buyer",
    fee: "Your offer will be listed on the Buy Bitcoin page",
    tabIndex: 1,
  },
  {
    value: "Seller",
    fee: "Your offer will be listed on the Sell Bitcoin page",
    tabIndex: 2,
  },
];
const CreateOffers = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedOptionAny, setSelectedOptionAny] = useState(data[0]);
  const [escrowType, setEscrowType] = useState(depositOptions[0].value);
  const handleChangeAny = (e) => {
    setSelectedOptionAny(e);
  };
  const handleOptionClick = (value) => {
    setEscrowType(value); // Update the selected option
  };
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="step-body">
            <h3>Choose your cryptocurrency</h3>
            <ButtonGroup
              style={{ display: "flex", gap: "10px", marginBottom: "40px" }}
            >
              <Button
                variant="outlined"
                style={{
                  border: "1px solid #7ffc8d",
                  borderRadius: "13px",
                  background: "rgba(127, 252, 141, 0.0901960784)",
                  color: "#fff",
                  width: "118px",
                  height: "56px",
                  fontSize: "13px",
                }}
              >
                currency
              </Button>
              <Button
                variant="outlined"
                style={{
                  border: "1px solid #282A2C",
                  borderRadius: "13px",
                  color: "#fff",
                  background: "#282a2c",
                  width: "118px",
                  height: "56px",
                  fontSize: "13px",
                }}
              >
                currency
              </Button>
              <Button
                variant="outlined"
                style={{
                  border: "1px solid #282A2C",
                  borderRadius: "13px",
                  color: "#fff",
                  background: "#282a2c",
                  width: "118px",
                  height: "56px",
                  fontSize: "13px",
                }}
              >
                currency
              </Button>
            </ButtonGroup>
            <h3>Choose your cryptocurrency</h3>
            <div>
              {depositOptions.map((option, index) => (
                <Box key={index}>
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
                        onClick={() => handleOptionClick(option.value)} // Set selected on click
                      >
                        <div
                          className={`form-check-input check-input ${
                            escrowType === option.value ? "selected" : ""
                          }`} // Add 'selected' class if escrowType matches the option value
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
                      fontFamily: "eudoxus sans",
                    }}
                  >
                    {option.fee}
                  </Typography>
                </Box>
              ))}
            </div>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>
              Payment Method
            </h3>
            <div className="currency-step-select w-100 mb-3">
              <PaymentMethodDropdown />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="step-body">
            <h3>Select Network </h3>
            <SearchDropdown />
          </div>
        );
      case 2:
        return (
          <Box className="step-body">
            <Typography variant="h3" sx={{ fontSize: "16px" }}>
              Deposit Address
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
                border: "1px solid #3F3F3F",
                background: "#212121",
                borderRadius: "11px",
                padding: "16px",
              }}
            >
              <img src={BarCodeImage} alt="BarCodeImage" />
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: "#808191",
                    fontSize: "13px",
                    marginBottom: "5px !important",
                  }}
                >
                  Address
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    display: "flex",
                    gap: "10px",
                    wordBreak: "break-all",
                    fontSize: "16px",
                  }}
                >
                  0x123128381822391293129391239cc1231231
                  <span>
                    <img
                      src={FilesImage}
                      alt="FilesImage"
                      style={{ width: "18px" }}
                    />
                  </span>
                </Typography>
              </Box>
            </Box>
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
              Minimum deposit
              <span style={{ color: "#fff" }}>0.00000001 USDT</span>
            </Typography>
          </Box>
        );
    }
  };

  return (
    <div className="market-place-buy-sell">
      <Typography
        variant="h2"
        sx={{
          fontFamily: "Eudoxus Sans",
          fontSize: "24px",
          fontWeight: 700,
          lineHeight: "24px",
          color: "#fff",
          marginBottom: "42px",
        }}
      >
        Create an Offer to Sell Bitcoin
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            className="stepper-container"
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  onClick={() => handleStepClick(index)}
                  className="step-label"
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
            <Box
              sx={{
                background: "#282A2C",
                padding: "24px",
                color: "#fff",
                borderRadius: "23px",
                marginTop: "16px",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Eudoxus Sans",
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: " 24px",
                  marginBottom: "18px",
                }}
              >
                About This Step
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontFamily: "Eudoxus Sans",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "20px",
                }}
              >
                Start creating your offer by selecting the cryptocurrency you
                want to trade, whether or not you want to buy or sell, and the
                payment method you want to use.
              </Typography>
            </Box>
          </Stepper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box className="step-content-container">
            <Typography variant="body1">
              {getStepContent(activeStep)}
            </Typography>
            <div className="deposite-buttons">
              {activeStep < steps.length - 1 && (
                <>
                  <Button
                    className="btn btn-secondary cancel-button"
                    sx={{
                      color: "#fff",
                      opacity: "1",
                      background: "#373A43",
                      "&:hover ": {
                        background: "#373A43",
                      },
                    }}
                    onClick={() => activeStep && handleBack()}
                  >
                    {activeStep === steps.length - 2 ? "Previous" : "Cancel"}
                  </Button>
                  <Button
                    className="btn btn-primary next-button"
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 2 ? "Finish" : "Next Step"}
                  </Button>
                </>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateOffers;
