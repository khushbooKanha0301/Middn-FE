import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Placeholder
} from "react-bootstrap";
import { SecurityIcon } from "../../component/SVGIcon";
import ChangePasswordView from "../../component/ChangePassword";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { userGetData, userGetFullDetails } from "../../store/slices/AuthSlice";
import jwtAxios from "../../service/jwtAxios";
import {
  notificationFail,
  notificationSuccess,
} from "../../store/slices/notificationSlice";
import { countryInfo } from "../../component/countryData";
import GoogleAuth from "./googleAuth";
import VerifiedInfo from "./verifiedInfo";
import SelectOptionDropdown from "../../component/SelectOptionDropdown";
import SelectCurrencyDropdown from "../../component/SelectCurrencyDropdown";
import SelectLocationDropdown from "../../component/SelectLocationDropdown";
import listData from "../../component/countryData";

export const AccountSetting = () => {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const [country, setCountry] = useState("US");
  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errEmail, setErrEmail] = useState(null);
  const [errPhone, setErrPhone] = useState(null);
  const [currentPre, setCurrentPre] = useState("USD");
  const [countryCallingCode, setCountryCallingCode] = useState("");
  const userDetailsAll = useSelector(userGetFullDetails);
  const [loaderUpdate, setLoaderUpdate] = useState(true);
  const [city, setCity] = useState("");
  const userData = useSelector(userGetFullDetails);
  const [currency, setCurrency] = useState("USD");
  const [is2FAEnabled, setIs2FAEnabled] = useState(userData?.is_2FA_enabled);
 
  const [selectedOption, setSelectedOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });

  const [selectedLocationOption, setSelectedLocationOption] = useState({
    country: "United States",
    code: " +1",
    iso: "US",
    cca3: "USA",
  });

  const [imageUrlSet, setImageUrl] = useState("https://flagcdn.com/h40/us.png");
  const [imageSearchUrlSet, setImageSearchUrl] = useState(
  "https://flagcdn.com/h40/us.png"
  );
  
  const [imageUrlLocationSet, setImageLocationUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageLocationSearchUrlSet, setImageLocationSearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageCurrencyUrlSet, setImageCurrencyUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [imageCurrencySearchUrlSet, setImageCurrencySearchUrl] = useState(
    "https://flagcdn.com/h40/us.png"
  );

  const [searchText, setSearchText] = useState(
    `${selectedOption?.country} (${selectedOption?.code})`
  );

  const [searchLocationText, setSearchLocationText] = useState(
    `${selectedLocationOption?.country}`
  );

  const [currencyPre, setCurrencyPre] = useState("USD");

  const [nationality, setNationality] = useState("United States");
  const currencyValueChange = () => {
    const result = countryInfo.find(
      (item) => item.currency.code === currentPre
    );
    return result?.currency.name;
  };

  countryInfo.sort(function (a, b) {
    var textA = a.currency.code.toUpperCase();
    var textB = b.currency.code.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  useEffect(() => {
    let user = userDetailsAll;
    if (user) {
      setFname(user?.fname ? user?.fname : "");
      setLname(user?.lname ? user?.lname : "");
      setPhone(user?.phone ? user?.phone : "");
      setEmail(user?.email ? user?.email : "");
      setCity(user?.city ? user?.city : "");
    }

    if (user?.phoneCountry) {
      setCountryCallingCode(user?.phoneCountry);
      const result = listData.find((item) => item?.code === user?.phoneCountry);
      setSelectedOption(result);
      setImageUrl(`https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`);
      setSearchText(`${result?.country} (${result?.code})`);
      setImageSearchUrl(
        `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`
      );
    } else {
      setCountryCallingCode(" +1");
    }

    if (user?.currentpre) {
      setCurrentPre(user?.currentpre);
      setCurrencyPre(user?.currentpre);
      const result = countryInfo.find(
        (item) => item.currency.code === user?.currentpre
      );
      setImageCurrencyUrl(result?.flag);
      setImageCurrencySearchUrl(result?.flag);
    }
    //  else {
    //   let currency = countryInfo.find((item) => item.code === "US");
    //   setCurrentPre(currency?.currency.code);
    //   setCurrencyPre(user?.currentpre);
    //   setImageCurrencyUrl(currency?.flag)
    //   setImageCurrencySearchUrl(currency?.flag)
    // }

    if (user?.location) {
      setCountry(user?.location);
      const result = listData.find((item) => item?.iso === user?.location);
      setSelectedLocationOption(result);
      setImageLocationUrl(
        `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`
      );
      setImageLocationSearchUrl(
        `https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`
      );
      setSearchLocationText(result?.country);
    }
    // else {
    //   setCountry("US");
    //   const result = listData.find((item) => item?.iso === "US");
    //   setSelectedLocationOption(result)
    //   setImageLocationUrl(`https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`)
    //   setImageLocationSearchUrl(`https://flagcdn.com/h40/${result?.iso?.toLowerCase()}.png`)
    //   setSearchLocationText(result?.country)
    // }

    if (userDetailsAll) {
      setLoaderUpdate(false);
    }
  }, [userDetailsAll]);

 
  const submitHandler = async () => {
    if (!phone) {
      dispatch(notificationFail("Please Enter phone number"));
    }
    if (!email) {
      dispatch(notificationFail("Please Enter email"));
    }
    if (!fname || !lname) {
      dispatch(notificationFail("Please Enter First & Last Name"));
    }
    if (!errEmail && !errPhone && phone && email && fname && lname) {
      setErrPhone(null);
      setErrEmail(null);
      let formSubmit = {
        email: email,
        phone: phone,
        currentpre: currentPre,
        fname: fname,
        lname: lname,
        location: country,
        city: city,
        phoneCountry: countryCallingCode,
      };
      console.log(formSubmit);
      let updateUser = await jwtAxios
        .put(`/users/updateAccountSettings`, formSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
      if (updateUser) {
        dispatch(userGetData(userGetData.userid)).unwrap();
        dispatch(notificationSuccess("User profile update successfully !"));
      }
    }
  };

  const onChange = (e) => {
    if (e.target.name === "fname") {
      setFname(e.target.value);
    } else if (e.target.name === "lname") {
      setLname(e.target.value);
    } else if (e.target.name === "phone") {
      const value = e.target.value.replace(/\D/g, "");
      setPhone(value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "currentPre") {
      setCurrentPre(e.target.value);
    } else if (e.target.name === "city") {
      setCity(e.target.value);
    }
  };

  useEffect(() => {
    setIs2FAEnabled(userData?.is_2FA_enabled);
  }, [userData?.is_2FA_enabled]);

  useEffect(() => {
    const checkMobile = () => {
      const mobileMatch = window.matchMedia("(max-width: 767px)");
      setIsMobile(mobileMatch.matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="account-setting">
      <h1>Account Setting</h1>
      {!loaderUpdate && userDetailsAll ? (
        <Row>
          <Col lg="8" className="account-setting-left">
            <Card className="cards-dark mb-32">
              <Card.Body>
                <Card.Title as="h2">Account Information</Card.Title>
                <Form>
                  <Row>
                    <Col md="6">
                      <Form.Group className="form-group">
                        <Form.Label>First name</Form.Label>
                        {userDetailsAll?.fname ? (
                          <Form.Label className="form-control">
                            {fname}
                          </Form.Label>
                        ) : (
                          <Form.Control
                            type="text"
                            placeholder="First Name"
                            name="fname"
                            value={fname}
                            onChange={(e) => onChange(e)}
                          />
                        )}
                      </Form.Group>
                    </Col>
                    <Col md="6">
                      <Form.Group className="form-group">
                        <Form.Label>Last name</Form.Label>
                        {userDetailsAll?.lname ? (
                          <Form.Label className="form-control">
                            {lname}
                          </Form.Label>
                        ) : (
                          <Form.Control
                            type="text"
                            placeholder="Last Name"
                            name="lname"
                            value={lname}
                            onChange={(e) => onChange(e)}
                          />
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <Form.Group className="form-group">
                        <Form.Label>Email (required)</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="email"
                          name="email"
                          value={email}
                          onChange={(e) => onChange(e)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="6">
                      <Form.Group className="form-group">
                        <Form.Label>Phone number (required)</Form.Label>
                        <div
                          className={`d-flex items-center phone-number-dropdown justify-between relative`}
                        >
                          {!isMobile && (
                            <>
                              <Form.Control
                                placeholder={countryCallingCode}
                                name="phone"
                                type="text"
                                value={phone}
                                onChange={(e) => {
                                  onChange(e);
                                }}
                                maxLength="10"
                              />
                              {selectedOption?.code ? (
                                <img
                                  src={imageUrlSet}
                                  alt="Flag"
                                  className="circle-data"
                                />
                              ) : (
                                "No Flag"
                              )}
                              <SelectOptionDropdown
                                imageUrlSet={imageUrlSet}
                                setImageUrl={setImageUrl}
                                selectedOption={selectedOption}
                                setSelectedOption={setSelectedOption}
                                setCountryCallingCode={setCountryCallingCode}
                                countryCallingCode={countryCallingCode}
                                setSearchText={setSearchText}
                                searchText={searchText}
                                setImageSearchUrl={setImageSearchUrl}
                                imageSearchUrlSet={imageSearchUrlSet}
                              />
                            </>
                          )}
                          {isMobile && (
                            <>
                              <Form.Control
                                placeholder={countryCallingCode}
                                name="phone"
                                type="text"
                                value={phone}
                                onChange={(e) => {
                                  onChange(e);
                                }}
                                maxLength="10"
                                className="md:w-auto w-full"
                              />
                              <div className="text-center relative mobile-setting-dropdown flex items-center">
                                {selectedOption?.code ? (
                                  <img
                                    src={imageUrlSet}
                                    alt="Flag"
                                    className="circle-data"
                                  />
                                ) : (
                                  "No Flag"
                                )}
                                <SelectOptionDropdown
                                  imageUrlSet={imageUrlSet}
                                  setImageUrl={setImageUrl}
                                  selectedOption={selectedOption}
                                  setSelectedOption={setSelectedOption}
                                  setCountryCallingCode={setCountryCallingCode}
                                  countryCallingCode={countryCallingCode}
                                  setSearchText={setSearchText}
                                  searchText={searchText}
                                  setImageSearchUrl={setImageSearchUrl}
                                  imageSearchUrlSet={imageSearchUrlSet}
                                 
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <Form.Group className="form-group">
                        <Form.Label>Location</Form.Label>
                        <div
                          className="d-flex items-center phone-number-dropdown justify-between relative"
                        >
                          {!isMobile && (
                            <>
                              <Form.Control
                                placeholder={"City"}
                                name="city"
                                type="text"
                                value={city}
                                onChange={(e) => {
                                  onChange(e);
                                }}
                              />

                              {country ? (
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
                                  setNationality={setNationality}
                                />
                            </>
                          )}

                          {isMobile && (
                            <>
                              <Form.Control
                                placeholder={"City"}
                                name="city"
                                type="text"
                                value={city}
                                className="md:w-auto w-full"
                                onChange={(e) => {
                                  onChange(e);
                                }}
                              />

                              <div className="text-center relative mobile-setting-dropdown flex items-center">
                                {country ? (
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
                                  setNationality={setNationality}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md="6">
                      <Form.Group className="form-group">
                        <Form.Label>Currency preferred </Form.Label>
                        <div
                          className={`d-flex items-center phone-number-dropdown justify-between relative`}
                        >
                          {!isMobile && (
                            <>
                              <Form.Control
                                type="text"
                                placeholder="Currency"
                                name="currencyName"
                                value={currency}
                                onChange={onChange}
                              />
                              {currentPre ? (
                                <img
                                  src={imageCurrencyUrlSet}
                                  alt="Flag"
                                  className="circle-data"
                                />
                              ) : (
                                "No Flag"
                              )}

                              <SelectCurrencyDropdown
                                setImageCurrencyUrl={setImageCurrencyUrl}
                                setCurrentPre={setCurrentPre}
                                currentPre={currentPre}
                                setCurrency={setCurrency}
                                currency={currency}
                                setCurrencyPre={setCurrencyPre}
                                currencyPre={currencyPre}
                                setImageCurrencySearchUrl={
                                  setImageCurrencySearchUrl
                                }
                                imageCurrencySearchUrlSet={
                                  imageCurrencySearchUrlSet
                                }
                              />
                            </>
                          )}

                          {isMobile && (
                            <>
                              <Form.Control
                                type="text"
                                placeholder="Currency"
                                name="currencyName"
                                value={currency}
                                onChange={onChange}
                              />
                              <div className="text-center relative mobile-setting-dropdown flex items-center">
                                {currentPre ? (
                                  <img
                                    src={imageCurrencyUrlSet}
                                    alt="Flag"
                                    className="circle-data"
                                  />
                                ) : (
                                  "No Flag"
                                )}
                                <SelectCurrencyDropdown
                                  setImageCurrencyUrl={setImageCurrencyUrl}
                                  setCurrentPre={setCurrentPre}
                                  setCurrency={setCurrency}
                                  currency={currency}
                                  currentPre={currentPre}
                                  setCurrencyPre={setCurrencyPre}
                                  currencyPre={currencyPre}
                                  setImageCurrencySearchUrl={
                                    setImageCurrencySearchUrl
                                  }
                                  imageCurrencySearchUrlSet={
                                    imageCurrencySearchUrlSet
                                  }
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="edit-btn ">
                    <Button
                      className="btn btn-success"
                      variant="success"
                      onClick={submitHandler}
                    >
                      Save
                    </Button>
                  </div>
                </Form>
                <Card.Title as="h2" className="security-title">
                  Security
                </Card.Title>
                <div className="security-details">
                  <div className="security-text">
                    <div className="security-code">
                      <SecurityIcon width="20" height="16" />
                    </div>
                    <h4>Password</h4>
                    <p>Login password is used to log in to your account.</p>
                  </div>
                  <Button variant="primary" onClick={modalToggle}>
                    Reset Password
                  </Button>
                </div>
              </Card.Body>
            </Card>
            <GoogleAuth />
          </Col>
          <Col lg="4" className="account-setting-right">
            <VerifiedInfo />
          </Col>
        </Row>
      ) : (
        <Row className="account-setting-skeleton">
          <Col lg="8">
            <Card className="cards-dark mb-32">
              <Card.Body>
                <Card.Title as="h2">Account Information</Card.Title>
                <Placeholder as="div" animation="wave">
                  <Row className="inp-row">
                    <Col md="6" className="col">
                      <Placeholder className="input-skeleton" />
                    </Col>
                    <Col md="6" className="col">
                      <Placeholder className="input-skeleton" />
                    </Col>
                  </Row>
                  <Row className="inp-row">
                    <Col md="6" className="col">
                      <Placeholder className="input-skeleton" />
                    </Col>
                    <Col md="6" className="col">
                      <Placeholder className="input-skeleton" />
                    </Col>
                  </Row>
                  <Row className="inp-row">
                    <Col md="6" className="col">
                      <Placeholder className="input-skeleton" />
                    </Col>
                    <Col md="6" className="col">
                      <Placeholder className="input-skeleton" />
                    </Col>
                  </Row>
                </Placeholder>
                <Placeholder as="div" animation="wave">
                  <Placeholder className="form-button-skeleton" />
                </Placeholder>
                <Card.Title as="h2" className="mb-3 mt-2">
                  Security
                </Card.Title>
                <Placeholder as="div" animation="wave">
                  <Placeholder className="reset-pass" />
                </Placeholder>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="cards-dark">
              <Card.Body>
                <Card.Title as="h2">Verified</Card.Title>
                <Placeholder as="div" animation="wave">
                  <Placeholder className="li-skeleton"></Placeholder>
                  <Placeholder className="li-skeleton"></Placeholder>
                  <Placeholder className="li-skeleton"></Placeholder>
                  <Placeholder className="li-skeleton"></Placeholder>
                </Placeholder>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <ChangePasswordView show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};
export default AccountSetting;
