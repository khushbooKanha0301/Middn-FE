import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  CheckmarkIcon,
  IdentificationCardIcon,
  MapPinIcon,
  UserFocusIcon,
  UserListIcon,
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
    await jwtAxios
      .get(`/users/getuser`)
      .then((response) => {
        if (
          (response.data?.User?.kyc_completed === true &&
            response.data?.User?.is_verified === 2) ||
          response.data?.User?.kyc_completed === false ||
          response.data?.User?.kyc_completed == undefined
         
        ) {
          setModalKYCShow(!modalShow);
        } else {
          dispatch(notificationFail("KYC already Submitted"));
        }
      })
      .catch((error) => {
        dispatch(notificationFail("Something went wrong with get user"));
      });
  };

  return (
    <Card className="cards-dark">
      <Card.Body>
        <Card.Title as="h2">Verified</Card.Title>
        <ul className="verified">
          <li>
            <div className="verified-step">
              <UserListIcon width="25" height="24" />
              <p>Personal information</p>
            </div>
            <div className="checkmark">
              <CheckmarkIcon width="10" height="8" />
            </div>
          </li>
          <li>
            <div className="verified-step">
              <IdentificationCardIcon width="24" height="24" />
              <p>Goverment-issued ID</p>
            </div>
            <div className="checkmark">
              <CheckmarkIcon width="10" height="8" />
            </div>
          </li>
          <li>
            <div className="verified-step">
              <UserFocusIcon width="24" height="24" />
              <p>Facial recognition</p>
            </div>
            <div className="checkmark">
              <CheckmarkIcon width="10" height="8" />
            </div>
          </li>
          <li>
            <div className="verified-step">
              <MapPinIcon width="24" height="24" />
              <p>Proof Location</p>
            </div>
            <div className="checkmark">
              <CheckmarkIcon width="10" height="8" />
            </div>
          </li>
        </ul>
          {(userData?.kyc_completed === true || kycSubmitted === true) &&
          ((userData?.is_verified === 1 && kycSubmitted === false) ? (
            <Button variant="success" disabled>
              Your KYC Details is approved
            </Button>
          ) : (userData?.is_verified === 2 && kycSubmitted === false) ? (
            <Button variant="primary" className="auth-btn" onClick={modalKycToggle}>
              KYC Verification
            </Button>
          ) : (userData?.is_verified === 0 || kycSubmitted === true) ? (
            <Button variant="warning" disabled>
               Your KYC Details is Under Review
            </Button>
          ) : null)}

          {(userData?.kyc_completed === false || userData?.kyc_completed === undefined )&&
          kycSubmitted === false && (
            <Button
              variant="primary"
              className="auth-btn"
              onClick={modalKycToggle}
            >
              KYC Verification
            </Button>
          )}
      </Card.Body>
      <KYCVerification
        show={
          ((userData?.kyc_completed === true &&
            userData?.is_verified === 2) ||
            userData?.kyc_completed === false || userData?.kyc_completed == undefined) &&
          modalKycShow
        }
        onHide={() => setModalKYCShow(false)}
        setkycsubmitted={setKYCSubmitted}
      />
    </Card>
    
  );
};
export default VerifiedInfo;
