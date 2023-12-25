import { combineReducers, configureStore } from "@reduxjs/toolkit";
import auth from "./slices/AuthSlice";
import chatReducer  from "./slices/chatSlice";
import commonReducer from "./slices/commonSlice";
import countrySlice from "./slices/countrySettingSlice";
import notificationReducer from "./slices/notificationSlice";
import cuurencyReducer from "./slices/currencySlice";

// const store = configureStore({
//     reducer:{
//         auth: AuthSlice,
//         commonSlice: commonSlice,
//     }
// })

const rootReducer = combineReducers({
  auth,
  commonReducer,
  notificationReducer,
  countrySlice,
  chatReducer,
  cuurencyReducer
});

const store = configureStore({ reducer: rootReducer });

export default store;
