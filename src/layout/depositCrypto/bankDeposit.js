import React, { useState } from "react";
import { Typography, Tabs, Tab, Box, Grid } from "@mui/material";
import BankDepositBuyer from "./bankDepositBuyer";
import BankDepositSeller from "./bankDepositSeller";

function BankDeposit() {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [radioButton, setRadioButton] = useState("selected");
  const handleOptionClick = (value) => {
    setRadioButton(value);
  };
  return (
    <Grid container spacing={2} mb="40px">
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            padding: "20px",
            backgroundColor: "#18191D",
            borderRadius: "16px",
          }}
        >
          <Tabs
            className="bank-deposite-tab"
            orientation="vertical"
            value={tabValue}
            onChange={handleTabChange}
            TabIndicatorProps={{
              sx: {
                backgroundColor: "transparent", // Make the tab indicator transparent
              },
            }}
          >
            <Tab
              className="deposit-radio-button"
              sx={{ maxWidth: "unset" }}
              onClick={() => handleOptionClick("selected")} // Set radioButton to "selected" on click
              label={
                <div
                  className="yourself-option form-check radio-button gradient-border-content"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ marginLeft: "0em" }}
                    className={`form-check-input check-input ${
                      radioButton === "selected" ? "selected" : ""
                    }`} // Add 'selected' class if radioButton matches "selected"
                  />
                  <label className="form-check-label">Buyer</label>
                </div>
              }
              variant="outlined"
            />
            <Tab
              className="deposit-radio-button"
              sx={{ maxWidth: "unset" }}
              onClick={() => handleOptionClick("verified")} // Set radioButton to "verified" on click
              label={
                <div
                  className="yourself-option form-check radio-button gradient-border-content"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ marginLeft: "0em" }}
                    className={`form-check-input check-input ${
                      radioButton === "verified" ? "selected" : ""
                    }`}
                  />
                  <label className="form-check-label">Seller</label>
                </div>
              }
              variant="outlined"
            />
          </Tabs>
        </Box>
      </Grid>
      <Grid item xs={12} md={7}>
        <Box
          sx={{
            padding: "20px",
            backgroundColor: "#18191D",
            borderRadius: "16px",
            height: "550px",
            position: "relative",
          }}
        >
          {tabValue === 0 && (
            <Typography variant="body2" sx={{ color: "#FFF" }}>
              <BankDepositBuyer />
            </Typography>
          )}
          {tabValue === 1 && (
            <Typography variant="body2" sx={{ color: "#FFF" }}>
              <BankDepositSeller />
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default BankDeposit;
