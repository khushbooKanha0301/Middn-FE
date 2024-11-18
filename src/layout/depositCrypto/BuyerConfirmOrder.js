import React, { useState } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Radio,
  Paper,
  Button,
} from "@mui/material";

function BuyerConfirmOrder() {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <Box sx>
      <Typography
        variant="h3"
        sx={{
          marginTop: { md: "60px", xs: "20px" },
          marginBottom: { md: "48px", xs: "20px" },
          fontFamily: "Eudoxus Sans",
          fontSize: "24px",
          fontWeight: " 700",
          lineHeight: "24px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        Confirm Order
      </Typography>
      <Paper
        sx={{
          padding: { md: "28px 30px", xs: "15px" },
          backgroundColor: "#18191D",
          borderRadius: "16px",
          maxWidth: "620px",
          margin: "0 auto 30px",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: "Eudoxus Sans",
            fontSize: "16px",
            marginBottom: "30px",
            fontWeight: " 700",
            lineHeight: "24px",
            color: "#fff",
          }}
        >
          Confirm Order
        </Typography>
        <Tabs
          className="bank-deposite-tab buyer-confirm-order-tab"
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "transparent",
            },
          }}
          sx={{ gap: "10px" }}
        >
          <Tab
            className="bank-deposit-radio-button"
            sx={{ maxWidth: "unset", marginBottom: "0px !important" }}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  checked={tabValue === 0}
                  onChange={() => handleTabChange(null, 0)}
                  value="BCA"
                  name="tab-radio"
                  className="theme-radio"
                />
                BCA
              </Box>
            }
            variant="outlined"
          />
          <Tab
            className="bank-deposit-radio-button"
            sx={{ maxWidth: "unset", marginBottom: "0px !important" }}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  checked={tabValue === 1}
                  onChange={() => handleTabChange(null, 1)}
                  value="BNI"
                  name="tab-radio"
                  className="theme-radio"
                />
                BNI
              </Box>
            }
            variant="outlined"
          />
          <Tab
            className="bank-deposit-radio-button"
            sx={{ maxWidth: "unset", marginBottom: "0px !important" }}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  className="theme-radio"
                  checked={tabValue === 2}
                  onChange={() => handleTabChange(null, 1)}
                  value="BNI"
                  name="tab-radio"
                />
                BNI
              </Box>
            }
            variant="outlined"
          />
          <Tab
            className="bank-deposit-radio-button"
            sx={{ maxWidth: "unset", marginBottom: "0px !important" }}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  className="theme-radio"
                  checked={tabValue === 3}
                  onChange={() => handleTabChange(null, 1)}
                  value="Permata"
                  name="tab-radio"
                />
                Permata
              </Box>
            }
            variant="outlined"
          />
        </Tabs>
        <Box sx={{ marginTop: "30px" }}>
          <Typography variant="body2" sx={{ color: "#FFF" }}>
            <Typography variant="p" sx={{ color: "#808191", fontSize: "14px" }}>
              Summary Details
            </Typography>
            <Typography
              variant="p"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: { md: "24px", xs: "10px" },
                fontSize: "14px",
                color: "#808191",
                marginBottom: { md: "30px", xs: "10px" },
              }}
            >
              Total you pay
              <span style={{ color: "#fff" }}>2.000.000 IDR</span>
            </Typography>
            <Button
              className="btn btn-primary next-button"
              variant="contained"
              color="primary"
              sx={{
                width: "100%",
                height: "52px",
                borderRadius: "16px",
                textTransform: "capitalize",
              }}
            >
              Pay Now 2.000.000 IDR
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default BuyerConfirmOrder;
