import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import {
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get, ref, update } from "firebase/database";
import { database } from "./helper/config";
import { firebaseStatus } from "./helper/statusManage";
import jwtDecode from "jwt-decode";
import TwoFAvalidate from "./component/TwoFAvalidate";
import SnackBar from "./snackBar";

export const App = () => {
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
  }, [dispatch]);

  useEffect(() => {
    if (userData?.is_2FA_login_verified === false) {
      setTwoFAModal(true);
    }
  }, [userData]);

  useEffect(() => {
    const userRef = ref(database, firebaseStatus?.CHAT_USERS + acAddress?.account);
    
    if (acAddress.userid && token === acAddress?.authToken) {
       // Set up the event listeners to update the user's last activity timestamp
      const updateLastActive = () => {
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            update(
              userRef,
              {
                lastActive: Date.now(),
                isOnline: 1,
              }
            );
          }
        });
      };

      const updateAbsent = () => {
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            update(
              userRef,{
                isOnline: 2
              }
            );
          }
        });
      };

      // Set up the event listeners to update the user's last activity timestamp
      const updateOffline = () => {
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            update(
              userRef,
              {
                isOnline: 3,
                lastActive: Date.now()
              }
            );
          }
        });
      };

      dispatch(userGetData(acAddress.userid));

      const interval = setInterval(function () {
        const decodedToken = jwtDecode(acAddress?.authToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          dispatch(logoutAuth()).unwrap();
        }
      }, 1000); // 5 seconds in milliseconds

      let statusInterval = setInterval(function() {
        
        get(userRef).then((snapshot) => {
          const lastActive = snapshot.val()?.lastActive;
          const isOnline = snapshot.val()?.isOnline;
          const now = Date.now();
          const timeWindow = 1 * 60 * 60 * 1000;
          const timeDifference = now - lastActive;
          const isMoreThan30Minutes = timeDifference > timeWindow;

          if (isMoreThan30Minutes) {
           updateOffline();
          } 

          const timeWindowAbsent = 15 * 60 * 1000;
          const isMoreThan5Minutes = timeDifference > timeWindowAbsent;
          if(isMoreThan5Minutes  && (isOnline != 2)){
            updateAbsent();
          }
        });
      }, 900000);
      const handleBeforeUnload = () => {
        // Add your logic for handling before unload event
        updateOffline();
      };
    
      const handleMouseMove = () => {
        // Add your logic for handling mouse move event
        updateLastActive();
      };
    
      const handleKeyDown = () => {
        // Add your logic for handling key down event
        updateLastActive();
      };
    
      const handleScroll = () => {
        // Add your logic for handling scroll event
        updateLastActive();
      };
    
      const handleClick = () => {
        // Add your logic for handling click event
        updateLastActive();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("click", handleClick);
     
  
      // Clean up the listeners when the component unmounts or user logs out
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("click", handleClick);
  
        clearInterval(interval);
        clearInterval(statusInterval);
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
