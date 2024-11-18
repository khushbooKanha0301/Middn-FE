import React, { useState, useEffect } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import jwtAxios from "../../service/jwtAxios";
import { countryInfo } from "../../component/countryData";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { notificationFail } from "../../store/slices/notificationSlice";
import Swal from "sweetalert2/src/sweetalert2.js";
import { useSelector } from "react-redux";
import { userDetails } from "../../store/slices/AuthSlice";
import EditEscrow from "./EditEscrow";
import { useNavigate } from "react-router-dom";
import EscrowDetailLoader from "./EscrowDetailLoader";

import { database } from "../../helper/config";
import { firebaseStatus } from "../../helper/configVariables";
import { onValue, ref } from "firebase/database";

function EscrowDetails() {
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState();
  const [currentPre, setCurrentPre] = useState("USD");
  const [editEscrowModalShow, setEditEscrowModalShow] = useState(false);
  const countryDetails = useSelector((state) => state.auth.countryDetails);
  const [escrows, setEscrow] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const acAddress = useSelector(userDetails);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [otherStatus, setUserStatus] = useState(null);

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

  const currencyCountry = () => {
    const result = countryInfo.find(
      (item) => item.currency.code === currentPre
    );
    return result?.flag;
  };

  useEffect(() => {
    if (countryDetails) {
      setCountry(countryDetails?.country_name);
      setCountryCode(countryDetails?.country_code);
    }
  }, [countryDetails]);

  const editEscrowModalToggle = () =>
    setEditEscrowModalShow(!editEscrowModalShow);

  const handleFilterTypeChange = (vehicle) => {
    setTypeFilter((prevType) => (prevType === vehicle ? null : vehicle));
  };

  const flagUrl = countryCode
    ? `https://flagcdn.com/h40/${countryCode?.toLowerCase()}.png`
    : "";

  useEffect(() => {
    jwtAxios
      .get(`/escrows/getEscrowsById/${id}`)
      .then((res) => {
        if (res.data?.data.user_address === acAddress.account) {
          setEscrow(res.data?.data);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [acAddress.authToken]);

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
    <>
      {acAddress?.account === escrows?.user_address && (
        <div className="escrow-details">
          {loader ? (
            <EscrowDetailLoader />
          ) : (
            <Row>
              <Col lg="8">
                <Row>
                  <Col lg="12">
                    <div className="designCheap designCheapDetails">
                      <h4>{escrows?.object}</h4>
                      <p>{escrows?.description}</p>
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
                          name="phone"
                          type="text"
                          value="1"
                          maxLength="10"
                        />

                        <div className="d-flex align-items-center currency-info">
                          <div className="token-type">
                            <span className="token-icon"></span>
                          </div>
                          <p className="text-white mb-0">MID</p>
                        </div>
                        {/* <div className="country-select">
                          <div className="form-select form-select-sm" />
                        </div> */}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group className="form-group">
                      <Form.Label>Network </Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          name="phone"
                          type="text"
                          value="Polygon Chain"
                          maxLength="10"
                        />
                        {/* <div className="d-flex align-items-center currency-info">
                      <div className="token-type">
                        <span className="token-icon"></span>
                      </div>

                      <p className="text-white mb-0">USD</p>
                    </div> */}

                        <div className="country-select">
                          <div className="form-select form-select-sm" />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12" className="mt-2 mt-md-0 details-main-limit">
                    <div className="d-flex main-limit mid mb-3 limit">
                      <div className="limit-txt">Limit: </div>
                      <div className="limit-txt-right">800/4900 MID</div>
                    </div>

                    <div className="d-flex main-limit mid mb-2">
                      <h6>Detail</h6>
                    </div>

                    <div className="d-flex main-limit">
                      <div className="limit-txt-right-amount">
                        Payment Information
                      </div>
                    </div>

                    <div className="d-flex main-limit">
                      <div className="limit-txt-right">
                        Amount to transfer to Middn{" "}
                      </div>
                      <div className="limit-txt-left-amount">00 MID</div>
                    </div>

                    <div className="d-flex main-limit">
                      <div className="limit-txt-right">Invoice Amount</div>
                      <div className="limit-txt-left">00 MID</div>
                    </div>

                    <div className="d-flex main-limit">
                      <div className="limit-txt-right">Escrow fees </div>
                      <div className="limit-txt-left">00 MID</div>
                    </div>

                    <div className="d-flex main-limit">
                      <div className="limit-txt-right">Total</div>
                      <div className="limit-txt-left">00 MID</div>
                    </div>
                    <div className="d-flex main-limit">
                      <Form.Group className="custom-input-seller">
                        <div
                          className="form-check"
                          onClick={() => handleFilterTypeChange("Bike")}
                        >
                          <div
                            className={`form-check-input ${
                              typeFilter == "Bike" ? "checked" : ""
                            }`}
                          />
                          <label className="form-check-label" for="vehicle1">
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
                  <Card className="cards-dark">
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
                              escrows?.newImage
                                ? escrows?.newImage
                                : "No Profile"
                            }
                          />
                          {otherStatus === 1 && (
                            <div className="chat-status"></div>
                          )}
                          {otherStatus === 2 && (
                            <div className="chat-status-absent"></div>
                          )}
                          {otherStatus === 3 && (
                            <div className="chat-status-offline"></div>
                          )}
                        </div>
                        <div className="content ms-3">
                          <h6>
                            {escrows?.user_name
                              ? escrows?.user_name
                              : "John doe"}
                          </h6>
                          <span>(100%, 500+)</span>
                        </div>
                      </div>
                      <div className="buyer-details">
                        <Row className="align-items-center g-0">
                          <Col xs="7">
                            <label>Location</label>
                          </Col>
                          <Col>
                            {flagUrl && (
                              <img
                                src={flagUrl}
                                alt="Flag"
                                style={{ weight: "14px", height: "10px" }}
                              />
                            )}{" "}
                            <span>{country && country}</span>
                          </Col>
                        </Row>
                        <Row className="align-items-center g-0">
                          <Col xs="7">
                            <label>Trades</label>
                          </Col>
                          <Col>1029</Col>
                        </Row>
                        <Row className="align-items-center g-0">
                          <Col xs="7">
                            <label>Trading partners</label>
                          </Col>
                          <Col>720</Col>
                        </Row>
                        <Row className="align-items-center g-0">
                          <Col xs="7">
                            <label>Feedback score</label>
                          </Col>
                          <Col>99%</Col>
                        </Row>
                        <Row className="align-items-center g-0">
                          <Col xs="7">
                            <label>Account created</label>
                          </Col>
                          <Col>Yesterday</Col>
                        </Row>
                        <Row className="align-items-center g-0">
                          <Col xs="7">
                            <label>Typical finalization time</label>
                          </Col>
                          <Col>20 minutes</Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                </Card>

                <Card className="cards-dark">
                  <Card.Body>
                    <Card.Title as="h2">Summary</Card.Title>
                    <div className="buyer-details">
                      <Row className="align-items-center g-0">
                        <Col xs="7">
                          <label>Price</label>
                        </Col>
                        <Col>00 MID</Col>
                      </Row>
                      <Row className="align-items-center g-0">
                        <Col xs="7">
                          <label>Limit</label>
                        </Col>
                        <Col>800/4900 MID</Col>
                      </Row>
                      <Row className="align-items-center g-0">
                        <Col xs="7">
                          <label>Payment methods</label>
                        </Col>
                        <Col>MID</Col>
                      </Row>
                      <Row className="align-items-center g-0">
                        <Col xs="7">
                          <label>Network</label>
                        </Col>
                        <Col>Polygon Chain</Col>
                      </Row>
                      <Row className="align-items-center g-0">
                        <Col xs="7">
                          <label>Time constraints</label>
                        </Col>
                        <Col>24 Hours</Col>
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          <EditEscrow
            show={editEscrowModalShow}
            onHide={() => setEditEscrowModalShow(false)}
            id={id}
          />
        </div>
      )}
    </>
  );
}

export default EscrowDetails;
