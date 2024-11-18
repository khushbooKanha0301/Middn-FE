import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import Select, { components } from "react-select";

const data = [
  {
    value: 1,
    text: "US Dollar(USD)",
  },
  {
    value: 2,
    text: "Pound",
  },
  {
    value: 3,
    text: "Rs",
  },
];
const paymentMethods = [
  { value: "all", label: "All payment" },
  { value: "bank", label: "Bank Transfer" },
  { value: "wallet", label: "Online Wallets" },
  { value: "debit_credit", label: "Debit/Credit cards" },
  { value: "gift", label: "Gift cards" },
  { value: "digital", label: "Digital currencies" },
  { value: "cash", label: "Cash payment" },
  { value: "mobile", label: "Mobile money" },
];
const depositOptions = [
  { value: "Bank Name 1", tabIndex: 1 },
  { value: "Bank Name 2", tabIndex: 2 },
  { value: "Bank Name 3", tabIndex: 3 },
  { value: "Bank Name 4", tabIndex: 4 },
  { value: "Bank Name 5", tabIndex: 5 },
  { value: "Bank Name 6", tabIndex: 6 },
  { value: "Bank Name 7", tabIndex: 7 },
  { value: "Bank Name 8", tabIndex: 8 },
];
const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#282A2C",
    color: "#fff",
    border: "none",
    boxShadow: "none",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#282A2C",
    width: "100%",
    left: 0,
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
  // menuList: (provided) => ({
  //   ...provided,
  //   display: "flex",
  //   flexWrap: "wrap",
  //   maxHeight: "unset",
  // }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    padding: "10px",
    marginBottom: "20px",
    backgroundColor: state.isSelected
      ? "#282A2C"
      : state.isFocused
      ? "#282A2C"
      : "transparent",
    color: state.isSelected ? "#282A2C" : "#fff",
    "&:active": {
      backgroundColor: "transparent",
    },
    color: "#fff",
    flex: "0 0 25%",
    maxWidth: "25%",
  }),
  singleValue: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    color: "#fff",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  input: (provided) => ({
    ...provided,
    display: "none",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

const CustomSingleValue = (props) => (
  <components.SingleValue {...props} className="custom-single-value">
    {props.children}
  </components.SingleValue>
);

const CustomIndicatorsContainer = ({ onToggle, isOpen, ...props }) => (
  <div className="custom-indicators-container">
    <components.IndicatorsContainer {...props}>
      <button
        className={isOpen ? "btn btn-primary" : "show-all-button"}
        style={{
          border: "none",
          borderRadius: "11px",
          color: "#fff",
          padding: "4px 8px",
        }}
        onClick={onToggle}
      >
        Show all
      </button>
      {props.children}
    </components.IndicatorsContainer>
  </div>
);

const PaymentMethodDropdown = () => {
  const [selectedOptionAny, setSelectedOptionAny] = useState(data[0]);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [bankTransfer, setBankTransfer] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [showMenuList, setShowMenuList] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const handleChange = (selectedOption) => {
    setSelectedPaymentMethod(selectedOption);
    setMenuIsOpen(false);
  };
  const toggleMenu = () => {
    setMenuIsOpen((prevState) => !prevState);
    setShowMenuList(true);
  };
  const handleOptionClick = (value) => {
    setBankTransfer(true);
    setPaymentMethod(false);
  };
  const handleChangeAny = (e) => {
    setSelectedOptionAny(e);
  };
  const CustomMenuList = (props) => {
    return (
      <components.MenuList {...props}>
        {paymentMethod ? (
          <Box
            className="radio-button-payment-method"
            sx={{
              padding: "24px 20px",
              background: "#282A2C",
              borderRadius: "16px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: "14px",
                background: "#282A2C",
                width: "100%",
                fontSize: "14px",
                fontFamily: "eudoxus sans",
                fontWeight: 700,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
              >
                <path
                  d="M17.9996 7.99993C17.9996 8.19884 17.9206 8.38961 17.7799 8.53026C17.6393 8.67091 17.4485 8.74993 17.2496 8.74993H2.55993L8.03024 14.2193C8.09992 14.289 8.1552 14.3717 8.19291 14.4628C8.23062 14.5538 8.25003 14.6514 8.25003 14.7499C8.25003 14.8485 8.23062 14.9461 8.19291 15.0371C8.1552 15.1281 8.09992 15.2109 8.03024 15.2806C7.96056 15.3502 7.87783 15.4055 7.78679 15.4432C7.69574 15.4809 7.59816 15.5003 7.49961 15.5003C7.40107 15.5003 7.30349 15.4809 7.21244 15.4432C7.1214 15.4055 7.03867 15.3502 6.96899 15.2806L0.218988 8.53055C0.149256 8.4609 0.0939369 8.37818 0.0561936 8.28713C0.0184504 8.19609 -0.000976562 8.09849 -0.000976562 7.99993C-0.000976562 7.90137 0.0184504 7.80377 0.0561936 7.71272C0.0939369 7.62168 0.149256 7.53896 0.218988 7.4693L6.96899 0.719304C7.10972 0.578573 7.30059 0.499512 7.49961 0.499512C7.69864 0.499512 7.88951 0.578573 8.03024 0.719304C8.17097 0.860034 8.25003 1.05091 8.25003 1.24993C8.25003 1.44895 8.17097 1.63982 8.03024 1.78055L2.55993 7.24993H17.2496C17.4485 7.24993 17.6393 7.32895 17.7799 7.4696C17.9206 7.61025 17.9996 7.80102 17.9996 7.99993Z"
                  fill="white"
                />
              </svg>
              <span className="payment-method-icons" style={{ margin: 0 }} />
              label
            </div>
            <p
              style={{
                fontFamily: "Eudoxus Sans",
                fontSize: "14px",
                fontWeight: 700,
                lineHeight: "17.64px",
                letterSpacing: " -0.03em",
                background: "#37383A",
                marginTop: "10px",
                padding: "4px 9px",
                borderRadius: "5px",
                height: "26px",
              }}
            >
              Bank transfers (Options: 59)
            </p>
            <div
              className="bank-transfers-scroll"
              style={{
                height: "271px",
                overflow: "auto",
                paddingRight: "16px",
              }}
            >
              {depositOptions.map((option, index) => (
                <Box
                  key={index}
                  className="market-place-buy-sell payment-method-radio-btn"
                >
                  <div
                    className="yourself-option form-check"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    tabIndex={option.tabIndex}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    <span>{option.value}</span>
                    <div
                      className={`form-check-input check-input ${
                        paymentMethod === option.value ? "selected" : ""
                      }`}
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background:
                          paymentMethod === option.value
                            ? "#B6FF40"
                            : "transparent",
                        border: "2px solid #B6FF40",
                      }}
                    />
                  </div>
                </Box>
              ))}
            </div>
          </Box>
        ) : bankTransfer ? (
          <>
            <div
              style={{ width: "100%", display: "flex", flexWrap: "wrap" }}
              className="select-payment-method"
            >
              {props.children}
            </div>
          </>
        ) : null}
      </components.MenuList>
    );
  };

  return (
    <>
      <Grid container sx={{ gap: "20px", flexWrap: "nowrap" }}>
        <Grid item md={8}>
          <div
            style={{
              padding: "10px",
              width: "100%",
              fontSize: "14px",
            }}
          >
            Payment Method
          </div>
          <div
            style={{
              background: "#282A2C",
              padding: "8px 10px",
              borderRadius: "13px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: "8px",
              // justifyContent: "space-between",
              width: "100%",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21.5308 20.4696L16.8368 15.7765C18.1973 14.1431 18.8757 12.048 18.7309 9.92715C18.5861 7.80629 17.6293 5.82289 16.0593 4.38956C14.4894 2.95623 12.4274 2.18333 10.3021 2.23163C8.17687 2.27993 6.15205 3.14571 4.64888 4.64888C3.14571 6.15205 2.27993 8.17687 2.23163 10.3021C2.18333 12.4274 2.95623 14.4894 4.38956 16.0593C5.82289 17.6293 7.80629 18.5861 9.92715 18.7309C12.048 18.8757 14.1431 18.1973 15.7765 16.8368L20.4696 21.5308C20.5393 21.6005 20.622 21.6558 20.713 21.6935C20.8041 21.7312 20.9017 21.7506 21.0002 21.7506C21.0988 21.7506 21.1963 21.7312 21.2874 21.6935C21.3784 21.6558 21.4612 21.6005 21.5308 21.5308C21.6005 21.4612 21.6558 21.3784 21.6935 21.2874C21.7312 21.1963 21.7506 21.0988 21.7506 21.0002C21.7506 20.9017 21.7312 20.8041 21.6935 20.713C21.6558 20.622 21.6005 20.5393 21.5308 20.4696ZM3.75021 10.5002C3.75021 9.16519 4.14609 7.86015 4.88779 6.75011C5.62949 5.64008 6.6837 4.77492 7.9171 4.26403C9.1505 3.75314 10.5077 3.61946 11.8171 3.87991C13.1264 4.14036 14.3292 4.78324 15.2732 5.72724C16.2172 6.67125 16.8601 7.87398 17.1205 9.18335C17.381 10.4927 17.2473 11.8499 16.7364 13.0833C16.2255 14.3167 15.3603 15.3709 14.2503 16.1126C13.1403 16.8543 11.8352 17.2502 10.5002 17.2502C8.71061 17.2482 6.99488 16.5364 5.72944 15.271C4.464 14.0056 3.7522 12.2898 3.75021 10.5002Z"
                fill="white"
              />
            </svg>
            <div style={{ Width: "100%" }} className="payment-method-dropdown">
              <Select
                options={paymentMethods}
                onChange={handleChange}
                styles={customStyles}
                components={{
                  MenuList: CustomMenuList,
                  IndicatorsContainer: (props) => (
                    <CustomIndicatorsContainer
                      {...props}
                      onToggle={toggleMenu}
                      isOpen={menuIsOpen}
                    />
                  ),
                  SingleValue: CustomSingleValue,
                }}
                menuIsOpen={menuIsOpen}
                getOptionLabel={(e) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: "14px",
                      background: "#282A2C",
                      width: "100%",
                      fontSize: "14px",
                      fontFamily: "eudoxus sans",
                      fontWeight: 700,
                    }}
                  >
                    <span className="payment-method-icons" />
                    {e.label}
                  </div>
                )}
                getOptionValue={(e) => e.value}
                placeholder="Find your payment..."
                style={{ position: "unset" }}
              />
            </div>
          </div>
        </Grid>
        <Grid item md={4}>
          <div
            style={{
              padding: "10px",
              width: "100%",
              fontSize: "14px",
            }}
          >
            Preferred Currency
          </div>
          <Select
            defaultValue={selectedOptionAny}
            value={selectedOptionAny}
            className="select-dropdown payment-select-dropdown"
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
        </Grid>
      </Grid>
    </>
  );
};

export default PaymentMethodDropdown;
