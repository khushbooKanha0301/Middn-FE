import { debounce } from "lodash";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { countryInfo } from "../accountSetting/countryData";
import { useDispatch } from "react-redux";
import { defineCurrency } from "../../store/slices/countrySettingSlice";
import { useParams } from "react-router-dom";
import jwtAxios from "../../service/jwtAxios";
import { useSelector } from "react-redux";
import { userDetails } from "../../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { notificationFail } from "../../store/slices/notificationSlice";
import { convertToCrypto } from "../../store/slices/currencySlice";

// USD , EUR , AUD , GBP

function EscrowDetails() {
  const dispatch = useDispatch();
  const [countryCallingCode, setCountryCallingCode] = useState("");
  const [currentPre, setCurrentPre] = useState("USD");
  const [currentCurrency, setCurrentCurrencyPre] = useState("BTC");
  const [escrows, setEscrow] = useState(null);
  const acAddress = useSelector(userDetails);
  const { id } = useParams();
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [cryptos, setCrypto] = useState([]);
  const optionsDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);

  const [amount, setAmount] = useState(0);
  const [readyForPayment, setReadyForPayment] = useState(true);
 
  const { cryptoAmount } = useSelector((state) => state?.cuurencyReducer);
 
  const getAllEscrow = async () => {
    try {
      const res = await jwtAxios.get(`/auth/getCryptoDetails`);
      setCrypto(res?.data?.data); // Update the state with the new array
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllEscrow();
  }, []);

  const handleGlobalClick = (event) => {
    // Close dropdowns if the click is outside of them
    if (
      countryDropdownRef.current &&
      !countryDropdownRef.current.contains(event.target) &&
      optionsDropdownRef.current &&
      !optionsDropdownRef.current.contains(event.target)
    ) {
       setShowCurrencyOptions(false);
      // setShowCountryOptions(false);
      setShowOptions(false);
    }
  };

  useEffect(() => {
    // Add global click event listener
    document.addEventListener("click", handleGlobalClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  const onChange = (e) => {
    // } else if (e.target.name === "currentPre") {
    //   setCurrentPre(e.target.value);
    // } else if (e.target.name === "city") {
    //   setCity(e.target.value);
    // }
  };

  const currencyCountry = () => {
    const result = countryInfo.find(
      (item) => item.currency.code === currentPre
    );
    return result?.flag;
  };

  const handleButtonClick = (address) => {
    navigate("/escrow-offer-buy", { state: { userAddress: address } });
  };
  const handleFilterTypeChange = (vehicle) => {
    // setTypeFilter(vehicle);
    setTypeFilter((prevType) => (prevType === vehicle ? null : vehicle));
  };

  useEffect(() => {
    jwtAxios
      .get(`/escrows/getEscrowsById/${id}`)
      .then((res) => {
        setEscrow(res.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [acAddress.authToken]);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
    setShowCurrencyOptions(false);
  };
  const toggleCurrencyOptions = () => {
    setShowCurrencyOptions(!showCurrencyOptions);
    setShowOptions(false);
  };

  const onChangeAmount = useCallback(
    debounce((data) => {
      dispatch(convertToCrypto(data));
    }, 500),
    []
  );

  const handleChangeAmount = (value) => {
    if (currentCurrency) {
      setAmount(value);
      const usdAmount = value;
      const data = {
        usdAmount: usdAmount,
        cryptoSymbol: currentCurrency,
        cryptoCountry: currentPre,
      };
      onChangeAmount(data);
      if (value) {
        if (value > 0) {
          setReadyForPayment(false);
        } else {
          setReadyForPayment(true);
          dispatch(notificationFail("Please Enter Correct Amount"));
        }
      } else {
        setReadyForPayment(true);
      }
    }
  };

  const handledAmountFocus = () => {
    if (!currentCurrency) {
      setReadyForPayment(true);
      dispatch(notificationFail("Please Select Crypto Currency"));
    }
  };

  return (
    <div className="escrow-details">
      <Row>
        <Col lg="8">
          <Row>
            <Col lg="12">
              <div className="designCheap">
                <h4>Cheap for you</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Commodo lentesque consectetur adipiscing elit.Lorem ipsum
                  dolor sit amet, consectetur adipiscing elit. Commodo lentesque
                  consectetur adipiscing elit.
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Amount</Form.Label>
                <div className="d-flex align-items-center">
                  {/* <Form.Control
                    placeholder={countryCallingCode}
                    name="phone"
                    type="text"
                    value="1"
                    onChange={(e) => {
                      onChange(e);
                    }}
                    maxLength="10"
                  /> */}
                  <Form.Control
                    type="text"
                    placeholder="Enter Amount"
                    onChange={(e) => handleChangeAmount(e.target.value.replace(/\D/g, ""))}
                    onFocus={handledAmountFocus}
                    value={amount}
                    // disabled={!selectedCrypto}
                  />
                  <div className="d-flex align-items-center">
                    {currentCurrency ? (
                      <div className="token-type">
                        <span className="token-icon"></span>
                      </div>
                    ) : (
                      "No Flag"
                    )}
                    {/* <p className="text-white mb-0">
                      {
                        countryInfo.find(
                          (item) => item.currency.code === currentPre
                        )?.currency.code
                      }
                    </p> */}
                     {/* <Form.Select
                      size="sm"
                      value={currentPre}
                      onChange={(e) => {
                        setCurrentPre(e.target.value);
                        dispatch(defineCurrency(e.target.value));
                      }}
                    >
                      {countryInfo.map((data) => (
                        <option
                          value={`${data.currency.code}`}
                          key={`${data.currency.code}`}
                        >
                          {data.currency?.code}
                        </option>
                      ))}
                    </Form.Select> */}

                  </div>
                  <div className="country-select" ref={countryDropdownRef}>
                    <div
                      className="dropdownPersonalData form-select form-select-sm"
                      onClick={toggleCurrencyOptions}
                    >
                      <p className="text-white mb-0">
                        {
                          cryptos.find(
                            (item) => item.symbol === currentCurrency
                          )?.symbol
                        }
                      </p>
                    </div>
                    {showCurrencyOptions && (
                      <ul className="options">
                        {cryptos.map((data) => (
                          <li
                            key={`${data.symbol}`}
                            onClick={() => {
                              handleChangeAmount(amount);
                              setCurrentCurrencyPre(data.symbol);
                              dispatch(defineCurrency(data.symbol));
                            }}
                            onFocus={handledAmountFocus}
                          >
                            {data.symbol}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Conversation </Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    name="phone"
                    type="text"
                    value={cryptoAmount?.amount ? cryptoAmount?.amount : "0"}
                    disabled
                  />
                 
                  <div className="d-flex align-items-center">
                    <img
                      src={currencyCountry()}
                      alt="Flag"
                      className="circle-data"
                    />

                    {/* <p className="text-white mb-0">
                      {
                        countryInfo.find(
                          (item) => item.currency.code === currentPre
                        )?.currency.code
                      }
                    </p> */}
                    {/* <Form.Select
                      size="sm"
                      value={currentPre}
                      onChange={(e) => {
                        setCurrentPre(e.target.value);
                        dispatch(defineCurrency(e.target.value));
                      }}
                    >
                      {countryInfo.map((data) => (
                        <option
                          value={`${data.currency.code}`}
                          key={`${data.currency.code}`}
                        >
                          {data.currency?.code}
                        </option>
                      ))}
                    </Form.Select> */}
                  </div>
                  <div className="country-select" ref={optionsDropdownRef}>
                    <div
                      className="dropdownPersonalData form-select form-select-sm"
                      onClick={toggleOptions}
                    >
                      <p className="text-white mb-0">
                        {
                          countryInfo.find(
                            (item) => item.currency.code === currentPre
                          )?.currency.code
                        }
                      </p>
                    </div>
                    {showOptions && (
                      <ul className="options">
                        {countryInfo.map((data) => (
                          <li
                            key={`${data.currency.code}`}
                            onClick={() => {
                              handleChangeAmount(amount)
                              setCurrentPre(data.currency.code);
                              dispatch(defineCurrency(data.currency.code));
                            }}
                            onFocus={handledAmountFocus}
                          >
                            {data.currency?.code}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <div className="d-flex main-limit mb-3">
                <div class="limit-txt">Limit: </div>
                <div class="limit-txt-right">3BTC</div>
              </div>

              <div className="d-flex main-limit mb-2">
                <h6>Detail</h6>
              </div>

              <div className="d-flex main-limit">
                <label>Payment Information</label>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Amount to transfer to Middn </div>
                <div class="limit-txt-left-amount">{cryptoAmount?.amount ? (cryptoAmount?.amount + 0.02) : "0"} BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Invoice Amount</div>
                <div class="limit-txt-left">{cryptoAmount?.amount ? cryptoAmount?.amount : "0"} BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Escrow fees </div>
                <div class="limit-txt-left">0.02 BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Total</div>
                <div class="limit-txt-left">{cryptoAmount?.amount ? (cryptoAmount?.amount + 0.02) : "0"} BNB</div>
              </div>
              <div className="d-flex main-limit">
                <Form.Group className="custom-input-seller">
                  {/* <div className="checkbox">
                  <input
                    type="checkbox"
                    id="vehicle1"
                    name="vehicle1"
                    value="Bike"
                  />
                  <label for="vehicle1">
                    I agree to Middin's escrow terms and conditions.
                  </label>
                </div> */}

                  <div
                    className="form-check"
                    onClick={() => handleFilterTypeChange("Bike")}
                  >
                    <div
                      className={`form-check-input ${
                        typeFilter === "Bike" ? "checked" : ""
                      }`}
                    />
                    <label class="form-check-label" for="vehicle1">
                      I agree to Middin's escrow terms and conditions.
                    </label>
                  </div>
                </Form.Group>
              </div>

              <div className="edit-btn ">
                {/* <Button className="btn btn-success btn-width" variant="success" onClick={() => handleButtonClick(escrows?.user_address)}>
                    Submit
                  </Button> */}
                <Button className="btn btn-success btn-width" variant="success">
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg="4">
          <Card className="cards-dark mb-4">
            <Card.Body>
              <Card.Title as="h2">Information</Card.Title>
              <div className="d-flex align-items-center">
                <div className="chat-image">
                  <img
                    src={
                      escrows?.newImage
                        ? escrows?.newImage
                        : require("../../content/images/avatar.png")
                    }
                    alt={escrows?.newImage ? escrows?.newImage : "No Profile"}
                  />
                  <span className="circle"></span>
                </div>
                <div className="content ms-3">
                  <h6>
                    {escrows?.user_name ? escrows?.user_name : "John doe"}
                  </h6>
                  <span>(100%, 500+)</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center expired">
                <div class="card-txt-left">Location</div>
                <div class="card-txt">🇺🇸 United States</div>
              </div>

              <div className="d-flex justify-content-between align-items-center expired">
                <div class="card-txt-left">Trades</div>
                <div class="card-txt">1029</div>
              </div>

              <div className="d-flex justify-content-between align-items-center expired">
                <div class="card-txt-left">Trading partners</div>
                <div class="card-txt">720</div>
              </div>
              <div className="d-flex justify-content-between align-items-center expired">
                <div class="card-txt-left">Feedback score</div>
                <div class="card-txt">99%</div>
              </div>
              <div className="d-flex justify-content-between align-items-center expired">
                <div class="card-txt-left">Typical finalization time</div>
                <div class="card-txt">20 minutes</div>
              </div>
            </Card.Body>
          </Card>

          <Card className="cards-dark">
            <Card.Body>
              <Card.Title as="h2">Summary</Card.Title>
              <div className="d-flex expired">
                <div class="card-txt-left">Price</div>
                <div class="card-txt">15.4905468 ETH</div>
              </div>

              <div className="d-flex expired">
                <div class="card-txt-left">Limit</div>
                <div class="card-txt">0.1-0.6 BTC</div>
              </div>

              <div className="d-flex expired">
                <div class="card-txt-left">Payment methods</div>
                <div class="card-txt">Ethereum</div>
              </div>
              <div className="d-flex expired">
                <div class="card-txt-left">Network</div>
                <div class="card-txt"> Binance Smart Chain</div>
              </div>
              <div className="d-flex expired">
                <div class="card-txt-left">Time constraints</div>
                <div class="card-txt">09:00 AM - 00:00 AM</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default EscrowDetails;
