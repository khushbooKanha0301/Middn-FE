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
  const [currentPre, setCurrentPre] = useState("USD");
  const [currentCurrency, setCurrentCurrencyPre] = useState("BTC");
  const [escrows, setEscrow] = useState(null);
  const acAddress = useSelector(userDetails);
  const { id } = useParams();
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [cryptos, setCrypto] = useState([]);
  const optionsDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const [amount, setAmount] = useState(0);
  const [loader, setLoader] = useState(true);
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

  const currencyCountry = () => {
    const result = countryInfo.find(
      (item) => item.currency.code === currentPre
    );
    return result?.flag;
  };

  const handleButtonClick = async (address) => {
    if (!amount) {
      dispatch(notificationFail("Please Enter Correct Amount."));
      return false;
    }
    if (!typeFilter) {
      dispatch(
        notificationFail(
          "Please Select I agree to Middin's escrow terms and conditions."
        )
      );
      return false;
    }
    const conversationRate = cryptoAmount?.amount || "0";
    const reqData = {
      user_address: address,
      escrow_id: id,
      amount: amount,
      country_currency: currentPre,
      crypto_currency: currentCurrency,
      conversation_amount: String(conversationRate),
    };

    await jwtAxios
      .post(`/trade/createTrade`, reqData)
      .then((escrowResult) => {
        if (escrowResult?.data?.newTrade) {
          setTimeout(() => {
            setLoader(false);
            navigate("/escrow-offer-buy", { state: { userAddress: address } });
          }, 1000);
        } else {
          dispatch(notificationFail("Something went wrong"));
        }
      })
      .catch((error) => {
        if (typeof error == "string") {
          dispatch(notificationFail(error));
        }
        if (error?.response?.data?.message === "") {
          dispatch(notificationFail("Invalid "));
        }
        if (error?.response?.data?.message) {
          dispatch(notificationFail(error?.response?.data?.message));
        }
      });
  };

  const handleFilterTypeChange = (value) => {
    // setTypeFilter(vehicle);
    setTypeFilter((prevType) => (prevType === value ? null : value));
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
      setLoader(true);
    }, 500),
    []
  );

  const handleChangeAmount = (value) => {
    if (currentCurrency && currentPre) {
      setAmount(value);
      const usdAmount = value;
      const data = {
        usdAmount: usdAmount,
        cryptoSymbol: currentCurrency,
        cryptoCountry: currentPre,
      };
      setTimeout(() => {
        setLoader(false);
        onChangeAmount(data);
      }, 800);

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
                  <Form.Control
                    type="text"
                    placeholder="Enter Amount"
                    onChange={(e) =>
                      handleChangeAmount(e.target.value.replace(/\D/g, ""))
                    }
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
                  </div>
                  <div className="country-select" ref={countryDropdownRef}>
                    <div
                      className="dropdownPersonalData form-select form-select-sm"
                      onClick={toggleCurrencyOptions}
                    >
                      <p className="text-white mb-0">
                        {cryptos.find((item) => item.symbol === currentCurrency)
                          ?.symbol || "BTC"}
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
                  {!cryptoAmount?.amount ? (
                    <>
                      <Form.Control
                        name="phone"
                        type="text"
                        value="0"
                        disabled
                      />
                    </>
                  ) : (
                    <>
                      {loader ? (
                        <>
                          <Form.Control
                            name="phone"
                            type="text"
                            value={
                              cryptoAmount?.amount ? cryptoAmount?.amount : "0"
                            }
                            disabled
                          />
                        </>
                      ) : (
                        <div className="middenLoader">
                          <img src={require("../../content/images/logo.png")} />
                          <p>welcome</p>
                          <div class="snippet" data-title="dot-flashing">
                            <div class="stage">
                              <div class="dot-flashing"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="d-flex align-items-center">
                    <img
                      src={currencyCountry()}
                      alt="Flag"
                      className="circle-data"
                    />
                  </div>
                  <div className="country-select" ref={optionsDropdownRef}>
                    <div
                      className="dropdownPersonalData form-select form-select-sm"
                      onClick={toggleOptions}
                    >
                      <p className="text-white mb-0">
                        {countryInfo.find(
                          (item) => item.currency.code === currentPre
                        )?.currency.code || "USD"}
                      </p>
                    </div>
                    {showOptions && (
                      <ul className="options">
                        {countryInfo.map((data) => (
                          <li
                            key={`${data.currency.code}`}
                            onClick={() => {
                              handleChangeAmount(amount);
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
                <div class="limit-txt-left-amount">
                  {cryptoAmount?.amount ? cryptoAmount?.amount + 0.02 : "0"} BNB
                </div>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Invoice Amount</div>
                <div class="limit-txt-left">
                  {cryptoAmount?.amount ? cryptoAmount?.amount : "0"} BNB
                </div>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Escrow fees </div>
                <div class="limit-txt-left">0.02 BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Total</div>
                <div class="limit-txt-left">
                  {cryptoAmount?.amount ? cryptoAmount?.amount + 0.02 : "0"} BNB
                </div>
              </div>
              <div className="d-flex main-limit">
                <Form.Group className="custom-input-seller">
                  <div
                    className="form-check"
                    onClick={() => handleFilterTypeChange(true)}
                  >
                    <div
                      className={`form-check-input ${
                        typeFilter === true ? "checked" : ""
                      }`}
                    />
                    <label class="form-check-label" for="vehicle1">
                      I agree to Middin's escrow terms and conditions.
                    </label>
                  </div>
                </Form.Group>
              </div>

              <div className="edit-btn ">
                <>
                  <Button
                    className="btn btn-success btn-width"
                    variant="success"
                    onClick={() => handleButtonClick(escrows?.user_address)}
                  >
                    Submit
                  </Button>
                </>

                {/* {loader ? (
                 
                ) : (
                  <div className="middenLoader">
                    <img src={require("../../content/images/logo.png")} />
                    <p>welcome</p>
                    <div class="snippet" data-title="dot-flashing">
                      <div class="stage">
                        <div class="dot-flashing"></div>
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg="4">
          <Card className="cards-dark mb-4">
            <Card.Body>
              <Card.Title as="h2">Information</Card.Title>
              <div className="d-flex align-items-center buyerDetails">
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

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="card-txt-left">Location</span>
                <strong class="card-txt">🇺🇸 United States</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="card-txt-left">Trades</span>
                <strong class="card-txt">1029</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="card-txt-left">Trading partners</span>
                <strong class="card-txt">720</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="card-txt-left">Feedback score</span>
                <strong class="card-txt">99%</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="card-txt-left">Typical finalization time</span>
                <strong class="card-txt">20 minutes</strong>
              </div>
            </Card.Body>
          </Card>

          <Card className="cards-dark">
            <Card.Body>
              <Card.Title as="h2">Summary</Card.Title>
              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="summery-txt-left">Price</span>
                <strong class="summery-txt">15.4905468 ETH</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="summery-txt-left">Limit</span>
                <strong class="summery-txt">0.1-0.6 BTC</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="summery-txt-left">Payment methods</span>
                <strong class="summery-txt">Ethereum</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="summery-txt-left">Network</span>
                <strong class="summery-txt"> Binance Smart Chain</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span class="summery-txt-left">Time constraints</span>
                <strong class="summery-txt">09:00 AM - 00:00 AM</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default EscrowDetails;
