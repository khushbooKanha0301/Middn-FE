import { child, get, onValue, ref, set, update } from "firebase/database";
import moment from "moment";
import { database, generateFirebaseChatRootKey, messageTypes } from "./config";

import { firebaseMessages } from "./configVariables";

// function setFirebaseChatage(
export const setFirebaseChatMessage = async (
  //CHAT_ROOM,
  serverTime,
  userStatus,
  message,
  messageType,
  firebaseRootKey,
  reciverID,
  senderID,
  file
) => {
  // firebase database successfully inserted record callback
  let childKey =
    firebaseMessages.CHAT_ROOM +
    firebaseRootKey +
    "/" +
    firebaseMessages.MESSAGES +
    serverTime;
  set(
    ref(database, childKey),
    convertMessageObj(
      userStatus,
      message,
      serverTime,
      messageType,
      senderID,
      reciverID,
      file
    )
  )
    .then((sucess) => {
      setUnReadCount(userStatus, firebaseRootKey, reciverID, senderID, "NO");
    })
    .catch((error) => {});
};

function convertMessageObj(
  userStatus,
  textMessage,
  sendTime,
  messageType,
  senderID,
  reciverID,
  file
) {
  if (messageType === messageTypes.TEXT) {
    let firebaseInsertRecordObject = {
      userStatus: userStatus,
      message: textMessage,
      sendTime: sendTime,
      type: messageType,
      senderID: senderID,
      reciverID: reciverID,
      file: file,
    };
    return firebaseInsertRecordObject;
  } else {
    let firebaseInsertRecordObject = {
      userStatus: userStatus,
      message: textMessage,
      sendTime: sendTime,
      type: messageType,
      senderID: senderID,
      reciverID: reciverID,
      file: file,
    };
    return firebaseInsertRecordObject;
  }
}
export const setUnReadCount = async (
  userStatus,
  child,
  reciverID,
  senderID,
  isset
) => {
  let unreadCount = 0;
  let childKey =
    firebaseMessages.CHAT_ROOM + child + "/" + firebaseMessages.UN_READ_COUNT;
  const setReciverReadCountNode = ref(database, childKey);

  if (setReciverReadCountNode) {
    onValue(
      setReciverReadCountNode,
      (snapshot) => {
        if (snapshot && snapshot.val()) {
          let findUser = snapshot.val();
          if (userStatus === true) {
            unreadCount = findUser[reciverID];
          }
        }
      },
      {
        // onlyOnce: true,
      }
    );
  }

  unreadCount =
    isset === "YES"
      ? unreadCount
      : userStatus === true
      ? unreadCount
      : unreadCount + 1;
  let updates = {};
  updates[reciverID] = unreadCount;
  updates[senderID] = 0;
  set(ref(database, childKey), updates);
};

// onSend is use for send message
export const sendMessage = async (
  userStatus,
  message,
  senderID,
  reciverID,
  messageType = messageTypes.TEXT,
  file = null
) => {
  let firebaseRootKey = generateFirebaseChatRootKey(senderID, reciverID);
  get(child(ref(database), firebaseMessages.CHAT_ROOM + firebaseRootKey))
    .then((snapshot) => {
      if (snapshot.val()) {
      } else {
        firebaseRootKey = generateFirebaseChatRootKey(reciverID, senderID);
      }

      fetch("https://worldtimeapi.org/api/ip")
        .then((response) => response.json())
        .then((data) => {
          setFirebaseChatMessage(
            moment(data.datetime).utc().format("X"),
            userStatus,
            message,
            messageType,
            firebaseRootKey,
            reciverID,
            senderID,
            file
          );
        })
        .catch((error) => {
          setFirebaseChatMessage(
            moment(new Date()).utc().format("X"),
            userStatus,
            message,
            messageType,
            firebaseRootKey,
            reciverID,
            senderID,
            file
          );
        });
    })
    .catch((error) => {
      console.error(error);
    });
};

export function getBase64(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {};
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
}

//for set UnreadCountZero when first time enter in chat screen
export const setUnReadCountZero = async (senderID, reciverID) => {
  let firebaseRootKey = generateFirebaseChatRootKey(senderID, reciverID);
  await get(
    child(ref(database), firebaseMessages.CHAT_ROOM + firebaseRootKey)
  ).then((snapshot) => {
    if (snapshot.val()) {
    } else {
      firebaseRootKey = generateFirebaseChatRootKey(reciverID, senderID);
    }
  });

  let childKey =
    firebaseMessages.CHAT_ROOM +
    firebaseRootKey +
    "/" +
    firebaseMessages.UN_READ_COUNT;

  await update(ref(database, childKey), {
    [senderID]: 0,
  });
};

export async function converImageToBase64(selectedFile) {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (e) => {
      let encoded = reader?.result?.toString().replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.readAsDataURL(selectedFile);
  });
}
