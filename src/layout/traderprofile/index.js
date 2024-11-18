import React, { useState, useEffect } from "react";
import { Col, Row, Card, Button, Tabs, Tab, Form } from "react-bootstrap";
import EditProfileView from "../../component/EditProfile";
import MessageView from "../../component/Message";
import StarRating from "../../component/StarRating";
import Select from "react-select";
import {
  InstagramIcon,
  TelegramIcon,
  MessageIcon,
  SimpleCheckIcon,
  TwitterIcon,
  StarFillIcon,
  StarEmptyIcon,
} from "../../component/SVGIcon";
import { useSelector } from "react-redux";
import {
  userDetails,
  userGetData,
  userGetFullDetails,
} from "../../store/slices/AuthSlice";
import LoginView from "../../component/Login";
import { useNavigate, useParams } from "react-router-dom";
import jwtAxios from "../../service/jwtAxios";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { InfoLoader, ProfileLoader } from "./Loader";
import { TableLoader } from "../../helper/Loader";
import { notificationSuccess } from "../../store/slices/notificationSlice";
import { database } from "../../helper/config";
import { firebaseStatus } from "../../helper/configVariables";
import { onValue, ref, get } from "firebase/database";
import ReportUserView from "../../component/ReportUser";
import PaginationComponent from "../../component/Pagination";
import CreateEscrowView from "../../layout/escrow/CreateEscrow";
import KYCVerification from "../../component/KYCVerification";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const data = [
  {
    value: 1,
    text: "Newest",
  },
  {
    value: 2,
    text: "Standard",
  },
  {
    value: 3,
    text: "Latter",
  },
];

