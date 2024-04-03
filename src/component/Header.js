import { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { userDetails, userGetFullDetails } from "../store/slices/AuthSlice";


import { onValue, ref } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { database } from "./../helper/config";
import { firebaseMessages } from "./../helper/chatMessage";
import { firebaseMessagesEscrow } from "./../helper/configEscrow";

import { hideAddress } from "../utils";
import LoginView from "../component/Login";
import {
  // BellIcon,
  LogoutIcon,
  NotificationIcon,
  SettingIcon,
  UserIcon,
} from "./SVGIcon";
import { HeaderLoader } from "./HeaderLoader";
import Logo from "../../src/content/images/logo.png";
import MassageIcon from "../../src/content/images/massage.png";
import BellIcon from "../../src/content/images/bell.png";

export const Header = (props) => {
  const dispatch = useDispatch();
  const [position, setPosition] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const acAddress = useSelector(userDetails);
  let usergetdata = useSelector(userGetFullDetails);
  const userDetailsAll = useSelector(userGetFullDetails);

  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);

  const [modalNotifyShow, setModalNofificationShow] = useState(false);
  const modalNotifyToggle = () => setModalNofificationShow(!modalShow);
  const [isSign, setIsSign] = useState(null);

  let addressLine = "";
  if (acAddress?.account === "Connect Wallet" && userDetailsAll === undefined) {
    addressLine = "Connect Wallet";
  } else if (
    acAddress?.account !== "Connect Wallet" &&
    userDetailsAll === undefined
  ) {
    addressLine = "";
  } else if (
    acAddress?.account !== "Connect Wallet" &&
    userDetailsAll?.is_2FA_login_verified !== false &&
    acAddress?.account == userDetailsAll?.wallet_address
  ) {
    addressLine = hideAddress(acAddress?.account, 5);
  } else {
    addressLine = "Connect Wallet";
  }

  const findFirebaseUserList = async () => {
    if (acAddress?.authToken) {
      const starCountRef = ref(database, firebaseMessages.CHAT_ROOM);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.val()) {
          const allunreadCount = Object.keys(snapshot.val())
            .filter((element) => {
              return element.includes(acAddress?.account);
            })
            ?.filter((object) => {
              const name = acAddress?.account;
              return (
                name &&
                snapshot &&
                snapshot.val() &&
                snapshot.val()[object] &&
                snapshot.val()[object]?.unreadcount &&
                snapshot.val()[object]?.unreadcount[name] > 0
              );
            });
          setMessageCount(allunreadCount.length);
        }
      });
    }
  };

  const findFirebaseUserListNotification = async () => {
    if (acAddress?.authToken) {
      const starCountRef = ref(database, firebaseMessagesEscrow.CHAT_ROOM);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.val()) {
          const unreadCount = Object.values(snapshot.val()).filter((e) => {
            return Object.keys(e).some((element) => {
              const ReciverId = element.split("_")[0];
              const name = acAddress?.account;
              return (
                ReciverId === name &&
                e[element]?.unreadcount &&
                e[element]?.unreadcount[name] > 0
              );
            });
          });
          setNotificationCount(unreadCount.length);
        }
      });
    }
  };

  const handleAccountAddress = (address) => {
    setIsSign(false);
  };

  useEffect(() => {
    if (acAddress.authToken) {
      findFirebaseUserList();
      findFirebaseUserListNotification();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let moving = window.pageYOffset;
      setVisible(position > moving);
      setPosition(moving);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleLinkClick = () => {
    setModalShow(true);
  };

  const handleNotificationClick = () => {
    setModalNofificationShow(true);
  };

  const cls = visible ? "visible" : "hidden";
  return (
    <div className={`header d-flex ${cls}`}>
      <Navbar.Toggle
        onClick={props.clickHandler}
        style={{paddingLeft: "14px"}}
        className="d-block d-md-none"
        aria-controls="basic-navbar-nav"
      />
      <a class="menu-hide navbar-brand" href="/">
        <img src={Logo} alt="Logo" />
      </a>
      <Nav className="ms-auto" as="ul">
        {acAddress?.authToken ? (
          <>
            {messageCount > 0 ? (
              <Nav.Item as="li" className="items">
                <Nav.Link as={Link} to="/chat">
                  {/* <NotificationIcon width="26" height="24" /> */}
                  <img src={MassageIcon} alt="MassageIcon" />
                  <span className="notification-badge">{messageCount}</span>
                </Nav.Link>
              </Nav.Item>
            ) : (
              <Nav.Item as="li">
                <Nav.Link as={Link} to="/chat">
                  <img src={MassageIcon} alt="MassageIcon" />

                  {/* <NotificationIcon width="26" height="24" /> */}
                  {messageCount > 0 && (
                    <span className="notification-badge">{messageCount}</span>
                  )}
                </Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/notification">
                {/* <BellIcon width="20" height="22" /> */}
                <img src={BellIcon} alt="BellIcon" />
                {notificationCount > 0 && (
                  <span className="notification-badge">
                    {notificationCount}
                  </span>
                )}
              </Nav.Link>
            </Nav.Item>
          </>
        ) : (
          <>
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/chat" onClick={handleLinkClick}>
                {/* <NotificationIcon width="26" height="24" /> */}
                
                <img src={MassageIcon} alt="MassageIcon" />
              </Nav.Link>
              {modalShow && (
                <LoginView
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  handleaccountaddress={handleAccountAddress}
                  isSign={isSign}
                />
              )}
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                to={acAddress.authToken && "/notification"}
                onClick={handleNotificationClick}
              >
               <img src={BellIcon} alt="BellIcon" />
              </Nav.Link>
              {modalNotifyShow && (
                <LoginView
                  show={modalNotifyShow}
                  onHide={() => setModalNofificationShow(false)}
                  handleaccountaddress={handleAccountAddress}
                  isSign={isSign}
                />
              )}
            </Nav.Item>
          </>
        )}
        <Nav.Item
          as="li"
          onClick={acAddress?.authToken ? null : props.clickModalHandler}
          className="login-menu"
        >
          {acAddress && (
            <span className="user-name d-none d-md-block">{addressLine}</span>
          )}

          {acAddress && (
            <span className="login-btn d-flex d-md-none text-white">
              {addressLine}
            </span>
          )}
        </Nav.Item>
        {acAddress &&
        acAddress?.authToken &&
        userDetailsAll?.is_2FA_login_verified === true &&
        acAddress.account == userDetailsAll.wallet_address ? (
          <NavDropdown
            className="dropdownProfile"
            as="li"
            title={
              <img
                className="rounded-circle"
                src={
                  usergetdata?.imageUrl
                    ? usergetdata?.imageUrl
                    : require("../content/images/avatar1.png")
                }
                alt="No Profile"
              />
            }
            id="nav-dropdown"
          >
            <NavDropdown.Item as={Link} to={`/profile/${acAddress.account}`}>
              <UserIcon width="18" height="18" />
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/settings">
              <SettingIcon width="18" height="18" />
              Account settings
            </NavDropdown.Item>
            <NavDropdown.Item onClick={props.signOut}>
              <LogoutIcon width="18" height="18" />
              Sign out
            </NavDropdown.Item>
          </NavDropdown>
        ) : (
          <HeaderLoader />
        )}
      </Nav>
    </div>
  );
};

export default Header;
