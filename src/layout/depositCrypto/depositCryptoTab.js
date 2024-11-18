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
import FileSearchImage from "../../content/images/file-search.png";
import BarCodeImage from "../../content/images/barcode.png";
import FilesImage from "../../content/images/files.png";
// import CheckCircleIcon from "@mui/icons-material";
import Select from "react-select";

const steps = ["Select Coin", "Select Network", "Deposit Address"];
const CustomStepIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-check-circle"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
    </svg>
  );
};
const items = [
  {
    label: "USDT",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4"></circle>
      </svg>
    ),
  },
  {
    label: "WLD",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4"></circle>
      </svg>
    ),
  },
  {
    label: "XRP",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4"></circle>
      </svg>
    ),
  },
  {
    label: "BTC",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4"></circle>
      </svg>
    ),
  },
  {
    label: "ETH",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4"></circle>
      </svg>
    ),
  },
];
const data = [
  {
    value: 1,
    text: "Search Coin",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.5299 20.4686L16.8358 15.7755C18.1963 14.1421 18.8748 12.047 18.73 9.92618C18.5852 7.80531 17.6283 5.82191 16.0584 4.38859C14.4885 2.95526 12.4264 2.18235 10.3012 2.23065C8.1759 2.27895 6.15108 3.14474 4.64791 4.64791C3.14474 6.15108 2.27895 8.1759 2.23065 10.3012C2.18235 12.4264 2.95526 14.4885 4.38859 16.0584C5.82191 17.6283 7.80531 18.5852 9.92618 18.73C12.047 18.8748 14.1421 18.1963 15.7755 16.8358L20.4686 21.5299C20.5383 21.5995 20.621 21.6548 20.7121 21.6925C20.8031 21.7302 20.9007 21.7497 20.9992 21.7497C21.0978 21.7497 21.1954 21.7302 21.2864 21.6925C21.3775 21.6548 21.4602 21.5995 21.5299 21.5299C21.5995 21.4602 21.6548 21.3775 21.6925 21.2864C21.7302 21.1954 21.7497 21.0978 21.7497 20.9992C21.7497 20.9007 21.7302 20.8031 21.6925 20.7121C21.6548 20.621 21.5995 20.5383 21.5299 20.4686ZM3.74924 10.4992C3.74924 9.16421 4.14512 7.85917 4.88682 6.74914C5.62852 5.63911 6.68272 4.77394 7.91612 4.26305C9.14953 3.75216 10.5067 3.61849 11.8161 3.87894C13.1255 4.13939 14.3282 4.78226 15.2722 5.72627C16.2162 6.67027 16.8591 7.87301 17.1195 9.18238C17.38 10.4917 17.2463 11.849 16.7354 13.0824C16.2245 14.3158 15.3594 15.37 14.2493 16.1117C13.1393 16.8534 11.8343 17.2492 10.4992 17.2492C8.70964 17.2473 6.9939 16.5355 5.72846 15.27C4.46302 14.0046 3.75122 12.2888 3.74924 10.4992Z"
          fill="none"
        />
      </svg>
    ),
  },
];
const data1 = [
  {
    value: 1,
    text: "Search Coin",
  },
  {
    value: 2,
    text: "Eth",
  },
];
const data2 = [
  {
    value: 1,
    text: "Select Network",
  },
  {
    value: 2,
    text: "bitcoin",
  },
];
const DepositCryptoTab = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [pageStepperArr, setPageStepperArr] = useState([0]);
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleStepClick = (indexnUM) => {
    if (activeStep < steps.length - 1) {
      const indexValue = [...new Set([...pageStepperArr, indexnUM])].sort(
        (a, b) => a - b
      );
      if (
        (!String(indexnUM)?.includes("2") || indexnUM === 2) &&
        indexValue?.filter((x) => [0, 1]?.includes(x))?.length === 2
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setPageStepperArr(indexValue);
      }
    } else {
      handleReset();
      setPageStepperArr([0]);
    }
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const [selectedOptionAny, setSelectedOptionAny] = useState(data1[0]);
  const handleChangeAny = (selectedOption) => {
    setSelectedOptionAny(selectedOption);
  };
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="step-body">
            {activeStep === 0 && (
              <>
                <h3>Choose your cryptocurrency</h3>
                <div
                  style={{ position: "relative" }}
                  className="deposit-dropdown"
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "15px",
                      zIndex: "9",
                      top: "17px",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.5299 20.4686L16.8358 15.7755C18.1963 14.1421 18.8748 12.047 18.73 9.92618C18.5852 7.80531 17.6283 5.82191 16.0584 4.38859C14.4885 2.95526 12.4264 2.18235 10.3012 2.23065C8.1759 2.27895 6.15108 3.14474 4.64791 4.64791C3.14474 6.15108 2.27895 8.1759 2.23065 10.3012C2.18235 12.4264 2.95526 14.4885 4.38859 16.0584C5.82191 17.6283 7.80531 18.5852 9.92618 18.73C12.047 18.8748 14.1421 18.1963 15.7755 16.8358L20.4686 21.5299C20.5383 21.5995 20.621 21.6548 20.7121 21.6925C20.8031 21.7302 20.9007 21.7497 20.9992 21.7497C21.0978 21.7497 21.1954 21.7302 21.2864 21.6925C21.3775 21.6548 21.4602 21.5995 21.5299 21.5299C21.5995 21.4602 21.6548 21.3775 21.6925 21.2864C21.7302 21.1954 21.7497 21.0978 21.7497 20.9992C21.7497 20.9007 21.7302 20.8031 21.6925 20.7121C21.6548 20.621 21.5995 20.5383 21.5299 20.4686ZM3.74924 10.4992C3.74924 9.16421 4.14512 7.85917 4.88682 6.74914C5.62852 5.63911 6.68272 4.77394 7.91612 4.26305C9.14953 3.75216 10.5067 3.61849 11.8161 3.87894C13.1255 4.13939 14.3282 4.78226 15.2722 5.72627C16.2162 6.67027 16.8591 7.87301 17.1195 9.18238C17.38 10.4917 17.2463 11.849 16.7354 13.0824C16.2245 14.3158 15.3594 15.37 14.2493 16.1117C13.1393 16.8534 11.8343 17.2492 10.4992 17.2492C8.70964 17.2473 6.9939 16.5355 5.72846 15.27C4.46302 14.0046 3.75122 12.2888 3.74924 10.4992Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  <Select
                    value={selectedOptionAny || null}
                    className="select-dropdown w-100 mt-0 mb-4 d-block deposit-dropdown"
                    isSearchable={false}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    classNamePrefix="select-dropdown"
                    options={data1}
                    onChange={handleChangeAny}
                    placeholder="Select an option"
                    getOptionLabel={(option) => (
                      <>
                        <div className="selected-dropdown d-flex align-items-center">
                          <span className="text-white fs-13 ml-2">
                            {option.text}
                          </span>
                        </div>
                      </>
                    )}
                    getOptionValue={(option) => option.value}
                    formatOptionLabel={(option) => (
                      <div className="selected-dropdown d-flex align-items-center">
                        <span className="text-white fs-13 ml-2">
                          {option.text}
                        </span>
                      </div>
                    )}
                  />
                </div>
                <Box
                  className="deposit-crypto-tabbing"
                  sx={{ flexWrap: { lg: "nowrap", xs: "wrap" } }}
                >
                  {items.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        background: "#373A43",
                        border: "1px solid #202020",
                        borderRadius: "16px",
                        padding: "10px",
                        width: "100px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </div>
        );
      case 1:
        return (
          <div className="step-body">
            <h3>Select Network </h3>
            <div style={{ position: "relative" }} className="deposit-dropdown">
              <span
                style={{
                  position: "absolute",
                  left: "15px",
                  zIndex: "9",
                  top: "17px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.5299 20.4686L16.8358 15.7755C18.1963 14.1421 18.8748 12.047 18.73 9.92618C18.5852 7.80531 17.6283 5.82191 16.0584 4.38859C14.4885 2.95526 12.4264 2.18235 10.3012 2.23065C8.1759 2.27895 6.15108 3.14474 4.64791 4.64791C3.14474 6.15108 2.27895 8.1759 2.23065 10.3012C2.18235 12.4264 2.95526 14.4885 4.38859 16.0584C5.82191 17.6283 7.80531 18.5852 9.92618 18.73C12.047 18.8748 14.1421 18.1963 15.7755 16.8358L20.4686 21.5299C20.5383 21.5995 20.621 21.6548 20.7121 21.6925C20.8031 21.7302 20.9007 21.7497 20.9992 21.7497C21.0978 21.7497 21.1954 21.7302 21.2864 21.6925C21.3775 21.6548 21.4602 21.5995 21.5299 21.5299C21.5995 21.4602 21.6548 21.3775 21.6925 21.2864C21.7302 21.1954 21.7497 21.0978 21.7497 20.9992C21.7497 20.9007 21.7302 20.8031 21.6925 20.7121C21.6548 20.621 21.5995 20.5383 21.5299 20.4686ZM3.74924 10.4992C3.74924 9.16421 4.14512 7.85917 4.88682 6.74914C5.62852 5.63911 6.68272 4.77394 7.91612 4.26305C9.14953 3.75216 10.5067 3.61849 11.8161 3.87894C13.1255 4.13939 14.3282 4.78226 15.2722 5.72627C16.2162 6.67027 16.8591 7.87301 17.1195 9.18238C17.38 10.4917 17.2463 11.849 16.7354 13.0824C16.2245 14.3158 15.3594 15.37 14.2493 16.1117C13.1393 16.8534 11.8343 17.2492 10.4992 17.2492C8.70964 17.2473 6.9939 16.5355 5.72846 15.27C4.46302 14.0046 3.75122 12.2888 3.74924 10.4992Z"
                    fill="white"
                  />
                </svg>
              </span>
              <Select
                value={selectedOptionAny}
                className="select-dropdown w-100 mt-0 mb-4 d-block deposit-dropdown"
                isSearchable={false}
                components={{
                  IndicatorSeparator: () => null,
                }}
                classNamePrefix="select-dropdown"
                options={data2}
                onChange={handleChangeAny}
                getOptionLabel={(option) => (
                  <>
                    <div className="selected-dropdown d-flex align-items-center">
                      <span className="text-white fs-13 ml-2">
                        {option.text}
                      </span>
                    </div>
                  </>
                )}
                getOptionValue={(option) => option.value} // Ensure value retrieval works
                formatOptionLabel={(option) => (
                  <div className="selected-dropdown d-flex align-items-center">
                    <span className="text-white fs-13 ml-2">{option.text}</span>
                  </div>
                )}
              />
            </div>
            <Box
              className="deposit-crypto-tabbing"
              sx={{ flexWrap: { lg: "nowrap", xs: "wrap" } }}
            >
              {items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    background: "#373A43",
                    border: "1px solid #202020",
                    borderRadius: "16px",
                    padding: "10px",
                    width: "100px",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Box>
              ))}
            </Box>
          </div>
        );
      case 2:
        return (
          <Box className="step-body">
            <Typography variant="h3" sx={{ fontSize: "16px" }}>
              Deposit Address{" "}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { md: "32px", xs: "5px" },
                border: "1px solid #3F3F3F",
                background: "#212121",
                borderRadius: "11px",
                padding: "16px",
              }}
            >
              <Box
                sx={{
                  width: { xs: "57px", md: "117px" },
                  height: { xs: "54px", md: "112px" },
                }}
              >
                <img
                  src={BarCodeImage}
                  alt="BarCodeImage"
                  style={{ width: "100%" }}
                />
              </Box>
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
                    fontSize: { md: "16px", xs: "13px" },
                  }}
                >
                  0x123128381822391293129391239cc1231231
                  <span>
                    <img src={FilesImage} alt="FilesImage" />
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
                fontFamily: "Eudoxus Sans",
                fontWeight: 700,
                lineHeight: " 17.64px",
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
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            className="deposit-stepper-container"
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={CustomStepIcon}
                  onClick={() => handleStepClick(index)}
                  className="step-label"
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12} md={8} sx={{ paddingLeft: "30px !important" }}>
          <Box
            className="step-content-container cryptocurrency-search"
            sx={{
              padding: { lg: "28px 30px", xs: "10px" },
              position: "relative",
              minHeight: { lg: "320px", xs: "380px" },
            }}
          >
            <Typography variant="body1">
              {getStepContent(activeStep)}
            </Typography>
            <Box
              className="deposite-buttons"
              sx={{ padding: { lg: "0 30px", md: "0 10px" } }}
            >
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
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    {activeStep === steps.length - 2 ? "Previous" : "Cancel"}
                  </Button>
                  <Button
                    className="btn btn-primary next-button"
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next Step
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box className="recent-deposits-container">
        <Typography variant="h4" className="recent-deposits-title">
          Recent Deposits
        </Typography>
        <Box className="image-container">
          <img
            src={FileSearchImage}
            alt="FileSearchImage"
            className="recent-deposits-image"
          />
          <Typography variant="p" className="recent-deposits-text">
            You have not added any payment methods
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default DepositCryptoTab;
