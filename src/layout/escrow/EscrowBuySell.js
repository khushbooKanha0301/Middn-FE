import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import jwtAxios from "../../service/jwtAxios";
import { useSelector } from "react-redux";
import { userDetails } from "../../store/slices/AuthSlice";
import { notificationFail } from "../../store/slices/notificationSlice";
import { database } from "../../helper/config";
import { firebaseStatus } from "../../helper/configVariables";
import { onValue, ref } from "firebase/database";
import EscrowSeller from "../../layout/escrow/EscrowSeller";

export const EscrowBuyer = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const [currentPre, setCurrentPre] = useState("USD");
  const [currentCurrency, setCurrentCurrencyPre] = useState("MID");
  const [escrows, setEscrow] = useState(null);
  const acAddress = useSelector(userDetails);
  const [typeFilter, setTypeFilter] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const optionsDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const [amount, setAmount] = useState(0);
  const [readyForPayment, setReadyForPayment] = useState(true);
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const networks = [
    { value: "Polygon Chain", label: "Polygon Chain" },
    { value: "Ethereum", label: "Ethereum" },
  ];
  const [network, setNetwork] = useState("Polygon Chain");
  const [otherStatus, setUserStatus] = useState(null);
  const [isSeller, setIsSeller] = useState(false);

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
    const conversationRate = cryptoAmount || "0";

    const reqData = {
      user_address: address,
      trade_address: acAddress?.account, // login user,
      escrow_id: id,
      escrow_type: escrows.escrow_type,
      amount: amount,
      country_currency: currentPre,
      crypto_currency: currentCurrency,
      conversation_amount: String(conversationRate),
      trade_status: 1,
    };

    await jwtAxios
      .post(`/trade/createTrade`, reqData)
      .then((escrowResult) => {
        if (escrowResult?.data?.newTrade) {
          setIsSeller(true);
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
  }, [acAddress?.authToken]);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleSelectedClick = (value) => {
    setNetwork(value);
    setShowOptions(false);
  };

  const handleChangeAmount = (value) => {
    if (currentCurrency && currentPre) {
      setAmount(value);
      const usdAmount = value;
      const data = {
        usdAmount: usdAmount,
        cryptoSymbol: currentCurrency,
        cryptoCountry: currentPre
      };
    }
  };

  const handledAmountFocus = () => {
    if (!currentCurrency) {
      setReadyForPayment(true);
      dispatch(notificationFail("Please Select Crypto Currency"));
    }
  };

  useEffect(() => {
    if (escrows && escrows?.user_address) {
      const starCountRef = ref(
        database,
        firebaseStatus.CHAT_USERS + escrows?.user_address
      );
      onValue(starCountRef, (snapshot) => {
        setUserStatus(snapshot.val()?.isOnline);
      });
    }
  }, [escrows]);

  return (
    <div className="escrow-details">
      {isSeller ? (
        <EscrowSeller id={id} />
      ) : (
        <>
          <Row>
            <Col lg="8">
              <Row>
                <Col lg="12">
                  <div className="designCheap">
                    <h4>{escrows?.object}</h4>
                    <p>{escrows?.description}</p>
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
                      />
                      <div className="d-flex align-items-center">
                        {currentCurrency ? (
                          <div className="token-type">
                            <span className="token-icon"></span>
                          </div>
                        ) : (
                          "No Flag"
                        )}
                        <p className="text-white mb-0">MID</p>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Network </Form.Label>
                    <div className="d-flex align-items-center">
                      <div
                        className="country-select network-select"
                        ref={countryDropdownRef}
                      >
                        <div
                          className="form-select"
                          onClick={toggleOptions}
                          aria-label="Polygon Chain"
                        >
                          {networks.find((cat) => cat.value === network)
                            ?.label || "Polygon Chain"}
                        </div>
                        {showOptions && (
                          <ul className="options wd">
                            {networks.map((network) => (
                              <li
                                key={network?.value}
                                onClick={() =>
                                  handleSelectedClick(network?.value)
                                }
                              >
                                {network?.label}
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
                    <div className="limit-txt">Limit &nbsp;: &nbsp;</div>
                    <div className="limit-txt-right">0.1-0.6 MID</div>
                  </div>

                  <div className="d-flex main-limit mb-2">
                    <h6>Detail</h6>
                  </div>

                  <div className="d-flex main-limit">
                    <div className="limit-txt-right-amount">
                      Payment Information
                    </div>
                  </div>

                  <div className="d-flex main-limit">
                    <div className="limit-txt-right">Amount to transfer </div>
                    <div className="limit-txt-left-amount">
                      {amount || "0"}{" "}
                      {currentCurrency ? currentCurrency : "MID"}
                    </div>
                  </div>

                  <div className="d-flex main-limit">
                    <div className="limit-txt-right">Invoice Amount</div>
                    <div className="limit-txt-left">
                      {amount || "0"}{" "}
                      {currentCurrency ? currentCurrency : "MID"}
                    </div>
                  </div>

                  <div className="d-flex main-limit">
                    <div className="limit-txt-right">Escrow fees </div>
                    <div className="limit-txt-left color-free">FREE</div>
                  </div>

                  <div className="d-flex main-limit">
                    <div className="limit-txt-right">Total</div>
                    <div className="limit-txt-left">
                      {amount || "0"}{" "}
                      {currentCurrency ? currentCurrency : "MID"}
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
                        <label className="form-check-label" for="vehicle1">
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
                        alt={
                          escrows?.newImage ? escrows?.newImage : "No Profile"
                        }
                      />
                      {/* <span className="circle"></span> */}
                      {otherStatus === 1 && <div className="chat-status"></div>}
                      {otherStatus === 2 && (
                        <div className="chat-status-absent"></div>
                      )}
                      {otherStatus === 3 && (
                        <div className="chat-status-offline"></div>
                      )}
                    </div>
                    <div className="content ms-3">
                      <h6>
                        {escrows?.user_name ? escrows?.user_name : "John doe"}
                      </h6>
                      <span>(100%, 500+)</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="card-txt-left">Location</span>
                    <strong className="card-txt">🇺🇸 United States</strong>
                  </div>

                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="card-txt-left">Trades</span>
                    <strong className="card-txt">1029</strong>
                  </div>

                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="card-txt-left">Trading partners</span>
                    <strong className="card-txt">720</strong>
                  </div>

                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="card-txt-left">Feedback score</span>
                    <strong className="card-txt">99%</strong>
                  </div>

                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="card-txt-left">
                      Typical finalization time
                    </span>
                    <strong className="card-txt">20 minutes</strong>
                  </div>
                </Card.Body>
              </Card>

              <Card className="cards-dark">
                <Card.Body>
                  <Card.Title as="h2">Summary</Card.Title>
                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="summery-txt-left">Price</span>
                    <strong className="summery-txt">{amount || "0"} MID</strong>
                  </div>

                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="summery-txt-left">Limit</span>
                    <strong className="summery-txt">0.1-0.6 MID</strong>
                  </div>

                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="summery-txt-left">Payment methods</span>
                    <strong className="summery-txt">MID</strong>
                  </div>

                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="summery-txt-left">Network</span>
                    <strong className="summery-txt">
                      {network || "Polygon Chain"}
                    </strong>
                  </div>

                  <div className="d-flex justify-content-between align-items-center buyerDetails">
                    <span className="summery-txt-left">Time constraints</span>
                    <strong className="summery-txt">24 Hours</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default EscrowBuyer;
