import React, { useState } from "react";
import { useSelector } from "react-redux";
import { userGetFullDetails } from "../../store/slices/AuthSlice";
import { TableLoader } from "../../helper/Loader";
import { CopyIcon, SearchIcon } from "../../component/SVGIcon";
import WaveImage from "../../content/images/Path.png";
import { Box, Button, Grid } from "@mui/material";
import { BsChevronRight } from "react-icons/bs";

const tradeList = [
  {
    name: "Ethereum",
    amount: "20,0293391 ETH",
    imgSrc: require("../../content/images/ethereum.png"),
  },
  {
    name: "Bitcoin",
    amount: "20,0293391 BTC",
    imgSrc: require("../../content/images/dots.png"),
  },
  // You can add more trade objects here
];
const Withdraw = () => {
  const [withdrawLoading, setEscrowLoading] = useState(false);

  let usergetdata = useSelector(userGetFullDetails);
  return (
    <div className="page-cover withdraw-view">
      <div className="page-title-cover">
        <h2 className="page-title">Withdraw</h2>
      </div>
      <Box
        sx={{
          display: "flex",
          alignItems: { md: "center", xs: "flex-start" },
          justifyContent: "space-between",
        }}
      >
        <div className="row user-details">
          <div>
            <img
              className="rounded-circle"
              src={
                usergetdata?.imageUrl
                  ? usergetdata?.imageUrl
                  : require("../../content/images/avatar1.png")
              }
              alt="No Profile"
            />
          </div>
          <div>
            <strong>Name</strong>
            <p>Gaeved deslaed</p>
          </div>
          <div>
            <strong>Name</strong>
            <p>
              8237848923{" "}
              <button>
                <CopyIcon />
              </button>
            </p>
          </div>
          <div>
            <strong>Level</strong>
            <p style={{ display: "flex", alignItems: "center" }}>
              Regular User
              <span style={{ marginTop: " 3px" }}>
                <BsChevronRight />
              </span>
            </p>
          </div>
          <div>
            <strong>User Type</strong>
            <p>Personal</p>
          </div>
        </div>
        <Button
          className="btn btn-primary"
          variant="primary"
          sx={{
            padding: { md: "18px 32px", xs: "10px 32px" },
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "Eudoxus Sans",
            textTransform: "capitalize",
          }}
        >
          Withdraw
        </Button>
      </Box>

      <div className="cards-dark withdraw-card withdraw-balance-chart card card-padding">
        <Grid container sx={{ alignItems: "center" }}>
          <Grid item md={6}>
            <h4 className="dark-card-title">Estimate Balance</h4>
            <h3 className="balance-count">
              0.000005936<span>USDT</span>
            </h3>
            <p className="balance-ending-text">≈ $2.24</p>
          </Grid>
          <Grid item md={6}>
            <img src={WaveImage} alt="WaveImage" style={{ float: "right" }} />
          </Grid>
        </Grid>
      </div>
      <div className="row align-items-center withdraw-history-title-cover">
        <h2 className="page-title">Balance</h2>
        <div className="col icon-input-cover">
          <SearchIcon />
          <input
            type="text"
            className="form-control"
            placeholder="Search Balance"
          />
        </div>
      </div>
      <div className="table-responsive tradeList withdraw-table">
        <div className="flex-table mt-0">
          <div className="flex-table-header">
            <div className="flex-60 text-start">Price</div>
            <div className="flex-20">Total</div>
            <div className="flex-20">Status</div>
          </div>
          {withdrawLoading ? (
            <TableLoader />
          ) : (
            tradeList.map((trade, index) => (
              <div
                key={index}
                className="flex-table-body tradeListBody"
                style={{ padding: "21px 18px" }}
              >
                <div className="flex-60 d-flex align-items-center">
                  <img src={trade.imgSrc} alt={trade.name} />
                  <span className="ms-2">{trade.name}</span>
                </div>
                <div className="flex-20 text-center">{trade.amount}</div>
                <div className="flex-20 d-flex justify-content-center align-items-center">
                  <div className="trade-status d-flex justify-content-center align-items-center">
                    <span className="statusBtn completebtn">Complete</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
