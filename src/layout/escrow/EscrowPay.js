import Picker from "emoji-picker-react";
import { get, ref, set, update } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { formateSize, RenderIcon } from "../../helper/RenderIcon";
import { IoIosCloseCircle } from "react-icons/io";
import { LinkSimpleIcon, SmileyIcon, BackArrow} from "../../component/SVGIcon";
import { notificationFail } from "../../store/slices/notificationSlice";
import {
  converImageToBase64,
  sendMessage,
} from "../../helper/firebaseConfigEscrow";
import { userGetFullDetails } from "../../store/slices/AuthSlice";
import { messageTypes } from "../../helper/config";
import MessageList from "./MessageList";
import { useLocation } from "react-router-dom";
import { database } from "../../helper/config";
import { firebaseMessagesEscrow } from "../../helper/configEscrow";
import { setIsChatEscrowPage } from "../../store/slices/chatEscrowSlice";
import jwtAxios from "../../service/jwtAxios";

export const EscrowPay = () => {
  const location = useLocation();
  const { state } = location;
  const dbRef = ref(database);

  const receiverAddress = state?.userAddress;
  const dispatch = useDispatch();
  const [showSmily, setShowSmily] = useState(false);
  const userDetailsAll = useSelector(userGetFullDetails);

  const emojiPickerRef = useRef(null);
  const [selectedEmoji, setSelectedEmoji] = useState([]);

  const userRef = useRef(null);
  const fileInputRef = useRef(null);
  const { onClickOutside } = <Picker />;
  const [messageText, setMessageText] = useState("");
  const [messageFile, setMessageFile] = useState("");

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleBack = () => {
    window.localStorage.removeItem("user");
    dispatch(setIsChatEscrowPage({ user: null, isChatOpen: true }));
  };

  useEffect(() => {
    window.localStorage.removeItem("user");
    dispatch(setIsChatEscrowPage({ user: null, isChatOpen: true }));
  }, []);

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowSmily(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  const handleTextChange = (event) => {
    setMessageText(event.target.value);
  };

  const handleFileSelection = async (event) => {
    const selectedFile = event.target.files[0];
    setMessageFile(selectedFile);
  };

  const handleDeselctImage = () => {
    setMessageFile("");
  };

  const smilyOpen = () => {
    setShowSmily(!showSmily);
  };

  const handleButtonClick = async () => {
    fileInputRef.current.click();
  };

  const handleInputFocus = (event) => {
    event.target.removeAttribute("placeholder");
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter") {
      const input = event.target;
      const newText = input.value.trim();
      if (newText !== "") {
        const selectedEmojisText = selectedEmoji.join("");
        const updatedText = `${messageText} ${selectedEmojisText} ${newText}`;
        setSelectedEmoji([]);
        input.value = updatedText.trim();
      }
    }
  };

  const onEmojiClick = (emojiData, event) => {
    const emoji = emojiData.emoji;
    setMessageText(`${messageText}${emoji}`);
    const selectedIndex = selectedEmoji.indexOf(emoji);
    if (selectedIndex === -1) {
      setSelectedEmoji([...selectedEmoji, emoji]);
    } else {
      const updatedSelectedEmojis = [...selectedEmoji];
      updatedSelectedEmojis.splice(selectedIndex, 1);
      setSelectedEmoji(updatedSelectedEmojis);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const messageText = e.target.elements?.content.value;
    let noError = true;
    const array_of_allowed_files = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "tiff",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "odt",
      "rtf",
      "mp3",
      "wav",
      "aiff",
      "aac",
      "mp4",
      "avi",
      "mov",
      "wmv",
    ];
    // Check if the uploaded file is allowed
    let file = {};
    if (messageFile) {
      const file_extension = messageFile.name.slice(
        ((messageFile.name.lastIndexOf(".") - 1) >>> 0) + 2
      );
      if (!array_of_allowed_files.includes(file_extension)) {
        noError = false;
        dispatch(notificationFail("Inappropriate file type"));
      } else {
        const allowed_file_size = 5;
        if (file.size / (1024 * 1024) > allowed_file_size || file.size < 1) {
          noError = false;
        } else {
          noError = true;
          let base64 = await converImageToBase64(messageFile);
          file = {
            name: messageFile?.name,
            size: messageFile?.size,
            type: messageFile?.type,
            url: base64,
          };
        }
      }
    }
    if (messageText !== "" || messageFile !== "" || !file) {
      if (
        userDetailsAll?.wallet_address &&
        receiverAddress &&
        noError == true
      ) {
        await addUserInFirebase(userDetailsAll?.wallet_address);
        await addUserInFirebase(receiverAddress);

        sendMessage(
          //CHAT_ROOM,
          messageText,
          userDetailsAll?.wallet_address,
          receiverAddress,
          messageFile ? messageTypes.ATTACHMENT : messageTypes.TEXT,
          file
        );
        // e.target.elements.content.value = "";
        setMessageFile("");
        setMessageText("");
      } else {
        ///token check
      }
    }
  };

  const addUserInFirebase = (address) => {
    jwtAxios
      .get(`/users/getUserByAddress/${address}`)
      .then((res) => {
        const user = res.data?.data;
        const userRef = ref(
          database,
          firebaseMessagesEscrow?.CHAT_USERS + user.wallet_address
        );
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              // User exists, update the data
              update(userRef, {
                fname_alias: user.fname_alias || "John",
                lname_alias: user.lname_alias || "Doe",
                imageUrl: user?.imageUrl ? user?.imageUrl : "",
              });
            } else {
              // User doesn't exist, add new data
              set(userRef, {
                wallet_address: user?.wallet_address,
                fname_alias: user.fname_alias || "John",
                lname_alias: user.lname_alias || "Doe",
                imageUrl: user?.imageUrl ? user?.imageUrl : "",
              });
            }
          })
          .catch((error) => {
            console.error("Error adding/updating user in Firebase:", error);
            dispatch(notificationFail("Something went wrong!"));
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="escrowPay">
      <Row>
        <Col lg="4">
          <Card className="cards-dark">
            <Card.Body>
            <div className="chat-box-pay">
              <div className="chat-box-seller">
              <div className="d-flex justify-content-between buyerBottom">
                <h3 className="text-white text-lg">
                  Contract : <span className="font-bold">Buyer</span>{" "}
                </h3>
                <span className="px-4 rounded-deposite">Depositing</span>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerBottom">
                <span class="card-txt-left">Price</span>
                <strong class="card-txt">105,02 BNB</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerBottom">
                <span class="card-txt-left">You are buying</span>
                <strong class="card-txt">1 BTC</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerBottom">
                <span class="card-txt-left">You must send</span>
                <strong class="card-txt">105,02 BNB</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerBottom">
                <span class="card-txt-left">Location</span>
                <strong class="card-txt">Anywhere</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerBottom">
                <span class="card-txt-left">Depositing window</span>
                <strong class="card-txt">29:42</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerBottom">
                <span class="card-txt-left">Payment window</span>
                <strong class="card-txt">60 minutes</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerBottom">
                <span class="card-txt-left">Buyer release address</span>
                <strong class="card-txt">0x...asd22A</strong>
              </div>

              </div>
              <div className="chat-box-btn">
                <button type="button" class="btn btn-primary escrowBtn">
                  Pay
                </button>

                <span class="card-txt-left">
                  You can cancel the contract once the depositing window is
                  expired
                </span>
              </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="8">
          <Card className="cards-dark chat-box">
            <Card.Body>
              <div className="d-flex items-center justify-content-between pe-4">
                <Card.Title as="h2">Chatbox</Card.Title>
               
              </div>
              <div className="chat-box-list">
                <ul>
                  <MessageList
                    ReciverId={receiverAddress}
                    EscrowPay={"escrow-offer"}
                  />
                 
                </ul>
                {showSmily && (
                  <div userRef={emojiPickerRef} className="emoji-picker">
                    <Picker
                      onEmojiClick={onEmojiClick}
                      autoFocusSearch={true}
                      className="emoji-popup"
                      theme="dark"
                      lazyLoadEmojis={true}
                    />
                  </div>
                )}

                <div
                  className="chat-action"
                  style={{ visibility: "visible" }}
                >
                  {messageFile && (
                    <div className="attach">
                      <div className="flex items-center justify-between px-2 py-1  border rounded-full shadow-md fileClass">
                        <div className="flex items-center space-x-2">
                          {RenderIcon(messageFile.name)}
                          <span className=" truncate">{messageFile.name}</span>
                          <IoIosCloseCircle
                            style={{ fontSize: "25px", marginLeft: "14px" }}
                            onClick={handleDeselctImage}
                          />
                          <div className="file-size">
                            {messageFile?.size &&
                              formateSize(messageFile?.size)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="messsge">
                    <div className="button-container">
                      <Button variant="link" onClick={() => smilyOpen()}>
                        <SmileyIcon width="20" height="20" />
                      </Button>
                      <Button
                        variant="link"
                        className="ms-3"
                        onClick={handleButtonClick}
                      >
                        <LinkSimpleIcon width="20" height="20" />
                      </Button>
                    </div>

                    <Form
                      className="input-container"
                      onSubmit={(e) => {
                        onSubmit(e);
                      }}
                    >
                      <input
                        userRef={fileInputRef}
                        type="file"
                        onChange={handleFileSelection}
                        style={{ display: "none" }}
                      />

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Send a message…"
                        name="content"
                        value={messageText}
                        onChange={handleTextChange}
                        onKeyPress={handleInputKeyPress}
                        onFocus={handleInputFocus}
                        autoComplete="off"
                      />

                      <Button variant="primary" type="submit" size="sm">
                        Send
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EscrowPay;