export const TraderProfile = (props) => {
  const [user, setUser] = useState("");
  let PageSize = 5;
  const dispatch = useDispatch();
  const userData = useSelector(userDetails);
  let loginuserdata = useSelector(userGetFullDetails);
  const navigate = useNavigate();
  const [country, setCountry] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [createEscrowModalShow, setCreateEscrowModalShow] = useState(false);
  const [connectWalletmodalShow, setconnectWalletModalShow] = useState(false);
  const countryDetails = useSelector((state) => state.auth.countryDetails);

  const [selectedOptionStatus, setSelectedOptionStatus] = useState(data[0]);
  const handleChangeStatus = (e) => {
    setSelectedOptionStatus(e);
  };

  const modalToggle = () => setModalShow(!modalShow);
  const connectWalletModalToggle = () =>
    setconnectWalletModalShow(!connectWalletmodalShow);

  const [reportModelOpen, setReportModelOpen] = useState(false);
  const reportModalToggle = () => setReportModelOpen(!reportModelOpen);
  const [editProfileModalShow, setEditProfileModalShow] = useState(false);
  const editProfileModalToggle = () =>
    setEditProfileModalShow(!editProfileModalShow);
  const [countryCode, setCountryCode] = useState("");
  const isAuth = userData.authToken;
  const [isSign, setIsSign] = useState(null);
  const [loader, setLoader] = useState(true);
  const { address } = useParams();
  const [isAuthAddress, setisAuthAddress] = useState(true);
  const [otherUserData, setOtherUserData] = useState({});
  const [modalKycShow, setModalKYCShow] = useState(false);
  const [kycSubmitted, setKYCSubmitted] = useState(false);
  const [escrowLoading, setEscrowLoading] = useState(true);
  const [activeEscrows, setActiveEscrows] = useState([]);
  const [totalActiveEscrowCount, setTotalActiveEscrowCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [otherStatus, setUserStatus] = useState(null);
  const [userStatuses, setUserStatuses] = useState([]);

  const createEscrowModalToggle = () => {
    if (userData.authToken) {
      setCreateEscrowModalShow(!createEscrowModalShow);
    } else {
      setconnectWalletModalShow(true);
    }
  };

  const modalKycToggle = async () => {
    setModalKYCShow(!modalShow);
  };

  useEffect(() => {
    if (userData?.userid) {
      dispatch(userGetData(userData.userid)).unwrap();
    }
  }, [userData?.userid]);

  useEffect(() => {
    if (loginuserdata) {
      getActiveEscrows();
    }
  }, [loginuserdata]);

  const getActiveEscrows = async () => {
    if (currentPage) {
      try {
        const res = await jwtAxios.get(
          `/auth/activeEscrows/${address}?page=${currentPage}&pageSize=${PageSize}`
        );
        setEscrowLoading(false);
        setActiveEscrows(res.data?.data); // Update the state with the new array
        setTotalActiveEscrowCount(res.data?.escrowsCount);

        let statuses = await Promise.all(
          res.data?.data.map(async (e) => {
            const starCountRef = ref(
              database,
              firebaseStatus.CHAT_USERS + e.user_address
            );
            // Use await to wait for the onValue callback
            const snapshot = await get(starCountRef);
            return snapshot.exists() ? snapshot.val()?.isOnline : 4;
          })
        );
        setUserStatuses(statuses);
      } catch (err) {
        setEscrowLoading(true);
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getActiveEscrows();
  }, [currentPage]);

  useEffect(() => {
    if (countryDetails) {
      setCountry(countryDetails?.country_name);
      setCountryCode(countryDetails?.country_code);
    }
  }, [countryDetails]);

  const flagUrl = countryCode
    ? `https://flagcdn.com/h40/${countryCode?.toLowerCase()}.png`
    : "";

  const handleAccountAddress = (address) => {
    setIsSign(false);
  };

  const checkAddress = async () => {
    await jwtAxios
      .get(`/auth/getuser/${address}`)
      .then((response) => {
        setOtherUserData({
          ...response.data.user,
          imageUrl: response.data.docUrl,
        });
        setTimeout(() => {
          setLoader(false);
        }, 2000);
      })
      .catch((e) => {
        navigate("/");
        setLoader(false);
        dispatch(notificationSuccess("Something went wrong"));
      });
  };

  useEffect(() => {
    if (address) {
      if (address.length !== 42) {
        setLoader(false);
        navigate("/");
      } else {
        if (loginuserdata && address === userData?.account) {
          setisAuthAddress(true);
          setLoader(false);
        } else {
          setisAuthAddress(false);
          if (!otherUserData?.wallet_address && !isAuthAddress) {
            checkAddress();
          }
        }
      }
    }
  }, [address, loginuserdata, otherUserData, isAuthAddress, navigate]);

  useEffect(() => {
    if (otherUserData && otherUserData?.wallet_address) {
      const starCountRef = ref(
        database,
        firebaseStatus.CHAT_USERS + otherUserData?.wallet_address
      );
      onValue(starCountRef, (snapshot) => {
        setUserStatus(snapshot.val()?.isOnline);
      });
    }
    if (loginuserdata && userData?.account) {
      const starCountRef = ref(
        database,
        firebaseStatus.CHAT_USERS + userData?.account
      );
      onValue(starCountRef, (snapshot) => {
        setUserStatus(snapshot.val()?.isOnline);
      });
    }
  }, [otherUserData, loginuserdata]);

  return (
    <div className="profile-view">
      <Row>
        <Col lg="8">
          <div className="profile-details">
            {loader ? (
              <ProfileLoader />
            ) : (
              <Row className="g-0">
                <Col>
                  <Box sx={{ display: "flex" }}>
                    <Box sx={{ mr: { xs: "19px", md: "25px" } }}>
                      {isAuthAddress ? (
                        <Button
                          variant="link"
                          className="profile-image"
                          onClick={editProfileModalToggle}
                        >
                          <img
                            src={
                              loginuserdata?.imageUrl
                                ? loginuserdata?.imageUrl
                                : require("../../content/images/avatar.png")
                            }
                            alt={
                              loginuserdata?.imageUrl
                                ? loginuserdata?.imageUrl
                                : "No Profile"
                            }
                          />
                          {otherStatus === 1 && (
                            <div className="profile-dots profile-status"></div>
                          )}
                          {otherStatus === 2 && (
                            <div className="profile-dots profile-status-absent"></div>
                          )}
                          {otherStatus === 3 && (
                            <div className="profile-dots profile-status-offline"></div>
                          )}
                        </Button>
                      ) : (
                        <Button variant="link" className="profile-image">
                          <img
                            src={
                              otherUserData?.imageUrl
                                ? otherUserData?.imageUrl
                                : require("../../content/images/avatar.png")
                            }
                            alt={"No Profile"}
                          />
                          {otherStatus === 1 && (
                            <div className="profile-dots profile-status"></div>
                          )}
                          {otherStatus === 2 && (
                            <div className="profile-dots profile-status-absent"></div>
                          )}
                          {otherStatus === 3 && (
                            <div className="profile-dots profile-status-offline"></div>
                          )}
                        </Button>
                      )}
                    </Box>
                    <Box>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h1>
                          {isAuthAddress
                            ? loginuserdata &&
                              loginuserdata.fname_alias +
                                " " +
                                loginuserdata.lname_alias
                            : otherUserData
                            ? otherUserData.fname_alias +
                              " " +
                              otherUserData.lname_alias
                            : ""}
                        </h1>
                        <span className="verify-status">
                          <SimpleCheckIcon width="16" height="12" />
                        </span>
                      </div>
                      <div className="about-profile">
                        <h6>
                          <strong>0</strong> transactions
                        </h6>
                        <h6 className="feedback">
                          <strong>0</strong> positive feedback
                        </h6>
                      </div>
                    </Box>
                  </Box>
                  <Box className="ButtonSocialLink">
                    <p>
                      {isAuthAddress
                        ? loginuserdata && loginuserdata.bio
                        : otherUserData
                        ? otherUserData.bio
                        : ""}
                    </p>
                    <div className="profile-btn">
                      {userData && userData.account === "Connect Wallet" ? (
                        <>
                          <Button
                            variant="primary"
                            onClick={connectWalletModalToggle}
                          >
                            <MessageIcon width="18" height="16" />
                            Message{" "}
                          </Button>
                          <Button
                            variant="danger"
                            className="buttonspace"
                            onClick={connectWalletModalToggle}
                          >
                            Report User
                          </Button>
                        </>
                      ) : isAuthAddress && isAuth ? (
                        <>
                          <Button
                            variant="secondary"
                            className="auth-btn"
                            onClick={editProfileModalToggle}
                          >
                            Edit Profile{" "}
                          </Button>

                          {(loginuserdata?.kyc_completed === true ||
                            kycSubmitted === true) &&
                            (loginuserdata?.is_verified === 1 &&
                            kycSubmitted === false ? (
                              <Button
                                variant="success"
                                className="buttonspace auth-btn"
                                disabled
                              >
                                KYC approved
                              </Button>
                            ) : loginuserdata?.is_verified === 2 &&
                              kycSubmitted === false ? (
                              <Button
                                variant="primary"
                                className="buttonspace auth-btn"
                                onClick={modalKycToggle}
                              >
                                Verification
                              </Button>
                            ) : loginuserdata?.is_verified === 0 ||
                              kycSubmitted === true ? (
                              <Button
                                variant="warning"
                                className="buttonspace auth-btn kyc-width"
                                disabled
                              >
                                KYC Under Review
                              </Button>
                            ) : null)}

                          {(loginuserdata?.kyc_completed === false ||
                            loginuserdata?.kyc_completed === undefined) &&
                            kycSubmitted === false && (
                              <Button
                                variant="primary"
                                className="buttonspace auth-btn"
                                onClick={modalKycToggle}
                              >
                                Verification
                              </Button>
                            )}
                        </>
                      ) : (
                        <>
                          <Button variant="primary" onClick={modalToggle}>
                            <MessageIcon width="18" height="16" />
                            Message
                          </Button>
                          <Button
                            variant="danger"
                            className="buttonspace"
                            onClick={reportModalToggle}
                          >
                            Report User
                          </Button>
                        </>
                      )}
                    </div>
                    <p>Social media</p>
                    <div className="social-btn">
                      <Button variant="link">
                        <InstagramIcon width="32" height="32" />
                      </Button>
                      <Button variant="link">
                        <TwitterIcon width="32" height="32" />
                      </Button>
                      <Button variant="link">
                        <TelegramIcon width="32" height="32" />
                      </Button>
                    </div>
                  </Box>
                </Col>
              </Row>
            )}
          </div>
        </Col>
        {loader ? (
          <InfoLoader />
        ) : (
          <Col lg="4">
            <Card className="cards-dark">
              <Card.Body className="informationBody">
                <Card.Title as="h2">Information</Card.Title>
                <div className="profile-information">
                  <Row className="align-items-center g-0">
                    <Col xs="7">
                      <label>Location</label>
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
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
                    <Col>
                      <span>0</span>
                    </Col>
                  </Row>
                  <Row className="align-items-center g-0">
                    <Col xs="7">
                      <label>Trading partners</label>
                    </Col>
                    <Col>
                      <span>0</span>
                    </Col>
                  </Row>
                  <Row className="align-items-center g-0">
                    <Col xs="7">
                      <label>Feedback score</label>
                    </Col>
                    <Col>
                      <span>0%</span>
                    </Col>
                  </Row>
                  <Row className="align-items-center g-0">
                    <Col xs="7">
                      <label>Account created</label>
                    </Col>
                    <Col>
                      <span>Yesterday</span>
                    </Col>
                  </Row>
                  <Row className="align-items-center g-0">
                    <Col xs="7">
                      <label>Typical finalization time</label>
                    </Col>
                    <Col>
                      <span>-</span>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      <Tabs defaultActiveKey="active-offers" id="profile-tab">
        <Tab eventKey="active-offers" title="Active offers">
          <h2>Active offers</h2>
          <div className="table-responsive tradeList">
            <div className="flex-table">
              <div className="flex-table-header">
                <div className="price">Price</div>
                <div className="payment">Payment methods</div>
                <div className="time">Time constraints</div>
                <div className="trader">Trader</div>
                <div className="actions profile-action">Actions</div>
              </div>
              {escrowLoading ? (
                <TableLoader />
              ) : (
                <>
                  {activeEscrows?.map((escrow, i) => (
                    <div
                      className="flex-table-body tradeListBody"
                      key={escrow._id}
                    >
                      {escrow && escrow.price_type === "fixed" && (
                        <div className="price">
                          {escrow.fixed_price} USD
                          <span>Buy Limit 0.1-0.6 BTC</span>{" "}
                        </div>
                      )}
                      {escrow && escrow.price_type === "flexible" && (
                        <div className="price">
                          {capitalizeFirstLetter(escrow.price_type)}
                          <span>Buy Limit 0.1-0.6 BTC</span>{" "}
                        </div>
                      )}
                      <div className="payment d-flex justify-content-center align-items-start">
                        <img
                          src={require("../../content/images/ethereum.png")}
                          alt="Gabriel  Erickson"
                        />
                        <span className="ms-2"> Ethereum </span>
                      </div>
                      <div className="time d-flex justify-content-center">
                        {escrow.time_constraints}
                      </div>
                      <div className="trader d-flex align-items-center justify-content-start">
                        <div className="d-flex align-items-center">
                          <div className="chat-image">
                            <img
                              src={
                                escrow?.newImage
                                  ? escrow?.newImage
                                  : require("../../content/images/avatar.png")
                              }
                              alt={
                                escrow?.newImage
                                  ? escrow?.newImage
                                  : "No Profile"
                              }
                            />
                            {(userStatuses[i] === 0 ||
                              userStatuses[i] === false) && (
                              <div className="chat-status-offline"></div>
                            )}
                            {(userStatuses[i] === 1 ||
                              userStatuses[i] === true) && (
                              <div className="chat-status"></div>
                            )}
                            {userStatuses[i] === 2 && (
                              <div className="chat-status-absent"></div>
                            )}
                          </div>
                          <div className="content ms-3">
                            <h6>
                              {escrow.user_name ? escrow.user_name : "John doe"}
                            </h6>
                            <span>(100%, 500+)</span>
                          </div>
                        </div>
                      </div>
                      <div className="actions profile-action text-center">
                        {userData &&
                        userData?.account === escrow?.user_address ? (
                          <Link
                            className="action"
                            to={`/escrow/details/${escrow?._id}`}
                          >
                            <Button variant="primary">Details</Button>
                          </Link>
                        ) : userData &&
                          userData?.account !== escrow?.user_address &&
                          escrow &&
                          escrow?.escrow_type === "buyer" ? (
                          <Button variant="primary">Sell</Button>
                        ) : userData &&
                          userData?.account !== escrow?.user_address &&
                          escrow &&
                          escrow?.escrow_type === "seller" ? (
                          <Button variant="primary">Buy</Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  {totalActiveEscrowCount === 0 && escrowLoading === false && (
                    <div className="flex-table-body no-records justify-content-between">
                      <div className="no-records-text">
                        <div className="no-record-label">No Records</div>
                        <p>You haven't made any escrow</p>
                      </div>
                      <div className="actions profile-action text-center">
                        <Button
                          variant="primary"
                          onClick={createEscrowModalToggle}
                          type="button"
                        >
                          Create
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {totalActiveEscrowCount !== 0 && escrowLoading === false && (
            <div className="d-flex justify-content-between align-items-center table-pagination">
              <PaginationComponent
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={totalActiveEscrowCount}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </Tab>
        <Tab eventKey="reviews" title="Reviews">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Reviews</h2>
            <Select
              defaultValue={selectedOptionStatus}
              value={selectedOptionStatus}
              className="select-dropdown"
              isSearchable={false}
              components={{
                IndicatorSeparator: () => null,
              }}
              classNamePrefix="select-dropdown"
              options={data}
              onChange={handleChangeStatus}
              getOptionLabel={(e) => (
                <div className="selected-dropdown">{e.text}</div>
              )}
            />
          </div>
          <div className="reviews-list">
            <Card className="cards-dark">
              <Card.Body>
                <div className="reviewer-image">
                  <img
                    src={require("../../content/images/escrows-5.png")}
                    alt="Gabriel  Erickson"
                    width="51"
                    height="51"
                  />
                </div>
                <div className="reviewer-details">
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <div className="reviewer-name">
                    Gabriel <span>12 hours ago</span>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua.
                  </p>
                  <div className="reviewer-transaction">
                    Transaction : <strong>Buy 5 BTC</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="cards-dark">
              <Card.Body>
                <div className="reviewer-image">
                  <img
                    src={require("../../content/images/escrows-5.png")}
                    alt="Gabriel  Erickson"
                    width="51"
                    height="51"
                  />
                </div>
                <div className="reviewer-details">
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <div className="reviewer-name">
                    Gabriel <span>12 hours ago</span>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua.
                  </p>
                  <div className="reviewer-transaction">
                    Transaction : <strong>Buy 5 BTC</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="cards-dark">
              <Card.Body>
                <div className="reviewer-image">
                  <img
                    src={require("../../content/images/escrows-5.png")}
                    alt="Gabriel  Erickson"
                    width="51"
                    height="51"
                  />
                </div>
                <div className="reviewer-details">
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <div className="reviewer-name">
                    Gabriel <span>12 hours ago</span>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua.
                  </p>
                  <div className="reviewer-transaction">
                    Transaction : <strong>Buy 5 BTC</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="cards-dark">
              <Card.Body>
                <div className="reviewer-image">
                  <img
                    src={require("../../content/images/escrows-5.png")}
                    alt="Gabriel  Erickson"
                    width="51"
                    height="51"
                  />
                </div>
                <div className="reviewer-details">
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <StarRating
                    ratings={5}
                    customIcon={<StarFillIcon width="12" height="12" />}
                    customEmptyIcon={<StarEmptyIcon width="12" height="12" />}
                  />
                  <div className="reviewer-name">
                    Gabriel <span>12 hours ago</span>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua.
                  </p>
                  <div className="reviewer-transaction">
                    Transaction : <strong>Buy 5 BTC</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Tab>
      </Tabs>

      <MessageView
        show={modalShow}
        onHide={() => setModalShow(false)}
        otheruser={otherUserData ? otherUserData : ""}
      />
      <ReportUserView
        show={reportModelOpen}
        onHide={() => setReportModelOpen(false)}
        id={address}
        status="Unblock"
        setUser={setUser}
      />
      <EditProfileView
        show={editProfileModalShow}
        onHide={() => setEditProfileModalShow(false)}
      />
      {connectWalletmodalShow && (
        <LoginView
          show={connectWalletmodalShow}
          onHide={() => setconnectWalletModalShow(false)}
          isSign={isSign}
          handleaccountaddress={handleAccountAddress}
        />
      )}
      <CreateEscrowView
        show={createEscrowModalShow}
        onHide={() => setCreateEscrowModalShow(false)}
      />

      <KYCVerification
        show={
          ((loginuserdata?.kyc_completed === true &&
            loginuserdata?.is_verified === 2) ||
            loginuserdata?.kyc_completed === false ||
            loginuserdata?.kyc_completed == undefined) &&
          modalKycShow
        }
        onHide={() => setModalKYCShow(false)}
        setkycsubmitted={setKYCSubmitted}
      />
    </div>
  );
};

export default TraderProfile;
