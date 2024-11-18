import "react-toastify/dist/ReactToastify.css";
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
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
import { get, ref, update, onValue } from "firebase/database";
import { database } from "./helper/config";
import { firebaseMessagesActive } from "./helper/configVariables";
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

const allowedIPs = [
  "122.161.187.102",
  "27.57.0.141"
];

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
  const userData = useSelector(userGetFullDetails);
  const [error, setError] = useState(null);

  const fetchIPAddress = useCallback(async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      if (!allowedIPs.includes(data.ip)) setError(new Error("Access Denied!!"));
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  }, []);

  useLayoutEffect(() => {
    fetchIPAddress();
  }, [fetchIPAddress]);

  const handleAccountAddress = (address) => {
    setIsSign(false);
    setisLogin(true);
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
    const is2FACompleted = userData?.is_2FA_login_verified;
    if (!is2FACompleted) {
      setTwoFAModal(true);  // Only show modal if 2FA is not completed
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
            setIsSign(true)
          }
        }
      });
    }
  }, [acAddress?.userid]);

  if (error) return <h1 className="accessMsg">{error.message}</h1>;

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
              signOut={() => setIsSign(true)}
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
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <AccountSettingComponent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/withdraw"
                  element={
                    <WithdrawComponent />
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
                  path="/marketplace"
                  element={<MarketPlaceComponent />}
                />
                <Route
                  path="/marketplace-deposit"
                  element={<MarketPlaceDepositComponent /> }
                />
                <Route
                  path="/marketplace-buy"
                  element={<MarketPlaceBuySell />}
                />
                <Route
                  path="/escrows"
                  element={<EscrowComponent />}
                />
                <Route
                  path="/trade"
                  element={ <TradeHistoryComponent />}
                />
                <Route
                  path="/help"
                  element={<HelpCenterComponent />}
                />
                <Route
                  path="/deposit"
                  element={<DepositCryptoComponent />}
                />
                <Route
                  path="/deposit"
                  element={<DepositCryptoComponent />}
                />
                <Route
                  path="/confirm-order"
                  element={
                    <BuyerConfirmOrder />
                  }
                />
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
        />
      </div>
    );
};

export default App;
