import { child, get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import { userDetails } from "../../store/slices/AuthSlice";
import { Timestamp } from "../../utils";
import { database, generateFirebaseChatRootKey } from "../../helper/config";
import { firebaseMessagesEscrow } from "../../helper/configVariables";
import { setUnReadCountZero } from "../../helper/firebaseConfigEscrow";
import { formateSize, RenderIcon } from "../../helper/RenderIcon";

export const MessageList = (props) => {
  const { ReciverId , escrowId} = props;
  const acAddress = useSelector(userDetails);
  const [messages, setMessages] = useState([]);
  const scrollBottom = document.getElementById("scrollBottom");
  const userData = useSelector(userDetails);
  const receiverData = useSelector((state) => state.chatEscrowReducer?.MessageUser);
 
  const mainFunction = async () => {
    if (userData?.account) {
      let firebaseRootKey = generateFirebaseChatRootKey(
        userData?.account,
        ReciverId
      );
      await get(
        child(ref(database), firebaseMessagesEscrow.CHAT_ROOM + escrowId + '/' + firebaseRootKey)
      ).then((snapshot) => {
        if (snapshot.val()) {
        } else {
          firebaseRootKey = generateFirebaseChatRootKey(
            ReciverId,
            userData?.account
          );
        }
      });

      const childKey = firebaseMessagesEscrow.CHAT_ROOM + escrowId + '/' +
        firebaseRootKey +
        "/" +
        firebaseMessagesEscrow.MESSAGES;
      const setReciverReadCountNode = ref(database, childKey);
      if (setReciverReadCountNode) {
        onValue(setReciverReadCountNode, (snapshot) => {
          if (
            ReciverId &&
            window.location.pathname === `/escrow/${ReciverId}` ||  window.location.pathname === `/escrow/${escrowId}`
          ) {
            if (snapshot.val()) {
              const values = snapshot.val();
              const nhuhbu = Object.values(values).filter(
                (o1) =>
                  (o1.reciverID === ReciverId &&
                    o1.senderID === userData?.account) ||
                  (o1.senderID === ReciverId &&
                    o1.reciverID === userData?.account)
              );
              if (nhuhbu.length > 0) {
                setMessages(nhuhbu);
              }
              setUnReadCountZero(
                //CHAT_ROOM,
                escrowId,
                userData?.account,
                ReciverId
              );
            }
          } else {
            if (window.location.pathname !== "/escrow") {
              window.localStorage.removeItem("user")
            }
          }
        });
      } else {

      }
    }
  };

  useEffect(() => {
    setMessages([])
    mainFunction();
  }, [escrowId , ReciverId]);

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
              {message?.senderID !== acAddress?.account && (
                <>
                  <div className="chat-image">
                    <img
                      src={
                        receiverData?.imageUrl
                          ? receiverData?.imageUrl
                          : require("../../content/images/avatar.png")
                      }
                      alt="Gabriel  Erickson"
                    />
                  </div>
                  <div>
                    <div className="name">
                      {receiverData?.fname_alias}{" "}{receiverData?.lname_alias}
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
              {message?.senderID === acAddress?.account && (
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
