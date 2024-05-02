import React, { useState } from "react";
import { Card, Button, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  CheckmarkIcon,
  IdentificationCardIcon,
  MapPinIcon,
  UserFocusIcon,
  UserListIcon,
  WhiteCrossIcon,
} from "../../component/SVGIcon";
import { useSelector } from "react-redux";
import { userGetFullDetails } from "../../store/slices/AuthSlice";
import jwtAxios from "../../service/jwtAxios";
import { notificationFail } from "../../store/slices/notificationSlice";
import KYCVerification from "../../component/KYCVerification";

export const VerifiedInfo = () => {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const userData = useSelector(userGetFullDetails);
  const [modalKycShow, setModalKYCShow] = useState(false);
  const [kycSubmitted, setKYCSubmitted] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);

  const modalKycToggle = async () => {
    setModalKYCShow(!modalShow);
  };

  return (
    <>
      <Card className="cards-dark">
        <Card.Body>
          <Card.Title as="h2">
            {(userData?.kyc_completed === true || kycSubmitted === true) &&
            userData?.is_verified === 1 &&
            kycSubmitted === false ? (
              <span className="verified-info">Verified</span>
            ) : (
              <span className="verified-info">Unverified</span>
            )}
          </Card.Title>
          <ul className="verified">
            <li>
              <div className="verified-step">
                <UserListIcon width="25" height="24" />
                <p>Personal information</p>
              </div>
              {userData.fname &&
              userData.lname &&
              userData.email &&
              userData.phone ? (
                <div className="checkmark">
                  <CheckmarkIcon width="10" height="8" />
                </div>
              ) : (
                <div className="crossmark">
                  <WhiteCrossIcon width="10" height="8" />
                </div>
              )}
            </li>
            <li>
              <div className="verified-step">
                <IdentificationCardIcon width="24" height="24" />
                <p>Goverment-issued ID</p>
              </div>
              {!userData.passport_url ? (
                <div className="crossmark">
                  <WhiteCrossIcon width="10" height="8" />
                </div>
              ) : (
                <div className="checkmark">
                  <CheckmarkIcon width="10" height="8" />
                </div>
              )}
            </li>
            <li>
              <div className="verified-step">
                <UserFocusIcon width="24" height="24" />
                <p>Facial recognition</p>
              </div>
              <div className="crossmark">
                <WhiteCrossIcon width="10" height="8" />
              </div>
            </li>
            <li>
              <div className="verified-step">
                <MapPinIcon width="24" height="24" />
                <p>Proof Location</p>
              </div>
              <div className="crossmark">
                <WhiteCrossIcon width="10" height="8" />
              </div>
            </li>
          </ul>
        </Card.Body>
      </Card>

      <Card body className="cards-dark kyc-verification">
        <Card.Title as="h2">Identity Verification - KYC</Card.Title>
        <Card.Text>
          To comply with regulation, participant will have to go through
          identity verification.
          <br />
          <br />
          You have not submitted your documents to verify your identity (KYC).
        </Card.Text>

        {(userData?.kyc_completed === true || kycSubmitted === true) &&
          (userData?.is_verified === 1 && kycSubmitted === false ? (
            <Button variant="success" disabled>
              Your KYC Details is approved
            </Button>
          ) : userData?.is_verified === 2 && kycSubmitted === false ? (
            <Button
              variant="primary"
              className="auth-btn"
              onClick={modalKycToggle}
            >
              Click to Proceed
            </Button>
          ) : userData?.is_verified === 0 || kycSubmitted === true ? (
            <Button variant="warning" disabled>
              Your KYC Details is Under Review
            </Button>
          ) : null)}

        {(userData?.kyc_completed === false ||
          userData?.kyc_completed === undefined) &&
          kycSubmitted === false && (
            <Button
              variant="primary"
              className="auth-btn"
              onClick={modalKycToggle}
            >
              Click to Proceed
            </Button>
          )}
      </Card>
      <KYCVerification
        show={
          ((userData?.kyc_completed === true && userData?.is_verified === 2) ||
            userData?.kyc_completed === false ||
            userData?.kyc_completed == undefined) &&
          modalKycShow
        }
        onHide={() => setModalKYCShow(false)}
        setkycsubmitted={setKYCSubmitted}
      />
    </>
  );
};
export default VerifiedInfo;
