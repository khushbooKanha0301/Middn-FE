import React, { useState, useEffect } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import jwtAxios from "../../service/jwtAxios";
import { countryInfo } from "../accountSetting/countryData";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { notificationFail } from "../../store/slices/notificationSlice";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useSelector } from "react-redux";
import { userDetails } from "../../store/slices/AuthSlice";
import EditEscrow from "./EditEscrow";
import { useNavigate } from "react-router-dom";

function EscrowDetails() {
  const dispatch = useDispatch();
  const [countryCallingCode, setCountryCallingCode] = useState("");
  const [currentPre, setCurrentPre] = useState("USD");
  const [editEscrowModalShow, setEditEscrowModalShow] = useState(false);
  const [escrows, setEscrow] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [loader, setLoader] = useState(true);
  const acAddress = useSelector(userDetails);
  const navigate = useNavigate();
  const { id } = useParams();

  const deleteUserKyc = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Delete this Escrow?",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#808080",
      confirmButtonText: "Delete",
      customClass: {
        popup: "suspend",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          jwtAxios
            .put(`/escrows/deleteEscrows/${id}`)
            .then((res) => {
              Swal.fire("Deleted!", "Escrow deleted...", "danger");
              if (res) {
                navigate("/");
              }
            })
            .catch((err) => {
              if (typeof err == "string") {
                dispatch(notificationFail(err));
              } else {
                dispatch(notificationFail(err?.response?.data?.message));
              }
            });
        }
      }
    });
  };

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

  const editEscrowModalToggle = () =>
    setEditEscrowModalShow(!editEscrowModalShow);

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

  return (
    <div className="escrow-details">
      <Row>
        <Col lg="8">
          <Row>
            <Col lg="12">
              <div className="designCheap">
                <h4>Design for cheap</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Commodo lentesque consectetur adipiscing elit.Lorem ipsum
                  dolor sit amet, consectetur adipiscing elit. Commodo lentesque
                  consectetur adipiscing elit.
                </p>
                <div className="edit-btn ">
                  <Button
                    className="btn btn-success btn-width"
                    variant="success"
                    onClick={editEscrowModalToggle}
                  >
                    Edit
                  </Button>
                  <Button
                    className="btn btn-danger btn-width"
                    variant="success"
                    onClick={() => deleteUserKyc(id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Amount</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    placeholder={countryCallingCode}
                    name="phone"
                    type="text"
                    value="1"
                    maxLength="10"
                  />

                  <div className="d-flex align-items-center currency-info">
                    {/* <div className="currency-type">
                      <span className="currency-flag">
                        <img
                          className="currency-flag"
                          src={require("../../content/images/bitcoin.png")}
                          alt="Bitcoin"
                        />
                      </span>
                      BTC
                    </div> */}

                    <div className="token-type">
                      <span className="token-icon"></span>
                    </div>

                    <p className="text-white mb-0">BTC</p>

                    {/* <div className="text-white mb-0 currency-amount">
                      USD
                    </div> */}
                  </div>

                  {/* <div className="d-flex align-items-center">
                    {currentPre ? (
                      <img
                        src={currencyCountry()}
                        alt="Flag"
                        className="circle-data"
                      />
                    ) : (
                      "No Flag"
                    )}
                    <p className="text-white mb-0">
                      {
                        countryInfo.find(
                          (item) => item.currency.code === currentPre
                        )?.currency.code
                      } BTC
                    </p>
                  </div> */}
                  <div className="country-select">
                    <div class="form-select form-select-sm" />
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
                </div>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Conversation </Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    placeholder={countryCallingCode}
                    name="phone"
                    type="text"
                    value="1"
                    // onChange={(e) => {
                    //   onChange(e);
                    // }}
                    maxLength="10"
                  />
                  {/* <div className="d-flex align-items-center">
                    {currentPre ? (
                      // <img
                      //   src={currencyCountry()}
                      //   alt="Flag"
                      //   className="circle-data"
                      // />   
                    ) : (
                      "No Flag"
                    )}
                    <p className="text-white mb-0">
                      {
                        // countryInfo.find(
                        //   (item) => item.currency.code === currentPre
                        // )?.currency.code
                      }
                    </p>
                  </div> */}

                  <div className="d-flex align-items-center currency-info">
                    <div className="token-type">
                      <span className="token-icon"></span>
                    </div>

                    <p className="text-white mb-0">USD</p>
                    {/* <div className="currency-type">
                      <span className="currency-flag">
                        <img
                          className="currency-flag"
                          src={require("../../content/images/usd-icon-resized.png")}
                          alt="Bitcoin"
                        />
                      </span>
                      USD
                    </div> */}
                    {/* <div className="text-white mb-0 currency-amount">
                      USD
                    </div> */}
                  </div>

                  <div className="country-select">
                    <div class="form-select form-select-sm" />
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
                <div class="limit-txt-left-amount">105,02 BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Invoice Amount</div>
                <div class="limit-txt-left">105,00 BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Escrow fees </div>
                <div class="limit-txt-left">0,02 BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div class="limit-txt-right">Total</div>
                <div class="limit-txt-left">105,02 BNB</div>
              </div>
              <div className="d-flex main-limit">
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
                        typeFilter == "Bike" ? "checked" : ""
                      }`}
                    />
                    <label class="form-check-label" for="vehicle1">
                      I agree to Middin's escrow terms and conditions.
                    </label>
                  </div>
                </Form.Group>
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
      <EditEscrow
        show={editEscrowModalShow}
        onHide={() => setEditEscrowModalShow(false)}
        id={id}
      />
    </div>
  );
}

export default EscrowDetails;
