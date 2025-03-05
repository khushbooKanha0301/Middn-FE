import React, { useEffect, useState , forwardRef} from "react";
import { Button, Col, Form, Modal, ProgressBar, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dropzone from "react-dropzone";
import {
  CameraLineIcon,
  CheckmarkIcon,
  GreenCheckIcon,
  RedCrossIcon,
} from "./SVGIcon";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userDetails, userGetData, userGetFullDetails } from "../store/slices/AuthSlice";
import moment from "moment";
import SelectLocationDropdown from "./SelectLocationDropdown";
import SelectLocationKYCDropdown from "./SelectKYCDropdown";
import jwtAxios from "../service/jwtAxios";
import { CalenderIcon } from "./SVGIcon";
import * as flatted from "flatted";

// This component is used for kyc model verification
export const KYCVerification = (props) => {
  const [isOpen, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setkycsubmitted, ...rest } = props;
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [dob, setDob] = useState(new Date());
  const [userData, setUserData] = useState({
    fname: null,
    lname: null,
    country_of_issue: "United States",
    city: null,
    mname: null,
    postal_code: null,
    verified_with: null,
    res_address: null,
    passport_url: null,
    user_photo_url: null,
    wallet_type: null,
    wallet_address: null,
    nationality: "United States",
  });
  const acAddress = useSelector(userDetails);
  const userDetailsAll = useSelector(userGetFullDetails);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isKYCSubmitted, setISKYCSubmitted] = useState(false);

  const [checkboxState, setCheckboxState] = useState(
    flatted.parse(flatted.stringify([]))
  );

  const [selectedLocationOption, setSelectedLocationOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });

  const [searchLocationText, setSearchLocationText] = useState(`${selectedLocationOption?.country}`);
  const [searchCountryText, setSearchCountryText] = useState(`${selectedLocationOption?.country}`);

  const onChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const DatepickerCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div style={{ display: "flex" }} onClick={onClick}>
      <Form.Control className="example-custom-input" ref={ref} value={value} readOnly placeholder="DD/MM/YYYY" />
      <CalenderIcon width={30} height={30} />
    </div>
  ));

  const currentDate = (date) => {
    const formattedDate = date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
    return formattedDate;
  };

  const handleNext = async () => {
    if (isError) return;
  
    setLoading(true);
    switch (step) {
      case 1:
        setStep(step + 1);
        break;
      case 2:
        if (userData.nationality === null) {
          dispatch(notificationFail("Please Enter Nationality"));
        } else if (userData.fname === null) {
          dispatch(notificationFail("Please Enter First Name"));
        } else if (userData.lname === null) {
          dispatch(notificationFail("Please Enter Last Name"));
        } else if (dob === null) {
          dispatch(notificationFail("Please Enter Date of Birth"));
        } else {
          setStep(step + 1);
        }
        break;
      case 3:
        if (userData.res_address === null) {
          dispatch(notificationFail("Please Enter Residential Address"));
        } else if (userData.postal_code === null) {
          dispatch(notificationFail("Please Enter Postal Code"));
        } else if (userData.city === null) {
          dispatch(notificationFail("Please Enter City"));
        } else {
          setStep(step + 1);
        }
        break;
      case 4:
        if (userData.country_of_issue === null) {
          dispatch(notificationFail("Please Enter Country"));
        } else if (userData.verified_with === null) {
          setLoading(false);
          dispatch(notificationFail("Please Select Verification ID Proof"));
        } else {
          setLoading(true);
          setStep(step + 1);
        }
        break;
      case 5:
        if (userData.passport_url === null) {
          setLoading(false);
          dispatch(notificationFail("Please Select Passport Photo"));
        } else {
          setStep(step + 1);
        }
        break;
      case 6:
        if (!userData.user_photo_url) {
          setLoading(false);
          dispatch(notificationFail("Please upload user photo"));
        } else {
          setStep(step + 1);
        }
        break;
      case 7:
        if (!userData.wallet_address || !checkboxState.includes("terms")) {
          dispatch(notificationFail("Please agree to terms and conditions"));
        } else {
          const formData = new FormData();
          Object.keys(userData).forEach((key) => {
            if (userData[key]) formData.append(key, userData[key]);
          });
          formData.append("dob", dob.toLocaleDateString("en-GB"));
          setError(true);
          let updateUser = await jwtAxios.put("/users/updateKyc", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }).catch((error) => {
            setError(false);
            dispatch(notificationFail(error?.response?.data?.message || "Error"));
          });
  
          if (updateUser) {
            setISKYCSubmitted(true);
            setkycsubmitted(true);
            setError(false);
            setStep(step + 1);
            dispatch(notificationSuccess("KYC verification is submitted"));
          }
        }
        break;
      default:
        break;
    }
  };
  const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCheckboxChange = (filterType) => {
    setCheckboxState((prevState) => prevState.includes(filterType)
      ? prevState.filter((f) => f !== filterType)
      : [...prevState, filterType]);
  };

  const simulateNetworkRequest = () => new Promise((resolve) => setTimeout(resolve, 2000));

  useEffect(() => {
    if (isLoading) {
      simulateNetworkRequest().then(() => {
        if (!isError) setLoading(false);
      });
    }
  }, [isLoading, isError]);

  const fetchKYCData = (userDetailsAll) => {
    const user = userDetailsAll;
    if (user) {
      setUserData((prevData) => ({
        ...prevData,
        fname: user?.fname || null,
        lname: user?.lname || null,
        nationality: user?.nationality || "United States",
        city: user?.city || null,
        wallet_type: user?.wallet_type || null,
        wallet_address: acAddress?.account || null,
        country_of_issue: user?.country_of_issue || "United States",
      }));
      setDob(user?.dob ? moment(user?.dob, "DD/MM/YYYY").toDate() : null);
    }
  };

  useEffect(() => {
    fetchKYCData(userDetailsAll);
  }, [userDetailsAll]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setError(true);
    setLoading(true);
    const response = await jwtAxios.post("/users/validate-file-type", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).catch((err) => {
      setError(false);
      setLoading(false);
      dispatch(notificationFail(err.response?.data?.message));
    });
    setError(false);
    setLoading(false);
  };

  const cancleKYC = () => {
    if (isKYCSubmitted) {
      dispatch(userGetData(userGetData.userid)).unwrap();
    }
    fetchKYCData(userDetailsAll);
    setImageLocationUrl("https://flagcdn.com/h40/us.png");
    setImageCountryUrl("https://flagcdn.com/h40/us.png");
    setCountry("US");
    setLocation("US");
    setUserData({
      ...userData,
      mname: null,
      res_address: null,
      postal_code: null,
      verified_with: null,
      passport_url: null,
      user_photo_url: null,
    });
    setCheckboxState([]);
    props.onHide();
    setStep(1);
  };

  const [imageUrlLocationSet, setImageLocationUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageUrlCountrySet, setImageCountryUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageLocationSearchUrlSet, setImageLocationSearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageCountrySearchUrlSet, setImageCountrySearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [selectedCountryOption, setSelectedCountryOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });
  const [country, setCountry] = useState("US");
  const [location, setLocation] = useState("US");
  const verifiedWith = (verifiedDoc) => {
    setUserData((prevState) => ({
      ...prevState,
      verified_with: verifiedDoc, // Update the field in state
    }));
  };

  return (
    <Modal
      {...rest}
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
      onHide={cancleKYC}
    >
      <Form id="form-reset">
        <Modal.Header closeButton>
          <Modal.Title>
            {step === 1
              ? "KYC Verification"
              : step === 2 || step === 3
              ? "Personal information"
              : step === 4
              ? "Intermediate Verification"
              : step === 5
              ? "Identity Verification"
              : step === 6
              ? "Intermediate Verification"
              : step === 7
              ? "Your Paying"
              : "Complete"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="kyc-step">
          {step === 1 && (
            <>
              <p>
                To comply with regulations each participant is required to go
                through identity verification (KYC/AML) to prevent fraud, money
                laundering operations, transactions banned under the sanctions
                regime or those which fund terrorism. Please, complete our fast
                and secure verification process to participate in token
                offerings.
              </p>
              <h4>
                You have not submitted your necessary documents to verify your
                identity.
              </h4>
              <p className="mb-0">
                It would great if you please submit the form. If you have any
                question, please feel free to contact our support team.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <Form.Group className="form-group">
                <Form.Label>Nationality</Form.Label>
                <div className="d-flex items-center custom-dropdown justify-between custom-dropdown-kyc">
                  <Form.Control
                    name="nationality"
                    placeholder={userData.nationality}
                    type="text"
                    value={userData.nationality}
                    onChange={onChange}
                    disabled
                    maxLength="10"
                    className={isMobile ? "md:w-auto w-full" : ""}
                  />

                  <div
                    className={`kyc-mobile-popup ${
                      isMobile
                        ? "text-center relative mobile-setting-dropdown flex items-center"
                        : ""
                    }`}
                  >
                    {userData.nationality ? (
                      <img
                        src={imageUrlLocationSet}
                        alt="Flag"
                        className="circle-data"
                      />
                    ) : (
                      "No Flag"
                    )}

                    <SelectLocationDropdown
                      selectedLocationOption={selectedLocationOption}
                      setSelectedLocationOption={setSelectedLocationOption}
                      setImageLocationUrl={setImageLocationUrl}
                      imageUrlLocationSet={imageUrlLocationSet}
                      setImageLocationSearchUrl={setImageLocationSearchUrl}
                      imageLocationSearchUrlSet={imageLocationSearchUrlSet}
                      setSearchLocationText={setSearchLocationText}
                      searchLocationText={searchLocationText}
                      setCountry={setCountry}
                      country={country}
                    />
                  </div>
                </div>
              </Form.Group>
              <Row>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Alex"
                      name="fname"
                      value={userData.fname}
                      onChange={(e) => onChange(e)}
                      disabled={userDetailsAll?.fname ? true : false}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Last name"
                      name="lname"
                      value={userData.lname}
                      onChange={(e) => onChange(e)}
                      disabled={userDetailsAll?.lname ? true : false}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Middle name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="1"
                      name="mname"
                      value={userData.mname}
                      onChange={(e) => onChange(e)}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Date of birth</Form.Label>
                    <DatePicker
                      selected={dob}
                      onChange={(date) => setDob(date)}
                      className="form-control"
                      placeholderText="DD/MM/YYYY"
                      name="dob"
                      maxDate={new Date()}
                      customInput={<DatepickerCustomInput />}
                      disabled={userDetailsAll?.dob ? true : false}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          {step === 3 && (
            <>
              <Form.Group className="form-group">
                <Form.Label>Residential address (additional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your address"
                  name="res_address"
                  value={userData.res_address}
                  onChange={(e) => onChange(e)}
                />
              </Form.Group>
              <Row>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>Postal code (additional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Postal code"
                      name="postal_code"
                      value={userData.postal_code}
                      onChange={(e) => onChange(e)}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="form-group">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="City"
                      name="city"
                      value={userData.city}
                      onChange={(e) => onChange(e)}
                      disabled={userDetailsAll?.city ? true : false}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          {step === 4 && (
            <>
              <Form.Group className="form-group mb-4">
                <Form.Label>Country/Region of Issue</Form.Label>
                <div className="d-flex items-center custom-dropdown justify-between custom-dropdown-kyc">
                  <Form.Control
                    name="country"
                    placeholder={userData.country_of_issue}
                    type="text"
                    value={userData.country_of_issue}
                    onChange={onChange}
                    disabled
                    maxLength="10"
                    className={isMobile ? "md:w-auto w-full" : ""}
                  />

                  <div
                    className={`kyc-mobile-popup ${
                      isMobile
                        ? "text-center relative mobile-setting-dropdown flex items-center"
                        : ""
                    }`}
                  >
                    {userData.country_of_issue ? (
                      <img
                        src={imageUrlCountrySet}
                        alt="Flag"
                        className="circle-data"
                      />
                    ) : (
                      "No Flag"
                    )}

                    <SelectLocationKYCDropdown
                      selectedLocationOption={selectedCountryOption}
                      setSelectedLocationOption={setSelectedCountryOption}
                      setImageLocationUrl={setImageCountryUrl}
                      imageUrlLocationSet={imageUrlCountrySet}
                      setImageLocationSearchUrl={setImageCountrySearchUrl}
                      imageLocationSearchUrlSet={imageCountrySearchUrlSet}
                      setSearchLocationText={setSearchCountryText}
                      searchLocationText={searchCountryText}
                      setCountry={setLocation}
                      country={location}
                      setNationality={(country) => setUserData((prevData) => ({ ...prevData, country_of_issue: country }))}
                    />
                  </div>
                </div>
              </Form.Group>
              <h4>Use a valid government-issued document</h4>
              <p className="mb-4">
                Only the following documents listed below will be accepted, all
                other documents will be rejected.
              </p>
              <div
                  className="document-issued form-check"
                  onClick={() => verifiedWith("government-passport")}
                >
                  <div
                    className={`form-check-input ${userData.verified_with === "government-passport" ? "checked" : ""}`}
                  />
                  <label className="form-check-label">
                    <>
                      Passport
                      <div className="checkmark">
                        <CheckmarkIcon width="10" height="8" />
                      </div>
                    </>
                  </label>
                </div>

              <div
                className="document-issued form-check DrivingLicenseMargin"
                onClick={() => verifiedWith("government-license")}
              >
                <div
                  className={`form-check-input ${
                    userData.verified_with === "government-license" ? "checked" : ""
                  }`}
                />
                <label className="form-check-label">
                  <>
                    Driver's License
                    <div className="checkmark">
                      <CheckmarkIcon width="10" height="8" />
                    </div>
                  </>
                </label>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <h5>Take a Photo of Passport</h5>
              <ul className="document-info">
                <li>
                  <GreenCheckIcon width="10" height="8" />
                  Original full-size, unedited documents
                </li>
                <li>
                  <GreenCheckIcon width="10" height="8" />
                  Place documents against a single-coloured background
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" />
                  No black and white images
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" />
                  No edited or expired documents
                </li>
              </ul>
              <Dropzone
                onDrop={(acceptedFiles) => {
                  setUserData((prevData) => ({
                    ...prevData,
                    passport_url: acceptedFiles[0],
                  }));
                  handleFileUpload(acceptedFiles[0]);
                }}
                name="passport_url"
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input
                      {...getInputProps({ accept: "image/*, application/pdf" })}
                    />
                    <Row>
                      <Col sm="12" className="d-flex items-center">
                        <CameraLineIcon width="23" height="24" /> Take a photo
                      </Col>
                      {userData.passport_url && (
                        <ul>
                          {userData.passport_url && (
                            <li key={userData.passport_url.path}>
                              {userData.passport_url.path} -{" "}
                              {(userData.passport_url.size / 1024).toFixed(2)} KB
                            </li>
                          )}
                        </ul>
                      )}
                    </Row>
                  </div>
                )}
              </Dropzone>
              <div style={{ paddingBottom: "16px" }}>
                <p className="mb-0">
                  File size must be between 10KB and 5120KB in ..jpg/.jpeg/.png
                  format.
                </p>
              </div>
            </>
          )}
          {step === 6 && (
            <>
              <h5>Upload portrait photo</h5>
              <ul className="document-info">
                <li>
                  <RedCrossIcon width="10" height="10" /> Don't use beauty
                  photos
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" /> Don't wear hats{" "}
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" /> Don't make up
                </li>
                <li>
                  <RedCrossIcon width="10" height="10" /> Don't take screenshots
                </li>
              </ul>
              <Dropzone
                onDrop={(acceptedFiles) => {
                  setUserData((prevData) => ({
                    ...prevData,
                    user_photo_url: acceptedFiles[0],  // Update user_photo_url field
                  }));
                  handleFileUpload(acceptedFiles[0]);
                }}
                name="user_photo_url"
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <Row>
                      <Col sm="12" className="d-flex items-center">
                        <CameraLineIcon width="23" height="24" /> Take a photo
                      </Col>
                      {userData.user_photo_url && (
                        <ul>
                          {userData.user_photo_url && (
                            <li key={userData.user_photo_url.path}>
                              {userData.user_photo_url.path} -{" "}
                              {(userData.user_photo_url.size / 1024).toFixed(2)} KB
                            </li>
                          )}
                        </ul>
                      )}
                    </Row>
                  </div>
                )}
              </Dropzone>
              <p className="mb-0">
                Please ensure that your face is centered well lit, and visible
                when capturing the photo to avoid facial recognition errors
              </p>
            </>
          )}
          {step === 7 && (
            <>
              <h5>Select Wallet</h5>
              <Form.Group className="form-group">
                <Form.Label>Wallet Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your wallet Type"
                  name="wallet_type"
                  onChange={(e) => {
                    setUserData((prevData) => ({
                      ...prevData,
                      wallet_type: e.target.value
                    }));
                  }}
                  value={userData.wallet_type}
                  disabled={userDetailsAll?.wallet_type ? true : false}
                />
              </Form.Group>
              <Form.Group className="form-group mb-4">
                <Form.Label>Enter your wallet address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your wallet address"
                  name="wallet_address"
                  onChange={(e) => {
                    setUserData((prevData) => ({
                      ...prevData,
                      wallet_address: e.target.value,
                    }));
                  }}
                  value={userData.wallet_address}
                />
              </Form.Group>
              <p className="mb-4">
                Please ensure that your face is centered well lit, and visible
                when capturing the photo to avoid facial recognition errors
              </p>
              <div style={{ marginBottom: "62px" }}>
                <div
                  className="terms-checkbox form-check"
                  onClick={() => handleCheckboxChange("terms")}
                >
                  <div
                    className={`form-check-input ${
                      checkboxState.includes("terms") ? "checked" : ""
                    }`}
                  />
                  <label className="form-check-label">
                    I have read the Terms and Condition and Privacy and Policy.
                  </label>
                </div>
                <div
                  className="terms-checkbox form-check"
                  onClick={() => handleCheckboxChange("personal")}
                >
                  <div
                    className={`form-check-input ${
                      checkboxState.includes("personal") ? "checked" : ""
                    }`}
                  />
                  <label className="form-check-label">
                    All the personal information I have entered is correct.
                  </label>
                </div>
                <div
                  className="terms-checkbox form-check"
                  onClick={() => handleCheckboxChange("registering")}
                >
                  <div
                    className={`form-check-input ${
                      checkboxState.includes("registering") ? "checked" : ""
                    }`}
                  />
                  <label className="form-check-label">
                    I certify that, I am registering to participate in the token
                    distribution event(s) in the capacity of an individual (and
                    beneficial owner) and not as an agent or representative of a
                    third party corporate entity.
                  </label>
                </div>

                <div
                  className="terms-checkbox form-check"
                  onClick={() => handleCheckboxChange("participate")}
                >
                  <div
                    className={`form-check-input ${
                      checkboxState.includes("participate") ? "checked" : ""
                    }`}
                  />
                  <label className="form-check-label">
                    I understand that, I can participate in the token
                    distribution event(s) only with the wallet address that was
                    entered in the application form.
                  </label>
                </div>
              </div>
            </>
          )}
          {step === 8 && (
            <>
              <h5 className="mb-4">Verification Under Review</h5>
              <div className="verification-under-row">
                <p className="mb-0">
                  Review expected to be completed:{" "}
                  <strong>{currentDate(new Date())}</strong>
                </p>
              </div>
            </>
          )}
          <div className="form-action-group">
            {step === 1 ? (
              <Button variant="primary" className="w-100" onClick={handleNext}>
                Continue to complete KYC
              </Button>
            ) : step === 2 ||
              step === 3 ||
              step === 4 ||
              step === 5 ||
              step === 6 ||
              step === 7 ||
              step === 8 ? (
              <>
                <ProgressBar variant="success" now={(100 / 8) * step} />
                {step !== 8 ? (
                  <Button
                    variant="primary"
                    disabled={isLoading}
                    onClick={!isLoading ? handleNext : null}
                  >
                    {isLoading ? "Submitting…" : "Continue"}
                  </Button>
                ) : (
                  <Button variant="primary" as={Link} to="/">
                    Go home
                  </Button>
                )}
                <Button variant="secondary" onClick={(e) => cancleKYC(e)}>
                  Cancel
                </Button>
              </>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
};

export default KYCVerification;
