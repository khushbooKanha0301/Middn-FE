import React, { useEffect, useState } from "react";
import { Navbar, Nav, Button, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  EscrowIcon,
  HomeIcon,
  QuestionIcon,
  TradeHistoryIcon,
  PlusIcon,
} from "./SVGIcon";
import Highcharts from "highcharts/highstock";
import { userDetails } from "../store/slices/AuthSlice";
import { useSelector } from "react-redux";
import CreateEscrowView from "../layout/escrow/CreateEscrow";
import LoginView from "../component/Login";
import jwtAxios from "../service/jwtAxios";
import { database } from "../helper/config";
import { firebaseStatus } from "../helper/statusManage";
import { get, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
let divSize = 0;

function getHeight() {
  return document.documentElement.clientHeight;
}

function getCount(height) {
  let userDisplayCal = 1;

  if (height > 850) {
    userDisplayCal = 3;
  } else if (height > 700) {
    userDisplayCal = 2;
  }

  return userDisplayCal;
}

export const Sidebar = (props) => {
  const navigate = useNavigate();
  let height = getHeight();
  let userDisplayCal = getCount(height);
  const location = useLocation();
  const acAddress = useSelector(userDetails);
  console.log("acAddress ", acAddress);
  const [userDisplayCount, setUserDisplayCount] = useState(userDisplayCal);
  const [activeKey, setActiveKey] = useState();
  const [escrows, setEscrow] = useState([]);
  console.log("escrows ", escrows);
  const [userStatuses, setUserStatuses] = useState([]);
 
  const [userList, setUserList] = useState(
    escrows.filter((item, index) => index < userDisplayCount)
  );
  const [createEscrowModalShow, setCreateEscrowModalShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isSign, setIsSign] = useState(null);

  const createEscrowModalToggle = () => {
    if (acAddress.authToken) {
      setCreateEscrowModalShow(!createEscrowModalShow);
    } else {
      setModalShow(true);
    }
  };

  const handleResize = () => {
    let height = getHeight();
    let userDisplayCal = getCount(height);

    divSize = height;
    setTimeout(() => {
      if (divSize === height) {
        setUserDisplayCount(userDisplayCal);
        setUserList(escrows.filter((item, index) => index < userDisplayCount));
      }
    }, 500);
  };

  const getAllEscrow = async () => {
    try {
      let res;
      if (acAddress.authToken) {
        res = await jwtAxios.get(
          `/escrows/getAllOpenEscrows/${acAddress?.account}`
        );
        setEscrow(res.data?.data);
        handleMouseMove();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllEscrow();
  }, [acAddress]);

  const handleMouseMove = async () => {
    let statuses = await Promise.all(
      escrows?.map(async (e) => {
        const starCountRef = ref(
          database,
          firebaseStatus.CHAT_USERS + e.trade_address
        );
        const snapshot = await get(starCountRef);
        return snapshot.exists() ? snapshot.val()?.isOnline : 4;
    }))

    setUserStatuses(statuses);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    //const intervalId = setInterval(handleMouseMove,  10000);

    return () => {
      window.removeEventListener("resize", handleResize);
      //clearInterval(intervalId);
    };
  }, [acAddress]);

  const loadMoreData = () => {
    setUserList(escrows);
    handleMouseMove();
  };

  const handleResizePage = () => {
    if (Highcharts.charts) {
      Highcharts.charts.map((val) => {
        if (val) {
          setTimeout(() => val.reflow(), 200);
        }
        return val;
      });
    }
  };

  useEffect(() => {
    setActiveKey(location.pathname);
    if (props.isResponsive) {
      props.setIsOpen(false);
    }
  }, [location, props.isResponsive]);

  const handleAccountAddress = (address) => {
    setIsSign(false);
  };

  const openEscrow = (e) => {
    navigate(`/escrow/${e._id}`, { state: { key: "sidebar" } });
  };

  return (
    <div className="sidebar">
      <div className="d-flex nav-header">
        <Navbar.Brand className="menu-hide" as={Link} to="/">
          <img src={require("../content/images/logo.png")} alt="Middn" />
        </Navbar.Brand>
        <Navbar.Toggle
          onClick={() => {
            props.clickHandler();
            handleResizePage();
          }}
          aria-controls="basic-navbar-nav"
        />
      </div>
      <div className="sidebar-scroll">
        <PerfectScrollbar options={{ suppressScrollX: true }}>
          <div className="nav-title font-family-inter">Middn App</div>
          <Nav as="ul" activeKey={activeKey}>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="/"
                to="/"
                className={activeKey === "/" && "active"}
              >
                <HomeIcon width="24" height="24" />{" "}
                <span className="menu-hide">Home</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="escrow"
                to={"/escrows"}
                className={activeKey === "/escrows" && "active"}
              >
                <EscrowIcon width="24" height="24" />{" "}
                <span className="menu-hide">Escrow</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="trade"
                to={"/trade"}
                className={activeKey === "/trade" && "active"}
              >
                <TradeHistoryIcon width="24" height="24" />{" "}
                <span className="menu-hide">Trade History</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                eventKey="help"
                to={"/help"}
                className={activeKey === "/help" && "active"}
              >
                <QuestionIcon width="24" height="24" />{" "}
                <span className="menu-hide">Help</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="divider"></div>
          <div className="nav-title">Active Trader</div>
          {acAddress?.authToken && (
            <>
              <ul className="active-trader">
                {userList.map((item, index) => (
                  <li key={index} onClick={() => openEscrow(item)}>
                    <div className="tradeName">
                      <img
                        src={
                          item?.newImage
                            ? item?.newImage
                            : require("../content/images/avatar.png")
                        }
                        alt={require("../content/images/avatar.png")}
                      />
                      <span className="menu-hide">
                        {acAddress?.account === item?.trade_address ? (
                          <>
                            {item?.user_escrow_name
                              ? item?.user_escrow_name
                              : "John Doe"}
                          </>
                        ) : (
                          <>
                            {item.user_trade_name
                              ? item.user_trade_name
                              : "John Doe"}
                          </>
                        )}
                      </span>
                    </div>
                    {userStatuses[index] === 1 && (
                      <div className="sidebar-left-dot"></div>
                    )}
                    {userStatuses[index] === 2 && (
                      <div className="sidebar-left-dot-absent"></div>
                    )}
                    {userStatuses[index] === 3 && (
                      <div className="sidebar-left-dot-offline"></div>
                    )}
                  </li>
                ))}
              </ul>
              {escrows.length === userList.length ? (
                <Button
                  variant="link"
                  className="btn-create-escrow"
                  onClick={createEscrowModalToggle}
                >
                  <span className="create-new">
                    <PlusIcon width="14" height="14" />
                  </span>{" "}
                  <span className="menu-hide">Create Escrow</span>
                </Button>
              ) : (
                <Button variant="link" onClick={loadMoreData}>
                  <span className="load-arrow"></span>{" "}
                  <span className="menu-hide">Load more</span>
                </Button>
              )}
            </>
          )}

          {!acAddress?.authToken && (
            <Button
              variant="link"
              className="btn-create-escrow"
              onClick={createEscrowModalToggle}
            >
              <span className="create-new">
                <PlusIcon width="14" height="14" />
              </span>{" "}
              <span className="menu-hide">Create Escrow</span>
            </Button>
          )}
        </PerfectScrollbar>
      </div>
      <Card className="cards-dark menu-hide">
        <Card.Body>
          <Card.Title>Contact us</Card.Title>
          <Card.Text>
            For all inquiries, please email us using the form below
          </Card.Text>
          <Button variant="primary">Contact us</Button>
        </Card.Body>
      </Card>
      {modalShow && (
        <LoginView
          show={modalShow}
          onHide={() => setModalShow(false)}
          handleaccountaddress={handleAccountAddress}
          isSign={isSign}
        />
      )}
      <CreateEscrowView
        show={createEscrowModalShow}
        onHide={() => setCreateEscrowModalShow(false)}
      />
    </div>
  );
};

export default Sidebar;
