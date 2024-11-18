import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import jwtAxios, { setAuthToken } from "../../service/jwtAxios";
import { setLoading } from "./commonSlice";
import { setLoginLoading } from "./loginLoderSlice";
import { notificationFail, notificationSuccess } from "./notificationSlice";
import axios from "axios";
import apiConfigs from "../../config/config";
import listData from "../../component/countryData";
import { database } from "../../helper/config";
import { firebaseStatus } from "../../helper/configVariables";
import { get, ref, set, update } from "firebase/database";

const authTokenData = JSON.parse(window?.localStorage?.getItem("userData"))
  ?.authToken
  ? JSON.parse(window.localStorage.getItem("userData")).authToken
  : null;
const accountData = JSON.parse(window?.localStorage?.getItem("userData"))
  ?.account
  ? JSON.parse(window.localStorage.getItem("userData")).account
  : "Connect Wallet";

const useridData = JSON.parse(window?.localStorage?.getItem("userData"))?.userid
  ? JSON.parse(window.localStorage.getItem("userData")).userid
  : null;
const imageUrlData = JSON.parse(window?.localStorage?.getItem("userData"))
  ?.imageUrl
  ? JSON.parse(window.localStorage.getItem("userData")).imageUrl
  : null;

const initialState = {
  authdata: {
    account: accountData,
    authToken: authTokenData,
    userid: useridData,
    imageUrl: imageUrlData,
  },
  countryDetails: null,
};

export const checkAuth = createAsyncThunk(
  "checkAuth",
  async (action, { dispatch }) => {
    //dispatch(setLoading(true));
    try {
      let resBody = null;
      let account = action.account;
      let library = action.library;
      let checkValue = action.checkValue;
      var deactivate = action.deactivate;

      let signMessage = action.signMessage;
      let hideLoginModal = action.hideLoginModal;

      let signature;
      if (action.signature) {
        signature = action.signature;
      }
      let userData = {
        account: "Connect Wallet",
        authToken: null,
        userid: null,
      };
      // let signData = action.signData;
      if (!signature) {
        await jwtAxios
          .get(`/auth/nonce/${account}`, {
            headers: {
              "ngrok-skip-browser-warning": true,
              "Access-Control-Allow-Origin": "*",
            },
          })
          .then((response) => {
            resBody = response.data;
            setAuthToken(resBody.tempToken);
            return response.data;
          })
          .catch((error) => {
            window.localStorage.removeItem("token");
            window.localStorage.clear();
          });

        let provider = window.localStorage.getItem("provider");
        if (provider === "fortmatic") {
          signature = await window.web3.eth.personal.sign(
            resBody.message,
            account
          );
        } else if (provider === "coinbaseWallet") {
          signMessage({ message: resBody.message });
        } else if (provider === "walletConnect") {
          signMessage({ message: resBody.message });
        } else {
          signature = await library
            .getSigner(account)
            .signMessage(resBody.message);
        }
      }

      if (signature) {
        
        let verifyTokenData = await axios
          .post(
            `${apiConfigs.BASE_URL}users/verify?signatureId=${signature}`,
            { walletType: checkValue },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .catch((error) => {
            if (error.response.data.message) {
              dispatch(notificationFail(error.response.data.message));
            } else {
              dispatch(
                notificationSuccess(
                  "Something Went Wrong. Can you please Connect wallet again?"
                )
              );
            }
            window.localStorage.removeItem("token");
            window.localStorage.clear();
            deactivate();
          });
          
        if (verifyTokenData.data.token) {
          dispatch(setLoginLoading(true));
          window.localStorage.setItem("token", verifyTokenData.data.token);
          // setAuthToken(verifyTokenData.data.token)
          userData = {
            account: account,
            authToken: verifyTokenData.data.token,
            userid: verifyTokenData.data.user_id,
            imageUrl: verifyTokenData.data.imageUrl,
          };

          window.localStorage.setItem("userData", JSON.stringify(userData));
          if (hideLoginModal) {
            hideLoginModal();
          }
          const userRef = ref(
            database,
            firebaseStatus?.CHAT_USERS + userData?.account
          );
          get(userRef)
            .then(async (snapshot) => {
              set(userRef, {
                wallet_address: userData.account,
                fname_alias: userData.fname_alias || "John",
                lname_alias: userData.lname_alias || "Doe",
                imageUrl: userData?.imageUrl ? userData?.imageUrl : "",
                lastActive: Date.now(),
                isOnline: 1,
              });
              const uer =  await get(userRef)
            })
            .catch((error) => {
              console.error("Error adding/updating user in Firebase:", error);
              dispatch(notificationFail("Something went wrong!"));
            });

          // update(ref(database, firebaseMessages.CHAT_USERS + userData?.account), {isOnline:true});
          dispatch(setLoading(false));
          dispatch(setLoginLoading(false));
          if (
            verifyTokenData.data?.userInfo?.is_2FA_login_verified ===
              undefined ||
            verifyTokenData.data?.userInfo?.is_2FA_login_verified === true
          ) {
            dispatch(notificationSuccess("user login successfully"));
            // return userData;
          }

          return userData;
        }
      }
    } catch (error) {
      dispatch(setLoading(false));
      window.localStorage.clear();
      deactivate();
      return {
        account: "Connect Wallet",
        authToken: null,
        userid: null,
      };
    }
  }
);

export const logoutAuth = createAsyncThunk(
  "logoutAuth",
  async (action, { dispatch }) => {
    try {
      let accountAdrr = JSON.parse(
        window.localStorage.getItem("userData")
      ).account;

      const userRef = ref(database, firebaseStatus?.CHAT_USERS + accountAdrr);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          update(userRef, {
            lastActive: Date.now(),
            isOnline: 4,
          });
        }
      });
      jwtAxios
        .get(`/users/logout`)
        .then(() => {
          setAuthToken(null);
          window.localStorage.clear();
          window.localStorage.removeItem("token");
        })
        .catch((error) => {
          window.localStorage.clear();
          window.localStorage.removeItem("token");
          dispatch(notificationFail(error.response.data.message));
          dispatch(setLoading(false));
        });

      window.localStorage.removeItem("userData");

      let userData = {
        account: "Connect Wallet",
        authToken: null,
        userid: null,
      };
      dispatch(setLoading(false));
      return userData;
    } catch (error) {
      dispatch(setLoading(false));
      return error.message;
    }
  }
);

