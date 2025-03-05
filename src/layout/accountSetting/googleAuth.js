import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import googleAuth from "../../content/images/google-authenticator.png";
import TwoFactorSetup from "../../component/TwoFactorSetup";
import { useDispatch, useSelector } from "react-redux";
import { userGetData, userGetFullDetails } from "../../store/slices/AuthSlice";
import jwtAxios from "../../service/jwtAxios";
import { notificationFail, notificationSuccess } from "../../store/slices/notificationSlice";
import Swal from "sweetalert2/src/sweetalert2.js";

export const GoogleAuth = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userData = useSelector(userGetFullDetails);
  const [is2FAEnabled, setIs2FAEnabled] = useState(userData?.is_2FA_enabled);
  const [is2FASMSEnabled, setIs2FASMSEnabled] = useState(userData?.is_2FA_SMS_enabled);
  const dispatch = useDispatch();
  const [secret, setSecret] = useState("");
  const [qrCodeUrl, setQRCodeUrl] = useState("");
  useEffect(() => {
    setIs2FAEnabled(userData?.is_2FA_enabled);
  }, [userData?.is_2FA_enabled]);

  useEffect(() => {
    setIs2FASMSEnabled(userData?.is_2FA_SMS_enabled);
  }, [userData?.is_2FA_SMS_enabled]);

  const openModal = async () => {
    await jwtAxios.get("users/generate2FASecret").then((res) => {
      setSecret(res.data.secret);
      setQRCodeUrl(`otpauth://totp/Middn-APP?secret=${res.data.secret}`);
      setIsModalOpen(true);
    }).catch((error) => {
      if(typeof error == "string")
      {
        dispatch(notificationFail(error));
      }else{
        dispatch(notificationFail(error?.response?.data?.message));
      }
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const disable2FA = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Disable Google 2FA?",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#808080",
      confirmButtonText: "Disable",
      customClass:{
        popup:"suspend"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await jwtAxios
          .get("/users/disable2FA")
          .then((res) => {
            dispatch(notificationSuccess(res?.data?.message));
            setIs2FAEnabled(false);
            dispatch(userGetData(userGetData.userid)).unwrap();
          })
          .catch((error) => {
            if(typeof error == "string")
            {
              dispatch(notificationFail(error));
            }else{
              dispatch(notificationFail(error?.response?.data?.message));
            }
          });
      }
    });
  };

  const changeSMSEnabled = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${is2FASMSEnabled === null ? ("Enable") : (is2FASMSEnabled === false ? ("Enable") : ("Disable"))} SMS 2FA?`,  
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#808080",
      confirmButtonText: `${is2FASMSEnabled === null ? ("Enable") : (is2FASMSEnabled === false ? ("Enable") : ("Disable"))}`,
      customClass: {
        popup: "suspend",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await jwtAxios
        .get("users/disable2FASMS")
        .then(async (res) => {
          dispatch(notificationSuccess(res?.data?.message));
          setIs2FASMSEnabled(false);
          dispatch(userGetData(userGetData.userid)).unwrap();
        })
        .catch((err) => {
          if (typeof err == "string") {
            dispatch(notificationFail(err));
          } else {
            dispatch(notificationFail(err?.response?.data?.message));
          }
        });
      }
    });
  }
  
  return (
    <Card className="cards-dark mb-32">
      <Card.Body className="two-f-a"> 
        <Card.Title as="h2">2FA</Card.Title>
        <div
          className="ul-button-row"
        >
          <ul className="two-fa mb-3">
            <li>
              <div className="two-fa-step">
                <img
                  src={require("../../content/images/google-authenticator.png")}
                  alt="Google Authentication"
                />
                <h4>Google Authentication</h4>
                {!is2FAEnabled ? (
                  <p>Click on Enable to Start Google 2FA</p>
                ) : (
                  <p>You have successfully activated Google 2FA</p>
                )}
              </div>
              <TwoFactorSetup
                isOpen={isModalOpen}
                onClose={closeModal}
                setIs2FAEnabled={setIs2FAEnabled}
                secret={secret}
                qrCodeUrl={qrCodeUrl}
              />
            </li>
          </ul>

          <div className="button-row">
            {is2FAEnabled === null ? (
              ""
            ) : is2FAEnabled === false ? (
              <Button variant="primary" onClick={openModal}>
                Enable
              </Button>
            ) : (
              <Button variant="danger" onClick={disable2FA}>
                Disable
              </Button>
            )}
          </div>
        </div>
        <div
          className="ul-button-row"
        >
          <ul className="two-fa mb-3">
            <li>
              <div className="two-fa-step">
                <img
                  src={require("../../content/images/mobile-device.png")}
                  alt="Google Authentication"
                />
                <h4>SMS Authentication</h4>
                <p>You have successfully activated SMS 2FA.</p>
              </div>
            </li>
          </ul>

          <div className="button-row">
            {is2FASMSEnabled === null ? (
              ""
            ) : is2FASMSEnabled === false ? (
              <Button variant="primary" onClick={changeSMSEnabled}>
                Enable
              </Button>
            ) : (
              <Button variant="danger" onClick={changeSMSEnabled}>
                Disable
              </Button>
            )}
          </div>
        </div>
        <div
          className="ul-button-row"
        >
          <ul className="two-fa mb-3">
            <li>
              <div className="two-fa-step">
                <img
                  src={require("../../content/images/mobile-device.png")}
                  alt="Google Authentication"
                />
                <h4>Email Authentication</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                
              </div>
              <TwoFactorSetup
                isOpen={isModalOpen}
                onClose={closeModal}
                setIs2FAEnabled={setIs2FAEnabled}
                secret={secret}
                qrCodeUrl={qrCodeUrl}
              />
            </li>
          </ul>

          <div className="button-row">
            <Button variant="danger" className="deactiveBtn">
              Disable
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default GoogleAuth;
