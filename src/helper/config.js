import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export const firebaseMessages = {
  CHAT_ROOM: "chat/chat_room/",
  CHAT_USERS: "chat/users/",
  MESSAGES: "messages/",
  UN_READ_COUNT: "unreadcount",
};

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