export const userGetData = createAsyncThunk(
  "userGetData",
  async (action, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      let user = {};
      let is_2FA_login_verified = false;
      let is_verified = 0;
      let kyc_completed = false;
      let is_2FA_enabled = false;
      let email_verified = false;
      let imageUrl = "";
      let email = "";
      await jwtAxios
        .get(`/users/getuser`, {
          headers: {
            "ngrok-skip-browser-warning": true,
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((response) => {
          is_2FA_login_verified = response.headers['2fa'] === 'true'; 
          is_2FA_enabled = response.headers['2fa_enable'] === 'true';
          is_verified = parseInt(response.headers['kyc_verify']) || 0;
          kyc_completed = response.headers['kyc_status'] === 'true';
          email_verified = response.headers['is_email_verified'] === 'true';
          email = response.headers['is_email']; 
          user = response.data.User;
          imageUrl = response.data.imageUrl;
        })
        .catch((error) => {
          dispatch(notificationFail("Something went wrong with get user"));
        });
      dispatch(setLoading(false));
      return { ...user, imageUrl: imageUrl , is_2FA_login_verified: is_2FA_login_verified,
        email_verified: email_verified, email: email,
        is_verified: is_verified, kyc_completed: kyc_completed, is_2FA_enabled: is_2FA_enabled};
    } catch (error) {
      dispatch(setLoading(false));
      return error.message;
    }
  }
);

export const getCountryDetails = createAsyncThunk(
  "getCountryDetails",
  async (action, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      // const response = await fetch ("https://ipapi.co/json/");
      const response = await fetch(`https://geolocation-db.com/json/`).then(
        (res) => res.json()
      );
      dispatch(setLoading(false));
      let country_calling_code =
        listData.find((x) => x.iso === response?.country_code).code || "";
      let countryData = Object.assign(response, {
        country_calling_code: country_calling_code,
      });
      return countryData;
    } catch (error) {
      dispatch(setLoading(false));
      return error.message;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.authdata = action.payload;
      })
      .addCase(logoutAuth.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.authdata = action.payload;
        state.userfulldata = null;
      })
      .addCase(userGetData.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.userfulldata = action.payload;
      })
      .addCase(getCountryDetails.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.countryDetails = action.payload;
      });
  },
});

export default authSlice.reducer;

export const userDetails = (state) => state.auth.authdata;
export const userGetFullDetails = (state) => state.auth.userfulldata;
