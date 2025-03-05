import { useEffect, useState, useCallback } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { userDetails, userGetFullDetails } from "../store/slices/AuthSlice";
import { onValue, ref } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { database } from "./../helper/config";
import { firebaseMessages, firebaseMessagesEscrow } from "./../helper/configVariables";
import { hideAddress } from "../utils";
import LoginView from "../component/Login";
import {
  BellIcon,
  LogoutIcon,
  NotificationIcon,
  SettingIcon,
  UserIcon,
} from "./SVGIcon";
import { HeaderLoader } from "./HeaderLoader";
import Logo from "../../src/content/images/logo.png";

//This component is used for header section
export const Header = (props) => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [modalNotifyShow, setModalNofificationShow] = useState(false);
  const [modalMessageShow, setModalMessageShow] = useState(false);
  const [addressLine, setAddressLine] = useState("");
  const [showAddressError, setShowAddressError] = useState(false);
  const acAddress = useSelector(userDetails);
  const userDetailsAll = useSelector(userGetFullDetails);

  const modalToggle = () => setModalShow(!modalShow);
  const modalNotifyToggle = () => setModalNofificationShow(!modalNotifyShow);
  const modalMessageToggle = () => setModalMessageShow(!modalMessageShow);

  // Function to update the address line
  const updateAddressLine = () => {
    if (
      acAddress?.account && 
      userDetailsAll?.is_2FA_login_verified && userDetailsAll?.is_2FA_twilio_login_verified
    ) {
      setAddressLine(hideAddress(acAddress.account, 5)); // Hide address if verified
    } else {
      setAddressLine("Connect Wallet");
    }
  };

  useEffect(() => {
    updateAddressLine();
  }, [acAddress, userDetailsAll]); // Trigger when acAddress or userDetailsAll changes

  const checkAddressIntegrity = () => {
    const element = document.querySelector(".user-name");
    if (element && element.innerText === "") {
      setShowAddressError(true); // Set error if the address line is empty
    } else {
      setShowAddressError(false); // Reset error if address line is visible
    }
  };

  useEffect(() => {
    const interval = setInterval(checkAddressIntegrity, 500);
    return () => clearInterval(interval);
  }, [acAddress.authToken, addressLine]);

  const findFirebaseUserList = useCallback(async () => {
    if (acAddress?.authToken) {
      const starCountRef = ref(database, firebaseMessages.CHAT_ROOM);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.val()) {
          const allUnreadCount = Object.keys(snapshot.val()).filter(
            (element) => element.includes(acAddress?.account) && snapshot.val()[element]?.unreadcount?.[acAddress.account] > 0
          );
          setMessageCount(allUnreadCount.length);
        }
      });
    }
  }, [acAddress]);

  const findFirebaseUserListNotification = useCallback(async () => {
    if (acAddress?.authToken) {
      const starCountRef = ref(database, firebaseMessagesEscrow.CHAT_ROOM);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.val()) {
          const unreadCount = Object.values(snapshot.val()).filter((e) =>
            Object.keys(e).some((element) => {
              const receiverId = element.split("_")[0];
              return (
                receiverId === acAddress?.account &&
                e[element]?.unreadcount?.[acAddress.account] > 0
              );
            })
          );
          setNotificationCount(unreadCount.length);
        }
      });
    }
  }, [acAddress]);

  useEffect(() => {
    if (acAddress.authToken) {
      findFirebaseUserList();
      findFirebaseUserListNotification();
    }
  }, [acAddress.authToken, findFirebaseUserList, findFirebaseUserListNotification]);

  useEffect(() => {
    const handleScroll = () => {
      const moving = window.pageYOffset;
      setVisible(position > moving);
      setPosition(moving);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [position]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const renderModal = (show, handleClose) => (
    <LoginView
      show={show}
      onHide={handleClose}
      handleaccountaddress={() => setModalShow(false)}
    />
  );

  const cls = visible ? "visible" : "hidden";
  return (
    <div className={`header d-flex ${cls}`}>
      <Navbar.Toggle
        onClick={props.clickHandler}
        style={{ paddingLeft: "14px" }}
        className="d-block d-md-none"
        aria-controls="basic-navbar-nav"
      />
      <a className="menu-hide navbar-brand" href="/">
        <img src={Logo} alt="Logo" />
      </a>
      <Nav className="ms-auto" as="ul">
        {acAddress?.authToken ? (
          <>
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/chat">
                <NotificationIcon width="24" height="24" />
                {messageCount > 0 && (
                  <span className="notification-badge">{messageCount}</span>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/notification">
                <BellIcon width="24" height="24" />
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
              <Nav.Link
                as={Link}
                to="/chat"
                onClick={() => setModalMessageShow(true)}
              >
                <NotificationIcon width="24" height="24" />
              </Nav.Link>
              {modalMessageShow &&
                renderModal(modalMessageShow, () => setModalMessageShow(false))}
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={Link}
                to="/notification"
                onClick={() => setModalNofificationShow(true)}
              >
                <BellIcon width="24" height="24" />
              </Nav.Link>
              {modalNotifyShow &&
                renderModal(modalNotifyShow, () =>
                  setModalNofificationShow(false)
                )}
            </Nav.Item>
            {isMobile && (
              <>
                <div className="nav-item" onClick={() => setModalShow(true)}>
                  <img
                    className="rounded-circle"
                    src={require("../content/images/avatar1.png")}
                    alt="No Profile"
                    style={{ width: "48px", height: "48px" }}
                  />
                </div>
                {renderModal(modalShow, () => setModalShow(false))}
              </>
            )}
          </>
        )}
        <Nav.Item
          as="li"
          onClick={acAddress?.authToken ? null : props.clickModalHandler}
          className="login-menu"
        >
          {acAddress && (
            <span
              className={`user-name d-none d-md-block`}
              style={showAddressError ? { border: "1px solid red" } : {}}
            >
              {addressLine}
            </span>
          )}
        </Nav.Item>
        {acAddress &&
        acAddress?.authToken &&
        userDetailsAll?.is_2FA_login_verified &&
        userDetailsAll?.is_2FA_twilio_login_verified ? (
          <NavDropdown
            className="dropdownProfile"
            as="li"
            title={
              <img
                className="rounded-circle"
                src={
                  userDetailsAll?.imageUrl ||
                  require("../content/images/avatar1.png")
                }
                alt="No Profile"
                style={{ width: "48px", height: "48px" }}
              />
            }
            id="nav-dropdown"
          >
            <NavDropdown.Item as={Link} to={`/profile/${acAddress.account}`}>
              <UserIcon width="18" height="18" /> Profile
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/settings">
              <SettingIcon width="18" height="18" /> Account settings
            </NavDropdown.Item>
            <NavDropdown.Item onClick={props.signOut}>
              <LogoutIcon width="18" height="18" /> Sign out
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
