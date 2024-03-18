import { child, get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import { userDetails, userGetFullDetails } from "../../store/slices/AuthSlice";
import { Timestamp } from "../../utils";
import { database, generateFirebaseChatRootKey } from "../../helper/config";

import { firebaseMessages } from "../../helper/chatMessage";

import { setUnReadCountZero } from "../../helper/firebaseConfig";
import { formateSize, RenderIcon } from "../../helper/RenderIcon";

export const MessageList = () => {
  const userDetailsAll = useSelector(userGetFullDetails);
  const [messages, setMessages] = useState([]);
  var scrollBottom = document.getElementById("scrollBottom");
  const userData = useSelector(userDetails);
  const receiverData = useSelector((state) => state.chatReducer?.MessageUser);

  const mainFunction = async () => {
    if (userData?.account && receiverData) {
      let firebaseRootKey = generateFirebaseChatRootKey(
        userData?.account,
        window.localStorage.getItem("user")
      );
      await get(
        child(ref(database), firebaseMessages.CHAT_ROOM + firebaseRootKey)
      ).then((snapshot) => {
        if (snapshot.val()) {
        } else {
          firebaseRootKey = generateFirebaseChatRootKey(
            window.localStorage.getItem("user"),
            userData?.account
          );
        }
      });

      const childKey =
        firebaseMessages.CHAT_ROOM +
        firebaseRootKey +
        "/" +
        firebaseMessages.MESSAGES;

      const setReciverReadCountNode = ref(database, childKey);
      if (setReciverReadCountNode) {
        onValue(setReciverReadCountNode, (snapshot) => {
          if (
            window.localStorage.getItem("user") &&
            window.location.pathname === "/chat"
          ) {
            if (snapshot.val()) {
              const values = snapshot.val();
              setUnReadCountZero(
                userData?.account,
                window.localStorage.getItem("user")
              );
              const nhuhbu = Object.values(values).filter((o1) => {
                return (
                  o1.senderID === userData?.account || o1.userStatus === false
                );
                // if(o1.senderID === userData?.account)
                // {
                //   return(
                //   ((o1.reciverID === window.localStorage.getItem("user") &&
                //   o1.senderID === userData?.account) ||
                //   (o1.senderID === window.localStorage.getItem("user") &&
                //     o1.reciverID === userData?.account))
                //   )
                // } else {
                //   return (
                //     o1.userStatus === false &&
                //     ((o1.reciverID === window.localStorage.getItem("user") &&
                //       o1.senderID === userData?.account) ||
                //       (o1.senderID === window.localStorage.getItem("user") &&
                //         o1.reciverID === userData?.account))
                //   );
                // }
              });

              if (nhuhbu.length > 0) {
                setMessages(nhuhbu);
              }
            }
          } else {
            if (window.location.pathname !== "/chat") {
              window.localStorage.removeItem("user");
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    mainFunction();
  }, [receiverData?.wallet_address]);

  useEffect(() => {
    if (scrollBottom) {
      scrollBottom.scrollTop = scrollBottom.scrollHeight;
    }
  }, [messages]);

  function downloadBase64File(file) {
    const linkSource = `data:${file.type};base64,${file?.url}`;
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = linkSource;
    downloadLink.target = "_self";
    downloadLink.download = file.name;
    downloadLink.click();
  }
  return (
    <PerfectScrollbar id="scrollBottom" options={{ suppressScrollX: true }}>
      {messages &&
        messages.map((message, index) => (
          <>
            <li key={message?.sender + index + "receiverData"}>
              {message?.senderID !== userDetailsAll?.wallet_address && (
                <>
                  <div className="chat-image">
                    <img
                      src={
                        receiverData?.imageUrl
                          ? receiverData?.imageUrl
                          : require("../../content/images/avatar.png")
                      }
                      alt="Gabriel Erickson"
                    />
                  </div>
                  <div>
                    <div className="name">
                      {receiverData?.fname_alias} {receiverData?.lname_alias}
                      <span>{Timestamp(message?.sendTime * 1000)}</span>
                    </div>
                    {message?.message !== "" && (
                      <>
                        <div className="chat-comment">{message?.message}</div>
                      </>
                    )}
                    {message?.file && message?.file != "" && (
                      <div className="chat-comment">
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => downloadBase64File(message?.file)}
                          download
                        >
                          <div>
                            {RenderIcon(message?.file?.name)}
                            <span>
                              {message?.file?.name}
                              {/* {getSubstringAfter(message?.file?.name, "_")} */}
                            </span>
                            <div className="file-size">
                              {message?.file?.size &&
                                formateSize(message?.file?.size)}
                            </div>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </li>

            <li key={message?.senderID + index + "sender"}>
              {message?.senderID === userDetailsAll?.wallet_address && (
                <>
                  <div className="name">
                    You <span>{Timestamp(message?.sendTime * 1000)}</span>
                  </div>

                  {message?.message !== "" && (
                    <>
                      <div className="chat-comment"> {message?.message}</div>
                    </>
                  )}
                  {message?.file && message?.file != "" && (
                    <div className="chat-comment">
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => downloadBase64File(message?.file)}
                      >
                        <div>
                          {RenderIcon(message?.file?.name)}
                          <span>
                            {message?.file?.name}
                            {/* {getSubstringAfter(message?.file?.name, "_")} */}
                          </span>
                          <div className="file-size">
                            {message?.file?.size &&
                              formateSize(message?.file?.size)}
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                </>
              )}
            </li>
          </>
        ))}
    </PerfectScrollbar>
  );
};

export default MessageList;
