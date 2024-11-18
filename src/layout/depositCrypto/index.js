import React, { useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { Tabs, Tab } from "react-bootstrap";
import DepositCryptoTab from "./depositCryptoTab";
import BankDeposit from "./bankDeposit";
import AddBankTransfer from "./addBankTransfer";

export default function DepositCrypto() {
  const [tabValue, setTabValue] = useState("crypto"); // Updated to use string values for tabs
  const [addBankTransferShow, setAddBankTransferShow] = useState(false);

  const handleTabChange = (key) => {
    setTabValue(key); // Use the tab key for value
  };

  return (
    <div
      className="market-place-buy-sell"
      style={{ marginTop: "44px" }}
    >
      <Box className="profile-view deposit-tab">
        <Grid
          container
          spacing={2}
          className="deposit-crypto-wrapper"
          mb="48px"
          sx={{ alignItems: "center" }}
        >
          <Grid item xs={12} md={4} sx={{ paddingTop: "0 !important" }}>
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontSize: "24px",
                lineHeight: "24px",
                margin: "0px",
                fontFamily: "eudoxus sans",
                fontWeight: " 700",
              }}
            >
              {tabValue === "bank" ? "Deposit Fiat" : "Deposit"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{ paddingTop: "0 !important" }}>
            <Box className="deposit-crypto-tab">
              <Tabs
                activeKey={tabValue}
                onSelect={handleTabChange}
                className="mb-0"
              >
                <Tab eventKey="crypto" title="Deposit Crypto" />
                <Tab eventKey="bank" title="Bank Deposit" />
              </Tabs>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        {tabValue === "crypto" && <DepositCryptoTab />}
        {tabValue === "bank" && <BankDeposit />}
      </Box>
      <AddBankTransfer
        show={addBankTransferShow}
        onClose={() => setAddBankTransferShow(false)}
      />
    </div>
  );
}
