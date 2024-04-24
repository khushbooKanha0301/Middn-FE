import Picker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { formateSize, RenderIcon } from "../../helper/RenderIcon";
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
import { Nav, NavDropdown } from "react-bootstrap";
import { userGetFullDetails } from "../../store/slices/AuthSlice";
import { messageTypes } from "../../helper/config";
import MessageList from "../chat/MessageList";
import { setIsChatEscrowPage } from "../../store/slices/chatEscrowSlice";
import jwtAxios from "../../service/jwtAxios";
import { get, ref, set, update } from "firebase/database";
import { database } from "../../helper/config";
import { firebaseMessagesEscrow } from "../../helper/configEscrow";
import Swal from "sweetalert2/src/sweetalert2.js";
import { firebaseStatus } from "../../helper/statusManage";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CardContent } from "@mui/material";
import CopyImage from "../../content/images/copyimage.svg";

const steps = [
  {
    label: "Confirm order info",
    description: (
      <Box className="confirm-order-info">
        <Box className="single-confirm-order">
          <p>Amount </p>
          <span className="gradiant-color">€ 2000</span>
        </Box>
        <Box className="single-confirm-order">
          <p>Price </p>
          <span>€ 16,234 </span>
        </Box>
        <Box className="single-confirm-order">
          <p>Receive Quantity </p>
          <span>16,234 BNB</span>
        </Box>
      </Box>
    ),
  },
  {
    label: "Make Payment",
    description: (
      <Card
        style={{
          background: "#212121",
          border: "1px solid #3F3F3F",
          borderRadius: "11px",
        }}
      >
        <CardContent
          style={{
            padding: "16px",
            display: "flex",
            gap: "54px",
          }}
        >
          <Box>
            <Button
              style={{
                background: "#373A43",
                color: "#fff",
                fontWeight: "unset",
                fontFamily: "eudoxus sans",
              }}
            >
              Bank Transfer
            </Button>
          </Box>
          <Box className="make-payment-stepper">
            <div>
              <p>Name</p>
              <h5 style={{ display: "flex" }}>
                Joseph Nolan
                <img src={CopyImage} alt="CopyImage" />
              </h5>
            </div>
            <div>
              <p>Bank Card Number</p>
              <h5 style={{ display: "flex" }}>
                92637123
                <img src={CopyImage} alt="CopyImage" />
              </h5>
            </div>
            <div>
              <p>Bank name</p>
              <h5 style={{ display: "flex" }}>
                Joseph Nolan
                <img src={CopyImage} alt="CopyImage" />
              </h5>
            </div>
            <div>
              <p>Account Opening Branch</p>
              <h5 style={{ display: "flex" }}>
                254
                <img src={CopyImage} alt="CopyImage" />
              </h5>
            </div>
          </Box>
        </CardContent>
      </Card>
    ),
  },
  {
    label: "Notify Seller",
    description: (
      <p
        style={{
          fontFamily: "eudoxus sans",
          fontSize: "13px",
          fontWeight: "700",
          lineHeight: "18px",
          color: "#808191",
          marginBottom: "32px",
        }}
      >
        `After payment, remember to click the ‘Transferred, Notify Seller’
        button facilitate the crypto release by the seller`
      </p>
    ),
  },
];

