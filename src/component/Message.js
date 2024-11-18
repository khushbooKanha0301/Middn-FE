import { child, get, ref, set } from "firebase/database";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { database, messageTypes } from "./../helper/config";
import { firebaseMessages } from "./../helper/configVariables";
import { sendMessage } from "./../helper/firebaseConfig";
import {userDetails,  userGetFullDetails } from "../store/slices/AuthSlice";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";
import jwtAxios from "../service/jwtAxios";
//This component is used for message chat start from profile page 
export const MessageView = (props) => {
  const { otheruser } = props;
  const dispatch = useDispatch();
  const [content, SetContent] = useState(null);
  const [errContent, setErrContent] = useState(null);
  const userData = useSelector(userDetails);
  const usergetdata = useSelector(userGetFullDetails);
  const onChangeMessage = (e) => {
    SetContent(e.target.value);
  };

  const addUserInFirebase = (user) => {
    const userRef = ref(database, `${firebaseMessages?.CHAT_USERS}${user.wallet_address}`);
  
    // Prepare user data
    const userData = {
      wallet_address: user.wallet_address,
      fname_alias: user.fname_alias || "John",
      lname_alias: user.lname_alias || "Doe",
      imageUrl: user.imageUrl || "",  
    };
  
    // Attempt to set user data in Firebase
    set(userRef, userData)
      .catch((error) => {
        console.error("Error adding/updating user in Firebase:", error);
        dispatch(notificationFail("Something went wrong!"));
      });
  };
  

  const onSubmit = async () => {
    // Check for missing content early
    if (!content) {
      setErrContent("Please Enter Message here");
      return;
    }
    setErrContent(null);

    if (usergetdata && otheruser) {
      const updatedUserGetData = { 
        ...usergetdata, 
        wallet_address: userData?.account || "" 
      };
      try {
        await Promise.all([
          addUserInFirebase(updatedUserGetData),
          addUserInFirebase(otheruser)
        ]);
  
        // Send the message
        await sendMessage(
          false,
          content,
          userData?.account,
          otheruser?.wallet_address,
          messageTypes.TEXT,
          ""
        );
  
        props.onHide();
        SetContent(null);
  
        // Send message to backend API
        await jwtAxios.post("users/SendNewMessage", { message: content });
        dispatch(notificationSuccess("Message Sent successfully !"));
  
        // Redirect after 1 second
        setTimeout(() => {
          window.location.href = "/chat";
        }, 1000);
      } catch (err) {
        // Simplified error handling
        const errorMessage = typeof err === "string" 
          ? err 
          : err?.response?.data?.message || "An error occurred during the transaction. Please try again.";
        
        dispatch(notificationFail(errorMessage));
      }
    }
  };

  
  return (
    <Modal
      {...props}
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Body>
        <div className="modal-heading">
          <div className="profile-img">
            <img
              src={
                otheruser?.imageUrl
                  ? otheruser?.imageUrl
                  : require("../content/images/avatar.png")
              }
              alt="Gabriel  Erickson"
              width="48"
              height="48"
            />
          </div>
          Message to {otheruser?.fname_alias} {otheruser?.lname_alias}
        </div>
        <p>
          Start a conversation with {otheruser?.fname_alias}{" "}
          {otheruser?.lname_alias}
        </p>
        <Form>
          <Form.Group className="message-form">
            <Form.Label>Message</Form.Label>
            <Form.Control
              type="text"
              name="content"
              as="textarea"
              placeholder={`Start a conversation with ${otheruser?.fname_alias} ${otheruser?.lname_alias}`}
              value={content || ""}
              onChange={onChangeMessage}
            />
            {errContent && <p className="error">{errContent}</p>}
          </Form.Group>
          <div className="form-action-group">
            <Button variant="primary" onClick={onSubmit}>
              Send
            </Button>
            <Button variant="secondary" onClick={props.onHide}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MessageView;
