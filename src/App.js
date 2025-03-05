import "react-toastify/dist/ReactToastify.css";
import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect
} from "react";
import { ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./component/Sidebar";
import Header from "./component/Header";
import LoginView from "./component/Login";
import ProtectedRoute from "./PrivateRoute";
import TwoFAvalidate from "./component/TwoFAvalidate";
import SnackBar from "./snackBar";
import {
  getCountryDetails,
  logoutAuth,
  userDetails,
  userGetData,
  userGetFullDetails,
} from "./store/slices/AuthSlice";
import { notificationFail } from "./store/slices/notificationSlice";
import { get, ref, update, onValue } from "firebase/database";
import { database } from "./helper/config";
import { firebaseMessagesActive } from "./helper/configVariables";
import TwoFATwilioValidate from "./component/TwoFATwilioValidate";
import jwtDecode from "jwt-decode";
import {
  HomePageComponent,
  AccountSettingComponent,
  NotificationComponent,
  TraderProfileComponent,
  ChatComponent,
  EscrowComponent,
  EscrowDetails,
  Escrows,
  TradeHistoryComponent,
  HelpCenterComponent,
  MarketPlaceComponent,
  MarketPlaceBuySell,
  DepositCryptoComponent,
  BuyerConfirmOrder,
  MarketPlaceDepositComponent,
  WithdrawComponent,
} from "./layout";
import jwtAxios from "./service/jwtAxios";

const allowedIPs = [
  "49.48.248.202",
  "136.185.123.45",
  "2403:6200:8892:408b:7c4c:cd69:16b6:7bb7"
];

export const App = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const sidebarToggle = () => setIsOpen(!isOpen);
  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);
  const [isSign, setIsSign] = useState(null);
  const acAddress = useSelector(userDetails);
  const token = localStorage.getItem("token");
  const [twoFAModal, setTwoFAModal] = useState(true);
  const [isResponsive, setIsResponsive] = useState(false);
  const userData = useSelector(userGetFullDetails);
  const [error, setError] = useState(null);
  const [ipAddress, setIPAddress] = useState(null);
  const [isIpGetted, setIsIpGetted] = useState(false);
  const [isTOTPRequested, setIsTOTPRequested] = useState(false);
  const [isTOTPTriggered, setIsTOTPTriggered] = useState(false); // Track if TOTP has already been triggered
  const [twoFATwilioModal, setTwoFATwilioModal] = useState(false);
  const hasRun = useRef(false);
 
  // Function to fetch the public IP
  const fetchIPAddress = async () => {
    try {
      const response = await fetch("https://api64.ipify.org?format=json"); // API to fetch public IP
      const data = await response.json();
      setIPAddress(data.ip);
      setIsIpGetted(true);
  
      // Check if the fetched IP is allowed
      if (isIpGetted && allowedIPs.includes(data.ip)) {
        setError(null); // Clear any previous error
      } else {
        setError(new Error("Access Denied!! IP not in whitelist:", data.ip));
      }
    } catch (error) {
      setIsIpGetted(true);
      console.error("Error fetching IP address:", error);
    }
  };
  
  useLayoutEffect(() => {
    fetchIPAddress();
  }, [fetchIPAddress]);

  const handleAccountAddress = (address) => {
    setIsSign(false);
  };
  const sendTwilioOTP = async (phoneCountry, phoneNumber) => {
    if (phoneNumber && phoneCountry) {
      try {
        const response = await jwtAxios.post("users/sendTOTP", {
          phone: phoneNumber,
          phoneCountry: phoneCountry,
        });

        if (response?.data?.sid) {
          setIsTOTPTriggered(true);
          setTwoFATwilioModal(true);
          localStorage.setItem("isTOTPTriggered", "true");
          const expiryTime = Date.now() + 20 * 1000; // 20 seconds from now
          localStorage.setItem("expiryTime", expiryTime.toString());
        } else {
          setTwoFATwilioModal(false);
          setIsTOTPTriggered(false);
          disconnect();
        }
      } catch (error) {
        dispatch(
          notificationFail(
            error?.response?.data?.message || "Something Went Wrong"
          )
        );
        disconnect();
      }
    }
  };

  useEffect(() => {
    const handleResize = () => setIsResponsive(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getCountryDetails());
  }, []);

  useEffect(() => {
    if (userData && userData?.length !== 0) {
      if (hasRun.current) return;
      if (userData && userData?.is_2FA_login_verified === false) {
        setTwoFAModal(true);
        hasRun.current = true;
      } else if (
        userData &&
        userData?.is_2FA_twilio_login_verified === false &&
        userData?.is_2FA_login_verified === true &&
        userData?.phoneCountry &&
        userData?.phone &&
        userData?.is_2FA_SMS_enabled
      ) {
        const isTOTPTriggeredFromStorage =
          localStorage.getItem("isTOTPTriggered") === "true";
        if (isTOTPTriggeredFromStorage) {
          setTwoFATwilioModal(true);
        } else {
          sendTwilioOTP(userData?.phoneCountry, userData?.phone);
        }
        hasRun.current = true;
      }
    } else {
      hasRun.current = false;
    }
  }, [userData]);

  const updateFirebaseStatus = (status) => {
    const userRef = ref(
      database,
      `firebaseStatus/CHAT_USERS/${acAddress.account}`
    );
    get(userRef).then((snapshot) => {
      if (snapshot.exists())
        update(userRef, { isOnline: status, lastActive: Date.now() });
    });
  };

  useEffect(() => {
    if (!acAddress.userid || token !== acAddress?.authToken) return;
    const userRef = ref(
      database,
      `firebaseStatus/CHAT_USERS/${acAddress.account}`
    );
    dispatch(userGetData(acAddress.userid));
    const handleAuthTokenExpiration = setInterval(() => {
      const decodedToken = jwtDecode(acAddress?.authToken);
      if (decodedToken.exp < Date.now() / 1000) dispatch(logoutAuth()).unwrap();
    }, 1000);

    const statusInterval = setInterval(() => {
      get(userRef).then((snapshot) => {
        const { lastActive, isOnline } = snapshot.val() || {};
        const now = Date.now();
        if (now - lastActive > 60 * 60 * 1000) updateFirebaseStatus(3);
        else if (now - lastActive > 15 * 60 * 1000 && isOnline !== 2)
          updateFirebaseStatus(2);
      });
    }, 900000);

    const updateOnlineStatus = () => updateFirebaseStatus(1);

    ["beforeunload", "mousemove", "keydown", "scroll", "click"].forEach(
      (event) => window.addEventListener(event, updateOnlineStatus)
    );

    return () => {
      clearInterval(handleAuthTokenExpiration);
      clearInterval(statusInterval);
      ["beforeunload", "mousemove", "keydown", "scroll", "click"].forEach(
        (event) => window.removeEventListener(event, updateOnlineStatus)
      );
    };
  }, [acAddress.userid, token]);

  useEffect(() => {
    if (acAddress?.userid) {
      const childKey =
        firebaseMessagesActive.Middn_USERS + "/" + acAddress?.userid;
      const setReciverReadCountNode = ref(database, childKey);
      onValue(setReciverReadCountNode, (snapshot) => {
        if (snapshot && snapshot.val() && localStorage.getItem("token")) {
          const findUser = snapshot.val();
          if (findUser.is_active === true) {
            setIsSign(true);
          }
        }
      });
    }
  }, [acAddress?.userid]);

  const disconnect = () => {
    setIsSign(true); // Reset the signing status
    setTwoFAModal(false);
    setTwoFATwilioModal(false); // Close 2FA modal if open
    setIsTOTPTriggered(false); // Reset TOTP status
    localStorage.removeItem("isTOTPTriggered"); // Clear TOTP flag
  };

 //if (allowedIPs.includes(ipAddress) && isIpGetted) {
    return (
      <div>
        <Container
          fluid="xxl"
          className={`${isOpen ? "open-sidebar" : "close-sidebar"}`}
        >
          <ToastContainer />
          <SnackBar />
          <Sidebar
            clickHandler={sidebarToggle}
            setModalShow={setModalShow}
            setIsOpen={setIsOpen}
            isResponsive={isResponsive}
          />
          <div
            className={`wrapper ${isOpen ? "open-sidebar" : "close-sidebar"}`}
          >
            <Header
              clickHandler={sidebarToggle}
              clickModalHandler={modalToggle}
              signOut={disconnect}
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
                          <TwoFAvalidate setTwoFAModal={setTwoFAModal} istotptriggered={isTOTPTriggered}
                          settwofatwiliomodal={setTwoFATwilioModal} 
                          setistotptriggered={setIsTOTPTriggered} userData={userData} sendtwiliootp={sendTwilioOTP} />
                        )}
                      {userData &&
                      userData?.is_2FA_twilio_login_verified === false && twoFATwilioModal && userData?.is_2FA_login_verified === true && userData?.is_2FA_SMS_enabled && (
                          <TwoFATwilioValidate 
                            setTwoFATwilioModal={setTwoFATwilioModal} 
                            setIsTOTPRequested={setIsTOTPRequested} 
                            setistotptriggered={setIsTOTPTriggered}
                            settwofatwiliomodal={setTwoFATwilioModal} 
                          />
                        )}
                    </>
                  }
                />
                <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <AccountSettingComponent />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/withdraw" element={<WithdrawComponent />} />
                  <Route
                    path="/notification"
                    element={
                      <ProtectedRoute>
                        <NotificationComponent />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/:address"
                    element={
                      <>
                        <TraderProfileComponent />
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
                  <Route path="/marketplace" element={<MarketPlaceComponent />} />
                  <Route
                    path="/marketplace-deposit"
                    element={<MarketPlaceDepositComponent />}
                  />
                  <Route
                    path="/marketplace-buy"
                    element={<MarketPlaceBuySell />}
                  />
                  <Route path="/escrows" element={<EscrowComponent />} />
                  <Route path="/trade" element={<TradeHistoryComponent />} />
                  <Route path="/help" element={<HelpCenterComponent />} />
                  <Route path="/deposit" element={<DepositCryptoComponent />} />
                  <Route path="/deposit" element={<DepositCryptoComponent />} />
                  <Route path="/confirm-order" element={<BuyerConfirmOrder />} />
                  <Route path="/" element={<HomePageComponent />} />
                  <Route path="/escrow/details/:id" element={<EscrowDetails />} />
                  <Route path="/escrow/:id" element={<Escrows />} />
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
          setTwoFATwilioModal={setTwoFATwilioModal}
          isTOTPRequested={isTOTPRequested}
          isTOTPTriggered={isTOTPTriggered}
          setIsTOTPRequested={setIsTOTPRequested} 
          setIsTOTPTriggered={setIsTOTPTriggered}
          sendtwiliootp={sendTwilioOTP}
        />
      </div>
    );
  // } else if (error) {
  //   return <h1 className="accessMsg">{error.message}</h1>;
  // }
};

export default App;