export const MarketPlaceBuySell = (props) => {
  const [user, setUser] = useState({});
  const [escrowType, setEscrowType] = useState(null);
  const [escrowFund, setEscrowFund] = useState(null);
  const [escrowCompleted, setEscrowCompleted] = useState(null);
  const { id } = props;
  const dispatch = useDispatch();
  const [showSmily, setShowSmily] = useState(false);
  const acAddress = useSelector(userGetFullDetails);
  const emojiPickerRef = useRef(null);
  const [selectedEmoji, setSelectedEmoji] = useState([]);
  const [escrow, setEscrow] = useState(null);
  const receiverAddress =
    acAddress?.wallet_address === escrow?.user_address
      ? escrow?.trade_address
      : escrow?.user_address;

  const userRef = useRef(null);
  const fileInputRef = useRef(null);
  const { onClickOutside } = <Picker />;
  const [messageText, setMessageText] = useState("");
  const [messageFile, setMessageFile] = useState("");
  const [escrowLoading, setEscrowLoading] = useState(false);
  const receiverData = useSelector((state) => state.chatReducer?.MessageUser);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNextStepper = () => {
    if (activeStep === steps.length - 1) {
      handleReset(); // Reset to the initial step
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
      if (acAddress?.wallet_address && receiverAddress && noError == true) {
        await addUserInFirebase(acAddress?.wallet_address);
        await addUserInFirebase(receiverAddress);
        sendMessage(
          //CHAT_ROOM,
          acAddress?.wallet_address,
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
      <div className="escrowPay market-place-buy-sell">
        <Row>
          <Col lg="7">
            <Card className="cards-dark">
              <div
                style={{
                  fontFamily: "eudoxus sans",
                  fontSize: " 13px",
                  fontWeight: " 700",
                  lineHeight: "18px",
                  textAlign: "left",
                  padding: "12px 24px",
                  color: "#fff",
                  background: "#1E1E21",
                  width: "100%",
                  borderRadius: "20px 20px 0px 0px",
                  display: "flex",
                  justifyContent: " space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex" }}>
                  <span>Order number</span>
                  <span
                    style={{
                      color: "#808191",
                      padding: "0 8px",
                      display: "flex",
                    }}
                  >
                    20613122389277339648
                    <img src={CopyImage} alt="CopyImage" />
                  </span>
                </div>
                <div>
                  <span>Time created</span>
                  <span style={{ color: "#808191", padding: "0 8px" }}>
                    2024-04-15 16:36:12
                  </span>
                </div>
              </div>
              <Box
                sx={{
                  padding: "20px 24px",
                }}
              >
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step
                      key={step.label}
                      sx={{ color: "#fff", cursor: "pointer" }}
                    >
                      <StepLabel onClick={handleNextStepper}>
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography sx={{ color: "#fff" }}>
                          {step.description}
                        </Typography>

                        {index === steps.length - 1 && (
                          <>
                            <Button
                              variant="contained"
                              className="btn-primary"
                              style={{
                                padding: "16px 21px",
                                marginRight: "10px",
                                width: "208px",
                              }}
                            >
                              Transferred, notify seller
                            </Button>
                            <Button
                              variant="contained"
                              className="btn-primary"
                              style={{
                                padding: "16px 21px",
                                background: "#373A43",
                                color: "#fff",
                                width: "208px",
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {/* <Box sx={{ mb: 2, color: "#fff" }}>
                          <div>
                            <Button
                              variant="contained"
                              onClick={handleNextStepper}
                              sx={{
                                mt: 1,
                                mr: 1,
                                background: "#373A43",
                                color: "#fff",
                              }}
                            >
                              {index === steps.length - 1
                                ? "Finish"
                                : "Continue"}
                            </Button>
                            <Button
                              disabled={index === 0}
                              onClick={handleBackStepper}
                              sx={{ mt: 1, mr: 1, color: "#fff" }}
                            >
                              Back
                            </Button>
                          </div>
                        </Box> */}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                {activeStep === steps.length && (
                  <Paper
                    square
                    elevation={0}
                    sx={{
                      p: 3,
                      background: "transparent",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <Typography>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                      Transferred, notify seller
                    </Button>
                    <Button sx={{ mt: 1, mr: 1 }}>Cancel</Button>
                  </Paper>
                )}
              </Box>
            </Card>
          </Col>
          <Col lg="5">
            <Card className="cards-dark chat-box">
              <Card.Body>
                <div className="d-flex items-center justify-content-between pe-4 mb-3">
                  <Card.Title
                    as="h2"
                    style={{ marginBottom: 0, fontWeight: "700" }}
                  >
                    Chatbox
                  </Card.Title>
                  <div
                    style={{ display: "flex", gap: "10px", fontSize: "13px" }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: "600",
                        fontFamily: "eudoxus sans",
                      }}
                    >
                      Trades History
                    </span>
                    <span
                      style={{
                        color: " #FF754C",
                        fontFamily: "eudoxus sans",
                        fontWeight: "600",
                      }}
                    >
                      Report
                    </span>
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
                      padding: "12px 24px",
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
                  <div
                    className=""
                    style={{
                      background: "#252527",
                      position: "absolute",
                      top: " 40px",
                      left: "0",
                      color: "#fff",
                      padding: "8px 24px",
                      width: "100%",
                    }}
                  >
                    Order Created
                    <span
                      style={{
                        background: "#FFC2462E",
                        color: "#FFC246",
                        fontSize: "13px",
                        fontFamily: "eudoxus sans",
                        fontWeight: "600",
                        padding: " 4px 6px",
                        borderRadius: "6px",
                        marginLeft: "12px",
                      }}
                    >
                      04: 30 Left to pay
                    </span>
                  </div>
                  <ul>
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
                        // onSubmit={(e) => {
                        //   onSubmit(e);
                        // }}
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

export default MarketPlaceBuySell;
