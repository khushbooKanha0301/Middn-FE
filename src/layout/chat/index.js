import Picker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  BackArrow,
  LinkSimpleIcon,
  SmileyIcon,
  SimpleDotedIcon,
} from "../../component/SVGIcon";
import { userDetails, userGetFullDetails } from "../../store/slices/AuthSlice";
import { setIsChatPage } from "../../store/slices/chatSlice";
import ChatLoader from "./ChatLoader";
import { messageTypes } from "../../helper/config";
import { converImageToBase64, sendMessage } from "../../helper/firebaseConfig";
import MessageList from "./MessageList";
import { formateSize, RenderIcon } from "../../helper/RenderIcon";
import UserList from "./UserList";
import { notificationFail, notificationSuccess } from "../../store/slices/notificationSlice";
import ReportUserView from "../../component/ReportUser";
import jwtAxios from "../../service/jwtAxios";

export const Chat = () => {
  const [user, setUser] = useState("");
  const acAddress = useSelector(userDetails);
  const [messages, setMessages] = useState([]);
  const [showSmily, setShowSmily] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageFile, setMessageFile] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState([]);
  const emojiPickerRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const receiverData = useSelector((state) => state.chatReducer?.MessageUser);
  const [ReciverId, setReciverId] = useState(null);
  const [reportModelOpen, setReportModelOpen] = useState(false);
  const [reportModelData, setReportModelData] = useState(null);

  let scrollBottom = document.getElementById("scrollBottom");

  useEffect(() => {
    window.localStorage.removeItem("user");
    dispatch(setIsChatPage({ user: null, isChatOpen: true }));
  }, []);

  useEffect(() => {
    if (ReciverId) {
      setMessageText("");
      setUser(receiverData);
    }
  }, [ReciverId]);

  useEffect(() => {
    dispatch(setIsChatPage({ user: user, isChatOpen: true }));
  }, [user]);
  
  const smilyOpen = () => {
    setShowSmily(!showSmily);
  };

  const userRef = useRef(null);
  const { onClickOutside } = <Picker />;

  const handleTextChange = (event) => {
    setMessageText(event.target.value);
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = async () => {
    fileInputRef.current.click();
  };

  const handleFileSelection = async (event) => {
    const selectedFile = event.target.files[0];
    setMessageFile(selectedFile);
  };

  const handleDeselctImage = () => {
    setMessageFile("");
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

  const handleBack = () => {
    window.localStorage.removeItem("user");
    dispatch(setIsChatPage({ user: null, isChatOpen: true }));
  };

  useEffect(() => {
    if (scrollBottom) {
      scrollBottom.scrollTop = scrollBottom.scrollHeight;
    }
  }, [messages]);

  const handleInputFocus = (event) => {
    event.target.removeAttribute("placeholder");
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
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
        acAddress?.account &&
        receiverData?.id &&
        noError == true
      ) {
        try {
          const reqData = {
            block_from_user_address: acAddress?.account,
            block_to_user_address: receiverData?.id,
          };
          const result = await jwtAxios.post(
            `/users/getUserStatusToMessage`,
            reqData
          );

          if (result?.data?.reportUser) {
            sendMessage(
              result?.data?.reportUser?.userStatus,
              messageText,
              acAddress?.account,
              receiverData?.id,
              messageFile ? messageTypes.ATTACHMENT : messageTypes.TEXT,
              file
            );
            // e.target.elements.content.value = "";
            setMessageFile("");
            setMessageText("");
          } else {
            dispatch(notificationFail("Something went wrong"));
            return null; // Return null or some other default value
          }
        } catch (error) {
          console.error("Error fetching user status:", error);
          dispatch(notificationFail("Error fetching user status"));
          return null; // Return null or some other default value
        }
      }
    }
  };

  const modalToggle = (id) => {
    setReportModelOpen(!reportModelOpen);
    setReportModelData(id);
  };

  const userBlockedCheck = async (id, status) => {
    const reqData = {
      to_block_user: id,
      userStatus: status === "Block" ? true : false
    };
    await jwtAxios
      .post(`/users/userBlockStatus`, reqData)
      .then((result) => {
        if (result) {
          setUser(prevData => ({
            ...prevData,
            userStatus: result?.data?.blockUser?.userStatus
          }));
          dispatch(notificationSuccess(result?.data?.message));
        }
      })
      .catch((error) => {
        if (typeof error == "string") {
          dispatch(notificationFail(error));
        }
        if (error?.response?.data?.message === "") {
          dispatch(notificationFail("Invalid "));
        }
        if (error?.response?.data?.message) {
          dispatch(notificationFail(error?.response?.data?.message));
        }
      });
  } 

  return (
    <div className="chat-view">
      {loader ? (
        <ChatLoader />
      ) : (
        <Row>
          <UserList setLoader={setLoader} setReciverId={setReciverId} />
          <Col
            lg="8"
            className={`${receiverData?.id ? "show-mobile" : "hide-mobile"}`}
          >
            <Card className="cards-dark chat-box">
              <Card.Body>
                <div className="d-flex items-center justify-content-between chat-box-drop">
                  <Card.Title as="h2">
                    <Button
                      variant="primary"
                      type="button"
                      className="back-button"
                      onClick={handleBack}
                    >
                      <BackArrow width={16} height={16} />
                    </Button>
                    <p>Messages</p>
                  </Card.Title>
                  {receiverData ? (
                    <div style={{ paddingRight: "32px"}}>
                      <Nav as="ul">
                        <NavDropdown
                          as="li"
                          title={<SimpleDotedIcon width="20" height="20" />}
                          id="nav-dropdown"
                        >
                          {user?.userStatus || receiverData?.userStatus ? (
                            <NavDropdown.Item
                              onClick={() =>
                                userBlockedCheck(receiverData?.id, "Unblock")
                              }
                            >
                              Unblock User
                            </NavDropdown.Item>
                          ) : (
                            <NavDropdown.Item
                              onClick={() =>
                                userBlockedCheck(receiverData?.id, "Block")
                              }
                            >
                              Block User
                            </NavDropdown.Item>
                          )}

                          <NavDropdown.Item
                            onClick={() =>
                              modalToggle(receiverData?.id)
                            }
                          >
                            Report User
                          </NavDropdown.Item>
                        </NavDropdown>
                      </Nav>
                    </div>
                  ) : null}

                </div>
                <div className="chat-box-list">
                  <ul>
                    {receiverData ? (
                      <MessageList ReciverId={ReciverId} />
                    ) : (
                      <div className="no-chat-msg">No Messages yet...</div>
                    )}
                  </ul>
                  {showSmily && (
                    <div ref={emojiPickerRef} className="emoji-picker">
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
                    style={{ visibility: receiverData ? "visible" : "hidden" }}
                  >
                    {messageFile && (
                      <div className="attach">
                        <div className="flex items-center justify-between px-2 py-1  border rounded-full shadow-md fileClass">
                          <div className="flex items-center space-x-2">
                            {RenderIcon(messageFile.name)}
                            <span className=" truncate">
                              {messageFile.name}
                            </span>
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
                          ref={fileInputRef}
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
                          
                          <span className="chat-send-btn">Send</span>
                          <img
                            className="chat-send-btn-icon"
                            src={require("../../content/images/Frame.png")}
                          />
                      
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <ReportUserView
        show={reportModelOpen}
        onHide={() => setReportModelOpen(false)}
        id={reportModelData}
      />
    </div>
  );
};

export default Chat;
