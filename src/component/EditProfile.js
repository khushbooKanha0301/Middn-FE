import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CameraIcon } from "./SVGIcon";
import { useSelector, useDispatch } from "react-redux";
import { userDetails, userGetData, userGetFullDetails } from "../store/slices/AuthSlice";
import { notificationFail, notificationSuccess } from "../store/slices/notificationSlice";
import { FaTrashAlt } from "react-icons/fa";
import jwtAxios from "../service/jwtAxios";
import { ref, update, get } from "firebase/database";
import { database } from "./../helper/config"
import { firebaseMessages, firebaseMessagesEscrow, firebaseStatus } from "../helper/configVariables";
import { converImageToBase64 } from "./../helper/firebaseConfig";

//This component is used for edit user profile
export const EditProfileView = (props) => {
 console.log("onHide ", props);
  const dispatch = useDispatch();
  const userData = useSelector(userDetails);
  const userDetailsAll = useSelector(userGetFullDetails);
  const countryDetails = useSelector((state) => state.auth.countryDetails);  

  const country = countryDetails?.country_name || "";
  const countryCode = countryDetails?.country_code || "";
  const flagUrl = countryCode ? `https://flagcdn.com/h40/${countryCode.toLowerCase()}.png` : "";

  const [fname, setFname] = useState(userDetailsAll?.fname_alias || "");
  const [lname, setLname] = useState(userDetailsAll?.lname_alias || "");
  const [bio, setBio] = useState(userDetailsAll?.bio || "");
  const [profile, setProfile] = useState(userDetailsAll?.profile || "");
  const [imageSrc, setImageSrc] = useState(userDetailsAll?.imageUrl || "");
  const [isProfileDeleted, setIsProfileDeleted] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fname") setFname(value);
    else if (name === "lname") setLname(value);
    else if (name === "bio") setBio(value);
    else if (name === "profile" && files[0]) {
      const file = files[0];
      if (!file.type.includes("image/")) {
        dispatch(notificationFail("Please select a valid image file"));
        return;
      }
      setIsProfileDeleted(false);
      setProfile(file);
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onDeleteImage = async (e) => {
    e.preventDefault();
    setImageSrc("");
    setProfile("");
    setIsProfileDeleted(true);
  };

  const updateFirebaseData = async (path, data) => {
    const userRef = ref(database, path);
    const snapshot = await get(userRef);
    if (snapshot.exists()) await update(userRef, data);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!fname || !lname) {
      dispatch(notificationFail("Please enter first & last name"));
      setLoading(false);
      return;
    }

    const formSubmit = {
      fname_alias: fname,
      lname_alias: lname,
      bio,
      profile: typeof profile === "string" ? undefined : profile,
      is_profile_deleted: isProfileDeleted,
    };

    try {
      const response = await jwtAxios.put("/users", formSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        dispatch(userGetData(userData.userid)).unwrap();
        dispatch(notificationSuccess(response.data.message));

        let updateArr = {
          fname_alias: fname,
          lname_alias: lname,
        };
        if (profile && typeof profile !== "string") {
          const base64 = await converImageToBase64(profile);
          updateArr.imageUrl = `data:${profile.type};base64,${base64}`;
        }

        const firebasePaths = [
          `${firebaseMessages.CHAT_USERS}${userData.account}`,
          `${firebaseMessagesEscrow.CHAT_USERS}${userData.account}`,
          `${firebaseStatus.CHAT_USERS}${userData.account}`,
        ];

        await Promise.all(firebasePaths.map((path) => updateFirebaseData(path, updateArr)));

        props.onHide();
      }
    } catch (error) {
      const message = typeof error === "string" ? error : error?.response?.data?.message;
      dispatch(notificationFail(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      dialogClassName="login-modal edit-profile-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Body>
        <h4>Edit Profile</h4>
        <Form className="mt-4">
          <Form.Group
            controlId="formFile"
            className="file-uploader"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Form.Label>
              <img src={imageSrc || profile || require("../content/images/avatar.png")} id="output" alt="Profile" width="135" height="135" />
              <CameraIcon width="16" height="15" />
              {profile && (
                <FaTrashAlt
                  className="remove-pro"
                  onClick={(e) => onDeleteImage(e)}
                />
              )}
            </Form.Label>
            <input
              type="file"
              className="custom-file-input"
              id="inputGroupFile01"
            />

            <Form.Control
              type="file"
              name="profile"
              accept="image/*"
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="mb-1">First name (required)</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              name="fname"
              value={fname}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="mb-1">Last name (required)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              name="lname"
              value={lname}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="mb-1">Location</Form.Label>
            <div className="input-flag">
              {flagUrl ? (
                <img
                  src={flagUrl}
                  alt="Flag"
                  style={{ weight: "20px", height: "20px" }}
                />
              ) : (
                "No Flag"
              )}
              <Form.Label className="form-control">{country}</Form.Label>
            </div>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label className="mb-1">Bio</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add Your Experience....."
              name="bio"
              value={bio}
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <p className="help-text">
            Any details such as age, occupation or city etc.
            <br />
            Example: 21 y.o. crypto trader
          </p>
          <div className="form-action-group">
            <Button
              variant="primary"
              disabled={isLoading}
              onClick={!isLoading ? submitHandler : null}
            >
              {isLoading ? "Loading…" : "Submit"}
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

export default EditProfileView;
