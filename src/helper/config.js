import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export const messageTypes = {
  TEXT: "text",
  ATTACHMENT: "attachment",
};

export const generateFirebaseChatRootKey = (senderID, reciverID) => {
  return senderID + "_" + reciverID;
};
export const firebaseConfig = {
  apiKey: "AIzaSyBshfPPHRX-33dJhkEk3kf4p48JMoO0ALA",
  authDomain: "middnapp.firebaseapp.com",
  databaseURL: "https://middnapp-default-rtdb.firebaseio.com",
  projectId: "middnapp",
  storageBucket: "middnapp.appspot.com",
  messagingSenderId: "395178453641",
  appId: "1:395178453641:web:0938ea378336fc31d8b458",
  measurementId: "G-D9L704632L"
};
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
