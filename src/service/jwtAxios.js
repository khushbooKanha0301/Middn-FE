import axios from "axios";
import apiConfig from "../config/config";
// Base URL for API
const API_URL = `${apiConfig.BASE_URL}`;
const token = localStorage.getItem("token");

// Create an instance of axios with JWT authentication
const jwtAxios = axios.create({
  baseURL: API_URL, // YOUR_API_URL HERE
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    mode: "no-cors",
    "Access-Control-Allow-Origin": "*",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Interceptor to handle requests
jwtAxios.interceptors.request.use(
  (config) => {
    let throttleTime = localStorage.getItem("throttleTime");
    if (throttleTime) {
      throttleTime = JSON.parse(throttleTime);
      if (throttleTime[config.url]) {
        let storedTime = throttleTime[config.url];
        const currentTime = new Date().getTime();
        const futureTime = parseInt(storedTime);

        if (currentTime <= futureTime) {
          return Promise.reject(
            "Too Many Requests. Please Try after sometimes"
          );
        }
      }
    }
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle responses
jwtAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response &&
      err.response.data.message === "Authorization Token not valid."
    ) {
      window.localStorage.clear();
      window.location.href = "/";
    }
    if (
      err?.response?.data?.message ===
      "Too Many Requests. Please Try after sometimes"
    ) {
      const currentTime = new Date().getTime();
      const futureTime = currentTime + 60000;
      let apiThrottle = {};
      let throttleTime = localStorage.getItem("throttleTime");
      if (throttleTime) {
        throttleTime = JSON.parse(throttleTime);
        apiThrottle = throttleTime;
      }
      apiThrottle[err.config.url] = [futureTime];
      localStorage.setItem("throttleTime", JSON.stringify(apiThrottle));
    }
    if (err?.response && err?.response?.data?.message === 'Account not found.' && err?.response?.data?.logout !== true) {
      window.localStorage.clear();
      window.location.href="/";
    }
    if (err?.response && err?.response?.data?.message === 'You are Blocked by Admin.' && err?.response?.data?.logout !== true) {
      window.localStorage.clear();
      window.location.href="/";
    }

    return Promise.reject(err);
  }
);

// Function to set authentication token
export const setAuthToken = (token) => {
  if (token) {
    jwtAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete jwtAxios.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
};

export default jwtAxios;
