import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./component/Sidebar";
import Header from "./component/Header";
import LoginView from "./component/Login";
import HomePageComponent from "./layout/homePageComponent";
import AccountSettingComponent from "./layout/AccountSettingComponent";
import NotificationComponent from "./layout/NotificationComponent";
import TraderProfileComponent from "./layout/TraderProfileComponent";
import ChatComponent from "./layout/ChatComponent";
import EscrowComponent from "./layout/EscrowComponent";
import EscrowDetails from "./layout/escrow/EscrowDetails";
import EscrowPay from "./layout/escrow/EscrowPay";
import EscrowSeller from "./layout/escrow/EscrowSeller";
import EscrowBuySell from "./layout/escrow/EscrowBuySell";
import TradeHistoryComponent from "./layout/TradeHistoryComponent";
import HelpCenterComponent from "./layout/HelpCenterComponent";
import ProtectedRoute from "./PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import {
  getCountryDetails,
  logoutAuth,
  userDetails,
  userGetData,
  userGetFullDetails,
} from "./store/slices/AuthSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { child, get, ref, update } from "firebase/database";
import { database } from "./helper/config";
import { firebaseMessages } from "./helper/chatMessage";
import jwtDecode from "jwt-decode";
import TwoFAvalidate from "./component/TwoFAvalidate";
import SnackBar from "./snackBar";

export const App = () => {
  const toastId = React.useRef(null);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const sidebarToggle = () => setIsOpen(!isOpen);
  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);
  const [isSign, setIsSign] = useState(null);
  const [isLogin, setisLogin] = useState(false);
  const acAddress = useSelector(userDetails);
  const token = localStorage.getItem("token");
  const [twoFAModal, setTwoFAModal] = useState(true);
  const [isResponsive, setIsResponsive] = useState(false);

  const handleAccountAddress = (address) => {
    setIsSign(false);
    setisLogin(true);
  };

  useEffect(() => {
    const handleResize = () => {
      // Check if the window width is below a specific breakpoint (e.g., 768px)
      setIsResponsive(window.innerWidth < 768);
    };

    handleResize();
    // Add an event listener to track window size changes
    window.addEventListener('resize', handleResize);
    
    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const userData = useSelector(userGetFullDetails);

  const signOut = () => {
    setIsSign(true);
  };
  useEffect(() => {
    dispatch(getCountryDetails());
  }, []);

  useEffect(() => {
    if (userData?.is_2FA_login_verified === false) {
      setTwoFAModal(true);
    }
  }, [userData]);

  useEffect(() => {
    if (acAddress.userid && token === acAddress?.authToken) {
      dispatch(userGetData(acAddress.userid));
      const interval = setInterval(function () {
        const decodedToken = jwtDecode(acAddress?.authToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          dispatch(logoutAuth()).unwrap();
        }
      }, 1000); // 5 seconds in milliseconds

      setInterval(function() {
        const dbOfflineRef = ref(database);
        get(
          child(dbOfflineRef, firebaseMessages?.CHAT_USERS + acAddress?.account)
        ).then((snapshot) => {
          const lastActive = snapshot.val()?.lastActive;
          const isOnline = snapshot.val()?.isOnline;
          const now = Date.now();
          const timeWindow = 3 * 60 * 1000;
          const timeDifference = now - lastActive;
          const isMoreThan30Minutes = timeDifference > timeWindow;

          if (isMoreThan30Minutes) {
           updateOffline();
          } 

          const timeWindowAbsent = 1 * 60 * 1000;
          const isMoreThan5Minutes = timeDifference > timeWindowAbsent;
          if(isMoreThan5Minutes && (isOnline != 2)){
            updateAbsent();
          }

          // if (now - lastActive > 10000) {
          //   // 10 seconds in milliseconds
          //   updateOffline();
          // }
        });
      }, 60000);

      // Set up the event listeners to update the user's last activity timestamp
      const updateLastActive = () => {
        const dbRef = ref(database);
        get(
          child(dbRef, firebaseMessages?.CHAT_USERS + acAddress?.account)
        ).then((snapshot) => {
          if (snapshot.exists()) {
            update(
              ref(database, firebaseMessages?.CHAT_USERS + acAddress?.account),
              {
                lastActive: Date.now(),
                isOnline: 1,
              }
            );
          }
        });
      };

      // Set up the event listeners to update the user's last activity timestamp
      const updateOffline = () => {
        const dbRef = ref(database);
        get(
          child(dbRef, firebaseMessages?.CHAT_USERS + acAddress?.account)
        ).then((snapshot) => {
          if (snapshot.exists()) {
            update(
              ref(database, firebaseMessages?.CHAT_USERS + acAddress?.account),
              {
                isOnline: 0,
              }
            );
          }
        });
      };

      const updateAbsent = () => {
        const dbRef = ref(database);
        get(
          child(dbRef, firebaseMessages?.CHAT_USERS + acAddress?.account)
        ).then((snapshot) => {
          if (snapshot.exists()) {
            update(
              ref(database, firebaseMessages?.CHAT_USERS + acAddress?.account),
              {
                isOnline: 2,
              }
            );
          }
        });
      };

      // window.addEventListener("beforeunload", updateOffline);
      // window.addEventListener("mousemove", updateLastActive);
      // window.addEventListener("keydown", updateLastActive);
      // window.addEventListener("scroll", updateLastActive);
      // window.addEventListener("click", updateLastActive);

      // Clean up the timer and event listeners when the component unmounts
      return () => {
        clearInterval(interval);
      };
    }
  }, [acAddress.userid, token]);

  return (
    <div>
      <Container fluid="xxl" className={`${isOpen ? "open-sidebar" : ""}`}>
        <ToastContainer />
        <SnackBar />
        <Sidebar
          clickHandler={sidebarToggle}
          setModalShow={setModalShow}
          setIsOpen={setIsOpen}
          isResponsive={isResponsive}
        />
        <div className="wrapper">
          <Header
            clickHandler={sidebarToggle}
            clickModalHandler={modalToggle}
            signOut={signOut}
          />

          <div className="contain">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <HomePageComponent />
                    {twoFAModal === true &&
                      userData?.is_2FA_login_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} />
                      )}
                  </>
                }
              />

              <Route path="/" element={<HomePageComponent />} />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AccountSettingComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notification"
                element={
                  <ProtectedRoute>
                    <NotificationComponent />
                  </ProtectedRoute>
                }
              />
              <Route path="/escrow-details/:id" element={<EscrowDetails />} />  
              <Route path="/escrow-buyer/:id" element={<EscrowBuySell />} /> 
              <Route path="/escrow-offer-buy" element={<EscrowPay />} />  
              <Route path="/escrow-seller/:address" element={<EscrowSeller />} />  
              <Route
                path="/profile/:address"
                element={
                  <>
                    <TraderProfileComponent isLogin={isLogin} />
                    {twoFAModal === true &&
                      userData?.is_2FA_login_verified === false && (
                        <TwoFAvalidate setTwoFAModal={setTwoFAModal} />
                      )}
                  </>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/escrow"
                element={
                  // <ProtectedRoute>
                  <EscrowComponent />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/trade"
                element={
                  // <ProtectedRoute>
                  <TradeHistoryComponent />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  // <ProtectedRoute>
                  <HelpCenterComponent />
                  // </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Container>
      <LoginView
        show={modalShow}
        onHide={() => setModalShow(false)}
        handleaccountaddress={handleAccountAddress}
        isSign={isSign}
        setTwoFAModal={setTwoFAModal}
      />
    </div>
  );
};

export default App;
