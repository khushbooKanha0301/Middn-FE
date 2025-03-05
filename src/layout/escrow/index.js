import React, { useEffect, useState } from "react";
import { Col, Row, Button, Card, Form, Nav } from "react-bootstrap";
import { UploadIcon } from "../../component/SVGIcon";
import LoginView from "../../component/Login";
import Select from "react-select";
import CreateEscrowView from "./CreateEscrow";
import jwtAxios from "../../service/jwtAxios";
import PaginationComponent from "../../component/Pagination";
import { useSelector } from "react-redux";
import { userDetails } from "../../store/slices/AuthSlice";
import { Link } from "react-router-dom";
import { database } from "../../helper/config";
import { firebaseStatus } from "../../helper/configVariables";
import { get, ref } from "firebase/database";
import { TableLoader } from "../../helper/Loader";
import { useNavigate } from "react-router-dom";
import FilterImage from "../../content/images/filter.png";

let PageSize = 5;

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const data = [
  {
    value: 1,
    text: "Any",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
      </svg>
    ),
  },
  {
    value: 2,
    text: "BTC",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
      </svg>
    ),
  },
  {
    value: 3,
    text: "Anywhere",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
      </svg>
    ),
  },
];
export const Escrow = () => {
  const [selectedOptionAny, setSelectedOptionAny] = useState(data[0]);
  const [selectedOptionBTC, setSelectedOptionBTC] = useState(data[1]);
  const [selectedOptionAnywhere, setSelectedOptionAnywhere] = useState(data[2]);
  const [escrows, setEscrow] = useState([]);
  const [totalEscrowCount, setTotalEscrowCount] = useState(0);
  const [escrowLoading, setEscrowLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const acAddress = useSelector(userDetails);
  const userData = useSelector(userDetails);
  const [isSign, setIsSign] = useState(null);
  const navigate = useNavigate();
  const modalToggle = () => setModalShow(!modalShow);
  const [modalShow, setModalShow] = useState(false);
  const [createEscrowModalShow, setCreateEscrowModalShow] = useState(false);
  const [userStatuses, setUserStatuses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getAllEscrow = async () => {
    if (currentPage) {
      try {
        setUserStatuses([]);
        let res;
        if (acAddress.authToken) {
          res = await jwtAxios.get(
            `/auth/getAllEscrows?page=${currentPage}&pageSize=${PageSize}&userAddress=${
              userData?.account
            }&statusFilter=${statusFilter ? statusFilter : "All"}`
          );
        } else {
          res = await jwtAxios.get(
            `/auth/getAllEscrowsWithoutLogin?page=${currentPage}&pageSize=${PageSize}&statusFilter=${
              statusFilter ? statusFilter : "All"
            }`
          );
        }
        setEscrow(res.data?.data); // Update the state with the new array
        setTotalEscrowCount(res.data?.escrowsCount);
        setEscrowLoading(false);
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
        setEscrowLoading(false);
        console.error(err);
      }
    }
  };
  const filterHandle = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (isComponentMounted) {
      setCurrentPage(1);
      getAllEscrow();
    }
  }, [statusFilter, acAddress]);

  useEffect(() => {
    getAllEscrow();
    setIsComponentMounted(true);
  }, [currentPage, statusFilter, acAddress]);

  const handleChangeAny = (e) => {
    setSelectedOptionAny(e);
  };
  const handleChangeBTC = (e) => {
    setSelectedOptionBTC(e);
  };
  const handleChangeAnywhere = (e) => {
    setSelectedOptionAnywhere(e);
  };

  const createEscrowModalToggle = () => {
    if (acAddress.authToken) {
      setCreateEscrowModalShow(!createEscrowModalShow);
    } else {
      setModalShow(true);
    }
  };

  const handleAccountAddress = (address) => {
    setIsSign(false);
  };

  const onBuySellClick = async (escrow_id) => {
    if (acAddress.authToken) {
      navigate(`/escrow/${escrow_id}`);
    } else {
      setModalShow(true);
    }
  };

  const changeStatus = (status) => {
    setStatusFilter(status);
  };
  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 991px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="escrow-view">
      <h4>Hi Alex, Welcome back!</h4>
      <h1>Your Escrow</h1>
      <Row>
        <Col lg="8">
          <div className="create-escrow">
            <p>Create your escrow</p>
            <Button
              variant="primary"
              onClick={createEscrowModalToggle}
              type="button"
            >
              <UploadIcon width="16" height="16" /> Create
            </Button>
          </div>
        </Col>
        <Col lg="4">
          <Card className="cards-dark">
            <Card.Body>
              <Card.Title as="h2">Your Latest Ticket</Card.Title>
              <Form.Group className="form-group">
                <Form.Label>Description of Transaction</Form.Label>
                <Form.Control type="text" placeholder="app.middn..9341982390" />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center expired">
                <div>Expired</div>
                <div>23:20&nbsp;&nbsp; 24/02/2022</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="escrow-active-offers">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            marginBottom: "10px",
          }}
        >
          <h2>Active offers</h2>
          <div>
            {isMobile && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    color: "#fff",
                    marginRight: "10px",
                    fontSize: "18px",
                    fontFamily: "eudoxus sans",
                    lineHeight: "24px",
                  }}
                >
                  Filter
                </span>
                <img
                  src={FilterImage}
                  alt="FilterImage"
                  onClick={filterHandle}
                />
              </div>
            )}
            {isMobile && isOpen && (
              <Col
                lg="auto default-active-keys absolute p-4 rounded-4 right-0"
                style={{
                  background: "#18191d",
                  border: "1px solid #202020",
                  top: "50px",
                  width: "232px",
                  zIndex: "9",
                }}
              >
                <Select
                  defaultValue={selectedOptionAny}
                  value={selectedOptionAny}
                  className="select-dropdown"
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
                <Select
                  defaultValue={selectedOptionBTC}
                  value={selectedOptionBTC}
                  isSearchable={false}
                  className="select-dropdown"
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  classNamePrefix="select-dropdown"
                  options={data}
                  onChange={handleChangeBTC}
                  getOptionLabel={(e) => (
                    <div className="selected-dropdown">
                      {e.icon}
                      <span>{e.text}</span>
                    </div>
                  )}
                />
                <Select
                  defaultValue={selectedOptionAnywhere}
                  value={selectedOptionAnywhere}
                  isSearchable={false}
                  className="select-dropdown"
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  classNamePrefix="select-dropdown"
                  options={data}
                  onChange={handleChangeAnywhere}
                  getOptionLabel={(e) => (
                    <div className="selected-dropdown">
                      {e.icon}
                      <span>{e.text}</span>
                    </div>
                  )}
                />
              </Col>
            )}
          </div>
        </div>
        <Row className="justify-content-between align-items-center">
          <Col lg="auto default-active-keys ">
            <Nav defaultActiveKey="all" as="ul" className="filter-btn">
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  className={statusFilter === "All" ? "active" : ""}
                  onClick={() => changeStatus("All")}
                >
                  All
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  className={statusFilter === "Buy" ? "active" : ""}
                  onClick={() => changeStatus("Buy")}
                >
                  Buy
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  as={Link}
                  className={statusFilter === "Sell" ? "active" : ""}
                  onClick={() => changeStatus("Sell")}
                >
                  Sell
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          {!isMobile && (
            <Col lg="auto default-active-keys">
              <Select
                defaultValue={selectedOptionAny}
                value={selectedOptionAny}
                className="select-dropdown"
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
              <Select
                defaultValue={selectedOptionBTC}
                value={selectedOptionBTC}
                isSearchable={false}
                className="select-dropdown"
                components={{
                  IndicatorSeparator: () => null,
                }}
                classNamePrefix="select-dropdown"
                options={data}
                onChange={handleChangeBTC}
                getOptionLabel={(e) => (
                  <div className="selected-dropdown">
                    {e.icon}
                    <span>{e.text}</span>
                  </div>
                )}
              />
              <Select
                defaultValue={selectedOptionAnywhere}
                value={selectedOptionAnywhere}
                isSearchable={false}
                className="select-dropdown"
                components={{
                  IndicatorSeparator: () => null,
                }}
                classNamePrefix="select-dropdown"
                options={data}
                onChange={handleChangeAnywhere}
                getOptionLabel={(e) => (
                  <div className="selected-dropdown">
                    {e.icon}
                    <span>{e.text}</span>
                  </div>
                )}
              />
            </Col>
          )}
        </Row>
        <div className="table-responsive escrowList">
          <div className="flex-table">
            <div className="flex-table-header">
              <div className="escrow-price">Price</div>
              <div className="escrow-title">Title</div>
              <div className="escrow-payment">Payment methods</div>
              <div className="escrow-time">Time constraints</div>
              <div className="escrow-trader">Trader</div>
              <div className="escrow-actions">Actions</div>
              <div className="escrow-network">Network</div>
            </div>
            {escrowLoading ? (
              <TableLoader />
            ) : (
              <>
                {escrows?.map((escrow, index) => (
                  <>
                    <div
                      className="flex-table-body escrowListBody"
                      key={escrow?._id}
                    >
                      {escrow && escrow?.price_type === "fixed" && (
                        <div className="escrow-price">
                          {escrow?.fixed_price} USD
                          <span>Buy Limit 0.1-0.6 BTC</span>{" "}
                        </div>
                      )}
                      {escrow && escrow?.price_type === "flexible" && (
                        <div className="escrow-price">
                          {capitalizeFirstLetter(escrow?.price_type)}
                          <span>Buy Limit 0.1-0.6 BTC</span>{" "}
                        </div>
                      )}
                      <div className="escrow-title d-flex justify-content-center align-items-center">
                        {escrow?.object}
                      </div>
                      <div className="escrow-payment d-flex justify-content-center align-items-center">
                        <img
                          src={require("../../content/images/ethereum.png")}
                          alt="Gabriel  Erickson"
                        />
                        <span className="ms-2"> Ethereum </span>
                      </div>
                      <div className="escrow-time d-flex justify-content-center">
                        {escrow?.time_constraints}
                      </div>
                      <div className="escrow-trader d-flex align-items-center justify-content-start">
                        <div className="d-flex items-center">
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

                            {(userStatuses[index] === 1 ||
                              userStatuses[index] === true) && (
                              <div className="chat-status"></div>
                            )}
                            {userStatuses[index] === 2 && (
                              <div className="chat-status-absent"></div>
                            )}
                            {(userStatuses[index] === 3 ||
                              userStatuses[index] === false) && (
                              <div className="chat-status-offline"></div>
                            )}
                          </div>
                          <div className="content ms-3 escrow-trade-content">
                            <h6>
                              {escrow?.user_name
                                ? escrow?.user_name
                                : "John doe"}
                            </h6>
                            <span>(100%, 500+)</span>
                          </div>
                        </div>
                      </div>
                      <div className="escrow-actions text-center d-flex justify-content-center">
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
                            <Button
                              variant="primary"
                              onClick={() => {
                                onBuySellClick(escrow?._id);
                              }}
                            >
                              Sell
                            </Button>
                          ) : userData &&
                            userData?.account !== escrow?.user_address &&
                            escrow &&
                            escrow?.escrow_type === "seller" ? (
                            <Button
                              variant="primary"
                              onClick={() => {
                                onBuySellClick(escrow?._id);
                              }}
                            >
                              Buy
                            </Button>
                          ) : null}
                        </div>
                      </div>
                      <div className="escrow-network">Binance Smart Chain</div>
                    </div>
                  </>
                ))}
                {totalEscrowCount === 0 && escrowLoading === false && (
                  <div className="flex-table-body no-records justify-content-between">
                    <div className="no-records-text">
                      <div className="no-record-label">No Records</div>
                      <p>You haven't made any transaction</p>
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
      </div>
      {totalEscrowCount !== 0 && escrowLoading === false && (
        <div className="d-flex justify-content-between align-items-center table-pagination">
          <PaginationComponent
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={totalEscrowCount}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
      {modalShow && (
        <LoginView
          show={modalShow}
          onHide={() => setModalShow(false)}
          isSign={isSign}
          handleaccountaddress={handleAccountAddress}
        />
      )}
      <CreateEscrowView
        show={createEscrowModalShow}
        onHide={() => setCreateEscrowModalShow(false)}
      />
    </div>
  );
};

export default Escrow;
