import Picker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { formateSize, RenderIcon } from "../../helper/RenderIcon";
import { Stepper, Step, StepLabel } from "@mui/material";
import { IoIosCloseCircle } from "react-icons/io";
import {
  BackArrow,
  LinkSimpleIcon,
  SmileyIcon,
  SimpleDotedIcon,
  EyeIcon,
} from "../../component/SVGIcon";
import { notificationFail } from "../../store/slices/notificationSlice";
import {
  converImageToBase64,
  sendMessage,
} from "../../helper/firebaseConfigEscrow";
import { userDetails } from "../../store/slices/AuthSlice";
import { messageTypes } from "../../helper/config";
import MessageList from "./MessageList";
import { setIsChatEscrowPage } from "../../store/slices/chatEscrowSlice";
import jwtAxios from "../../service/jwtAxios";
import { get, ref, set, update } from "firebase/database";
import { database } from "../../helper/config";
import {
  firebaseMessagesEscrow,
  firebaseStatus,
} from "../../helper/configVariables";
import Swal from "sweetalert2/src/sweetalert2.js";

export const EscrowSeller = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [pageStepperArr, setPageStepperArr] = useState([0]);
  const [user, setUser] = useState({});
  const [escrowType, setEscrowType] = useState(null);
  const [escrowFund, setEscrowFund] = useState(null);
  const [escrowCompleted, setEscrowCompleted] = useState(null);
  const { id } = props;
  const dispatch = useDispatch();
  const [showSmily, setShowSmily] = useState(false);
  const acAddress = useSelector(userDetails);
  const emojiPickerRef = useRef(null);
  const [selectedEmoji, setSelectedEmoji] = useState([]);
  const [escrow, setEscrow] = useState(null);
  const receiverAddress =
    acAddress?.account === escrow?.user_address
      ? escrow?.trade_address
      : escrow?.user_address;
  const userRef = useRef(null);
  const fileInputRef = useRef(null);
  const { onClickOutside } = <Picker />;
  const [messageText, setMessageText] = useState("");
  const [messageFile, setMessageFile] = useState("");
  const [escrowLoading, setEscrowLoading] = useState(false);
  const receiverData = useSelector((state) => state.chatReducer?.MessageUser);
  const steps = [
    {
      label: "Buyer to make payment",
      status: "105,02 BNB",
    },
    {
      label: "The funds is locked in Middn",
      status: "105,02 BNB",
    },
    {
      label: "Check for Payment",
      status: "Completed",
    },
  ];
  const CustomStepIcon = (props) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-check-circle"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
      </svg>
    );
  };
  const handleStepClick = (indexnUM) => {
    const indexValue = [...new Set([...pageStepperArr, indexnUM])].sort(
      (a, b) => a - b
    );
    if (indexnUM === 0) {
      setActiveStep(0);
      setPageStepperArr([0]);
    } else if (activeStep < steps.length - 1) {
      if (
        (!String(indexnUM)?.includes("2") || indexnUM === 2) &&
        indexValue?.filter((x) => [0, 1]?.includes(x))?.length === 2
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setPageStepperArr(indexValue);
      }
    } else {
      handleReset();
      setPageStepperArr([0]);
    }
  };
  const handleReset = () => {
    setActiveStep(0);
  };
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
      if (acAddress?.account && receiverAddress && noError == true) {
        addUserInFirebase(acAddress?.account);
        addUserInFirebase(receiverAddress);
        sendMessage(
          //CHAT_ROOM,
          acAddress?.account,
          receiverAddress,
          id,
          escrow?.escrow_type,
          messageText,
          messageFile ? messageTypes.ATTACHMENT : messageTypes.TEXT,
          file
        );
        // e.target.elements.content.value = "";
        setMessageFile("");
        setMessageText("");
      }
    }
  };

  const modalToggle = async (id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${status} this user?`,
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#808080",
      confirmButtonText: "Yes",
      customClass: {
        popup: "suspend",
      },
    }).then(async (result) => {
      let user;
      if (status === "Block") {
        user = {
          userStatus: true,
        };
      } else {
        user = {
          userStatus: false,
        };
      }
      jwtAxios
        .put(`/users/userBlocked/${id}`, user)
        .then(async (res) => {
          Swal.fire(`${status}!`, "This User has been Blocked ...", "danger");
          const userRef = ref(database, firebaseStatus?.CHAT_USERS + id);
          await update(userRef, user);
          const updatedSnapshot = await get(userRef);
          setUser((prevData) => ({
            ...prevData,
            userStatus: updatedSnapshot.val()?.userStatus,
          }));
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
    });
  };

  const addUserInFirebase = (address) => {
    jwtAxios
      .get(`/users/getUserByAddress/${address}`)
      .then((res) => {
        const user = res.data?.data;
        const userRef = ref(
          database,
          firebaseMessagesEscrow?.CHAT_USERS + user?.wallet_address
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

  useEffect(() => {
    jwtAxios
      .get(`/escrows/getEscrowsById/${id}`)
      .then((res) => {
        setEscrow(res.data?.data);
        setEscrowLoading(true);
      })
      .catch((err) => {
        setEscrowLoading(true);
        console.log(err);
      });
  }, [acAddress?.authToken, id]);

  const handleCheckboxChange = (filterType) => {
    setEscrowType(filterType);
  };

  const handleCheckboxChangeFund = (filterType) => {
    setEscrowFund(filterType);
  };

  const handleCheckboxChangeCompleted = (filterType) => {
    setEscrowCompleted(filterType);
  };

  return (
    <>
      <div className="chat-view chat-messages" style={{ marginBottom: "25px" }}>
        <Row>
          <Col lg="4">
            <Card className="cards-dark">
              <Card.Body>
                <div className="chat-box-pay">
                  <div className="chat-box-seller">
                    <div className="d-flex justify-content-between buyerBottom">
                      <span className="text-white text-lg">
                        Contract :{" "}
                        <span className="font-bold">
                          {escrowLoading && (
                            <>
                              {escrow?.user_address ===
                              acAddress?.account
                                ? escrow?.escrow_type === "seller"
                                  ? "Seller"
                                  : "Buyer"
                                : escrow?.escrow_type === "seller"
                                ? "Buyer"
                                : "Seller"}
                            </>
                          )}
                        </span>{" "}
                      </span>
                      <span className="rounded-deposite">Depositing</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center buyerBottom">
                      <span className="card-txt-left">Price</span>
                      <strong className="card-txt">105,02 BNB</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center buyerBottom">
                      <span className="card-txt-left">You are buying</span>
                      <strong className="card-txt">1 BTC</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center buyerBottom">
                      <span className="card-txt-left">You must send</span>
                      <strong className="card-txt">105,02 BNB</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center buyerBottom">
                      <span className="card-txt-left">Location</span>
                      <strong className="card-txt">Anywhere</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center buyerBottom">
                      <span className="card-txt-left">Depositing window</span>
                      <strong className="card-txt">29:42</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center buyerBottom">
                      <span className="card-txt-left">Payment window</span>
                      <strong className="card-txt">60 minutes</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center buyerBottomLast">
                      <span className="card-txt-left">
                        Buyer release address
                      </span>
                      <strong className="card-txt">0x...asd22A</strong>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="cards-dark seller-pay">
              <Card.Body>
                <div className="chat-box-pay">
                  <div className="d-flex justify-content-between buyerBottom">
                    <span className="text-white text-lg">Status</span>
                    <div>
                      <p
                        style={{
                          fontFamily: " Eudoxus Sans",
                          fontSize: "13px",
                          color: "#808191",
                          marginBottom: "0px",
                          fontWeight: "600",
                        }}
                      >
                        Transaction Id
                      </p>
                      <span
                        style={{
                          fontFamily: " Eudoxus Sans",
                          fontSize: "13px",
                          marginBottom: "0px",
                          background:
                            "linear-gradient(263.76deg, #7FFC8D -28.53%, #C6FA56 140.05%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: " transparent",
                        }}
                      >
                        #a001
                      </span>
                    </div>
                  </div>
                  <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
                    className="deposit-stepper-container escrow-stepper"
                  >
                    {steps.map((step, index) => (
                      <Step key={step}>
                        <StepLabel
                          StepIconComponent={CustomStepIcon}
                          onClick={() => handleStepClick(index)}
                          className="step-label"
                          style={{ color: "#fff !important" }}
                        >
                          {step.label}
                          <p style={{ color: "#fff" }}>{step.status}</p>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <div className="chat-box-btn">
                    <button type="button" className="btn btn-primary escrowBtn">
                      Pay
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="8">
            <Card className="cards-dark chat-box">
              <Card.Body>
                <div className="d-flex items-center justify-content-between">
                  <Card.Title as="h2">Messages</Card.Title>
                  <div style={{ paddingRight: "32px"}}>
                  <a id="nav-dropdown" aria-expanded="false" role="button" class="dropdown-toggle nav-link" tabindex="0" href="#">
                    <SimpleDotedIcon width="20" height="20" />
                  </a>
                  </div>
                </div>
                <div className="chat-box-list">
                <div
                    style={{
                      fontFamily: "eudoxus sans",
                      fontSize: " 13px",
                      fontWeight: " 700",
                      lineHeight: "18px",
                      textAlign: "left",
                      padding: "12px 32px",
                      color: "#fff",
                      background: "#1E1E21",
                      position: "absolute",
                      top: " 0",
                      left: "0",
                      width: "100%",
                      borderRadius: "20px 20px 0px 0px",
                    }}
                  >
                    <span>Moderator</span>
                    <span style={{ color: "#808191", padding: "0 8px" }}>
                      Unavailable
                    </span>
                    <span
                      className="dot"
                      style={{
                        width: "6px",
                        height: "6px",
                        background: " #EC6060",
                        borderRadius: " 50%",
                        display: "inline-block",
                      }}
                    />
                  </div>
                  <ul className="chat-box-inner" style={{
                      marginTop: "30px"}} >
                    {escrowLoading && (
                      <MessageList
                        ReciverId={receiverAddress}
                        EscrowPay={"escrow-offer"}
                        escrowId={id}
                      />
                    )}
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
      </div>
    </>
  );
};

export default EscrowSeller;
