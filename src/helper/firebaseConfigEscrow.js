import { child, get, onValue, ref, set, update } from "firebase/database";
import moment from "moment";
import { database, generateFirebaseChatRootKey, messageTypes } from "./config";

import { firebaseMessagesEscrow } from "./configVariables";

// function setFirebaseChatage(
export const setFirebaseChatMessage = async (
  //CHAT_ROOM,
  serverTime,
  message,
  messageType,
  firebaseRootKey,
  escrowId,
  escrow_type,
  reciverID,
  senderID,
  file
) => {
  // firebase database successfully inserted record callback
  const childKey =
    firebaseMessagesEscrow.CHAT_ROOM +
    escrowId +
    "/" +
    firebaseRootKey +
    "/" +
    firebaseMessagesEscrow.MESSAGES +
    serverTime;
  set(
    ref(database, childKey),
    convertMessageObj(
      message,
      serverTime,
      messageType,
      escrowId,
      escrow_type,
      senderID,
      reciverID,
      file
    )
  )
    .then((sucess) => {
      setUnReadCount(escrowId, firebaseRootKey, reciverID, senderID, "NO");
    })
    .catch((error) => {
      console.log("err");
    });
};

function convertMessageObj(
  textMessage,
  sendTime,
  messageType,
  escrowId,
  escrow_type,
  senderID,
  reciverID,
  file
) {
  if (messageType === messageTypes.TEXT) {
    const firebaseInsertRecordObject = {
      message: textMessage,
      sendTime: sendTime,
      type: messageType,
      senderID: senderID,
      reciverID: reciverID,
      escrowId: escrowId,
      escrow_type: escrow_type,
      file: file,
    };
    return firebaseInsertRecordObject;
  } else {
    const firebaseInsertRecordObject = {
      message: textMessage,
      sendTime: sendTime,
      type: messageType,
      senderID: senderID,
      reciverID: reciverID,
      escrowId: escrowId,
      escrow_type: escrow_type,
      file: file,
    };
    return firebaseInsertRecordObject;
  }
}

export const setUnReadCount = async (
  escrowId,
  child,
  reciverID,
  senderID,
  isset
) => {
  let unreadCount = 1;
  let childKey =
    firebaseMessagesEscrow.CHAT_ROOM +
    escrowId +
    "/" +
    child +
    "/" +
    firebaseMessagesEscrow.UN_READ_COUNT;
  const setReciverReadCountNode = ref(database, childKey);

  if (setReciverReadCountNode) {
    onValue(setReciverReadCountNode, (snapshot) => {
      if (snapshot && snapshot.val()) {
        let findUser = snapshot.val();
        unreadCount = findUser[reciverID];
      }
    });
  }

  unreadCount = isset === "YES" ? unreadCount : unreadCount + 1;
  let updates = {};
  updates[reciverID] = unreadCount || 1;
  updates[senderID] = 0;
  update(ref(database, childKey), updates);
};

// onSend is use for send message
export const sendMessage = async (
  senderID,
  reciverID,
  escrowId,
  escrow_type,
  message,
  messageType = messageTypes.TEXT,
  file = null
) => {
  //let firebaseRootKey = generateFirebaseEscrowRootKey(escrowId);
  let firebaseRootKey = generateFirebaseChatRootKey(senderID, reciverID);
  get(
    child(
      ref(database),
      firebaseMessagesEscrow.CHAT_ROOM + escrowId + "/" + firebaseRootKey
    )
  )
    .then((snapshot) => {
      if (snapshot.val()) {
      } else {
        firebaseRootKey = generateFirebaseChatRootKey(reciverID, senderID);
        //firebaseRootKey = generateFirebaseEscrowRootKey(escrowId);
      }

      fetch("https://worldtimeapi.org/api/ip")
        .then((response) => response.json())
        .then((data) => {
          setFirebaseChatMessage(
            moment(data.datetime).utc().format("X"),
            message,
            messageType,
            firebaseRootKey,
            escrowId,
            escrow_type,
            reciverID,
            senderID,
            file
          );
        })
        .catch((error) => {
          setFirebaseChatMessage(
            moment(new Date()).utc().format("X"),
            message,
            messageType,
            firebaseRootKey,
            escrowId,
            escrow_type,
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
export const setUnReadCountZero = async (escrowId, senderID, reciverID) => {
  let firebaseRootKey = generateFirebaseChatRootKey(senderID, reciverID);
  //let firebaseRootKey = generateFirebaseEscrowRootKey(escrowID);
  await get(
    child(
      ref(database),
      firebaseMessagesEscrow.CHAT_ROOM + escrowId + "/" + firebaseRootKey
    )
  ).then((snapshot) => {
    if (snapshot.val()) {
    } else {
      //let firebaseRootKey = generateFirebaseEscrowRootKey(escrowID);
      firebaseRootKey = generateFirebaseChatRootKey(reciverID, senderID);
    }
  });

  let childKey =
    firebaseMessagesEscrow.CHAT_ROOM +
    escrowId +
    "/" +
    firebaseRootKey +
    "/" +
    firebaseMessagesEscrow.UN_READ_COUNT;
  await update(ref(database, childKey), {
    //[reciverID]: 0,
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
