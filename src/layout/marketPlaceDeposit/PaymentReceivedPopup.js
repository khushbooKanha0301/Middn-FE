import { Modal, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 586,
  bgcolor: " #18191D",
  padding: "20px",
  borderRadius: "16px",
  color: "white",
};

const PaymentReceivedPopup = ({ onHide, show }) => {
  const [step, setStep] = useState(1);
  const [escrowType, setEscrowType] = useState(null);
  const navigate = useNavigate();
  const formSubmitHandler = async (e) => {
    e.preventDefault();
  };
  const handleOptionClick = (option) => {
    setEscrowType(option);
  };
  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
    navigate("/");
  };
  return (
    <Modal
      className="payment-received-popup"
      dialogClassName="login-modal"
      backdropClassName="login-modal-backdrop"
      aria-labelledby="contained-modal"
      backdrop="static"
      keyboard={false}
      centered
      show={show}
      onHide={onHide}
    >
      <Form onSubmit={formSubmitHandler}>
        {step === 1 && (
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              sx={{
                fontSize: "18px",
                fontWeight: "500",
                fontFamily: "Eudoxus Sans",
              }}
            >
              Received the payment in your account?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mt: 2,
                fontFamily: "Eudoxus Sans",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "23px",
                color: "#FFFFFF99",
                mb: "20px",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo
              lentesque consectetur adipiscing elit.
            </Typography>

            <Box className="market-place-buy-sell">
              <div
                className="yourself-option form-check"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
                onClick={() => handleOptionClick("verified")}
              >
                <div
                  className={`form-check-input check-input ${
                    escrowType === "verified" ? "selected" : ""
                  }`}
                />
                <label className="form-check-label">
                  I have received and verified the payment
                </label>
              </div>
            </Box>
            <Box sx={{ display: "flex", marginTop: "62px", gap: "10px" }}>
              <Button
                variant="contained"
                className="btn-primary"
                onClick={handleNext}
                style={{
                  padding: "16px 21px",
                  width: "100%",
                }}
              >
                Confirm Release
              </Button>
              <Button
                variant="contained"
                className="btn-primary"
                onClick={handleBack}
                style={{
                  padding: "16px 21px",
                  background: "#373A43",
                  color: "#fff",
                  width: "100%",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
        {step === 2 && (
          <>
            <Modal.Header>
              <Modal.Title>Security Verification Requiremenets</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3">
              <p
                className="mb-4"
                style={{ fontFamily: "Eudoxus Sans", fontWeight: 100 }}
              >
                You need to complete all of the following verifications to
                continue
              </p>
              <Typography
                variant="h2"
                sx={{
                  background:
                    "linear-gradient(263.76deg, #7FFC8D -28.53%, #C6FA56 140.05%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  marginBottom: "24px",
                  fontSize: "26px",
                }}
              >
                0/1
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ marginBottom: "12px !important" }}
                  >
                    Passkeys
                  </Typography>
                  <Typography
                    variant="p"
                    sx={{ color: "#808191", fontSize: "14px" }}
                  >
                    Verify with biometrics or security keys
                  </Typography>
                </Box>
                <Box>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M27.7075 16.7081L18.7075 25.7081C18.5199 25.8957 18.2654 26.0011 18 26.0011C17.7346 26.0011 17.4801 25.8957 17.2925 25.7081C17.1049 25.5204 16.9994 25.2659 16.9994 25.0006C16.9994 24.7352 17.1049 24.4807 17.2925 24.2931L24.5863 17.0006H5C4.73478 17.0006 4.48043 16.8952 4.29289 16.7077C4.10536 16.5201 4 16.2658 4 16.0006C4 15.7353 4.10536 15.481 4.29289 15.2934C4.48043 15.1059 4.73478 15.0006 5 15.0006H24.5863L17.2925 7.70806C17.1049 7.52042 16.9994 7.26592 16.9994 7.00056C16.9994 6.73519 17.1049 6.4807 17.2925 6.29306C17.4801 6.10542 17.7346 6 18 6C18.2654 6 18.5199 6.10542 18.7075 6.29306L27.7075 15.2931C27.8005 15.3859 27.8742 15.4962 27.9246 15.6176C27.9749 15.739 28.0008 15.8691 28.0008 16.0006C28.0008 16.132 27.9749 16.2621 27.9246 16.3835C27.8742 16.5049 27.8005 16.6152 27.7075 16.7081Z"
                      fill="white"
                    />
                  </svg>
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  background:
                    "linear-gradient(263.76deg, #7FFC8D -28.53%, #C6FA56 140.05%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  margin: "24px 0px",
                  fontSize: "16px",
                }}
              >
                My passkeys Are Not Available
              </Typography>
              <Box sx={{ display: "flex", marginTop: "32px", gap: "10px" }}>
                <Button
                  variant="contained"
                  className="btn-primary"
                  onClick={handleNext}
                  style={{
                    padding: "16px 21px",
                    width: "100%",
                  }}
                >
                  Confirm Release
                </Button>
                <Button
                  variant="contained"
                  className="btn-primary"
                  onClick={handleBack}
                  style={{
                    padding: "16px 21px",
                    background: "#373A43",
                    color: "#fff",
                    width: "100%",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Modal.Body>
          </>
        )}
        {step === 3 && (
          <Box sx={{ padding: "32px", height: "276px" }}>
            <Modal.Header style={{ padding: "0px" }}>
              <Modal.Title>Security Verification</Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2 details-model-body">
              <Box
                sx={{
                  display: "table",
                  margin: "62px auto 0 ",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="78"
                  height="78"
                  viewBox="0 0 78 78"
                  fill="none"
                >
                  <g clip-path="url(#clip0_245_5946)">
                    <path
                      d="M39.0008 14.4677C36.862 14.4677 35.2266 12.8323 35.2266 10.6935V3.77419C35.2266 1.63548 36.862 0 39.0008 0C41.1395 0 42.7749 1.63548 42.7749 3.77419V10.6935C42.7749 12.7065 41.1395 14.4677 39.0008 14.4677Z"
                      fill="#7FFC8D"
                    />
                    <path
                      d="M39.0008 78.0009C36.862 78.0009 35.2266 76.3655 35.2266 74.2268V67.3074C35.2266 65.1687 36.862 63.5332 39.0008 63.5332C41.1395 63.5332 42.7749 65.1687 42.7749 67.3074V74.2268C42.7749 76.3655 41.1395 78.0009 39.0008 78.0009Z"
                      fill="#7FFC8D"
                    />
                    <path
                      d="M24.7848 18.2411C23.5267 18.2411 22.2687 17.6121 21.5138 16.354L18.117 10.4411C17.1106 8.67984 17.7396 6.28951 19.5009 5.28306C21.2622 4.27661 23.6525 4.90564 24.659 6.66693L28.0558 12.5798C29.0622 14.3411 28.4332 16.7314 26.6719 17.7379C26.1687 17.9895 25.4138 18.2411 24.7848 18.2411Z"
                      fill="#7FFC8D"
                    />
                    <path
                      d="M56.6129 73.2196C55.3548 73.2196 54.0968 72.5906 53.3419 71.3325L49.9452 65.4196C48.9387 63.6583 49.5678 61.268 51.329 60.2616C53.0903 59.2551 55.4807 59.8842 56.4871 61.6454L59.8839 67.5584C60.8903 69.3196 60.2613 71.71 58.5 72.7164C57.871 73.0938 57.2419 73.2196 56.6129 73.2196Z"
                      fill="#7FFC8D"
                    />
                    <path
                      d="M14.4669 28.559C13.8379 28.559 13.2089 28.4332 12.5798 28.0558L6.66693 24.659C4.90564 23.6525 4.27661 21.2622 5.28306 19.5009C6.28951 17.7396 8.67984 17.1106 10.4411 18.117L16.354 21.5138C18.1153 22.5203 18.7444 24.9106 17.7379 26.6719C16.9831 27.9299 15.725 28.559 14.4669 28.559Z"
                      fill="#E1FFF9"
                    />
                    <path
                      d="M69.5713 60.3871C68.9422 60.3871 68.3132 60.2613 67.6842 59.8839L61.6454 56.4871C59.8842 55.4807 59.2551 53.0903 60.2616 51.329C61.268 49.5678 63.6583 48.9387 65.4196 49.9452L71.3325 53.3419C73.0938 54.3484 73.7229 56.7387 72.7164 58.5C72.0874 59.7581 70.8293 60.3871 69.5713 60.3871Z"
                      fill="#7FFC8D"
                    />
                    <path
                      d="M10.6935 42.7749H3.77419C1.63548 42.7749 0 41.1395 0 39.0008C0 36.862 1.63548 35.2266 3.77419 35.2266H10.6935C12.8323 35.2266 14.4677 36.862 14.4677 39.0008C14.4677 41.1395 12.7065 42.7749 10.6935 42.7749Z"
                      fill="#F3FFFD"
                    />
                    <path
                      d="M74.2268 42.7749H67.3074C65.1687 42.7749 63.5332 41.1395 63.5332 39.0008C63.5332 36.862 65.1687 35.2266 67.3074 35.2266H74.2268C76.3655 35.2266 78.0009 36.862 78.0009 39.0008C78.0009 41.1395 76.3655 42.7749 74.2268 42.7749Z"
                      fill="#7FFC8D"
                    />
                    <path
                      d="M8.42903 60.3871C7.17096 60.3871 5.9129 59.7581 5.15806 58.5C4.15161 56.7387 4.78064 54.3484 6.54193 53.3419L12.4548 49.9452C14.2161 48.9387 16.6064 49.5678 17.6129 51.329C18.6194 53.0903 17.9903 55.4807 16.229 56.4871L10.3161 59.8839C9.8129 60.2613 9.18387 60.3871 8.42903 60.3871Z"
                      fill="#7FFC8D"
                    />
                    <path
                      d="M63.5325 28.559C62.2745 28.559 61.0164 27.9299 60.2616 26.6719C59.2551 24.9106 59.8842 22.5203 61.6454 21.5138L67.5584 18.117C69.3196 17.1106 71.71 17.7396 72.7164 19.5009C73.7229 21.2622 73.0938 23.6525 71.3325 24.659L65.4196 28.0558C64.7906 28.4332 64.1616 28.559 63.5325 28.559Z"
                      fill="#7FFC8D"
                    />
                    <path
                      d="M21.388 73.2196C20.759 73.2196 20.1299 73.0938 19.5009 72.7164C17.7396 71.71 17.1106 69.3196 18.117 67.5584L21.5138 61.6454C22.5203 59.8842 24.9106 59.2551 26.6719 60.2616C28.4332 61.268 29.0622 63.6583 28.0558 65.4196L24.659 71.3325C23.9041 72.5906 22.6461 73.2196 21.388 73.2196Z"
                      fill="#7FFC8D"
                    />
                    <path
                      d="M53.2161 18.2411C52.5871 18.2411 51.9581 18.1153 51.329 17.7379C49.5678 16.7314 48.9387 14.3411 49.9452 12.5798L53.3419 6.66693C54.3484 4.90564 56.7387 4.27661 58.5 5.28306C60.2613 6.28951 60.8903 8.67984 59.8839 10.4411L56.4871 16.354C55.7323 17.4863 54.4742 18.2411 53.2161 18.2411Z"
                      fill="#7FFC8D"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_245_5946">
                      <rect width="78" height="78" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Box>
              <Box sx={{ display: "flex", marginTop: "62px", gap: "10px" }}>
                <Button
                  variant="contained"
                  className="btn-primary"
                  onClick={handleNext}
                  style={{
                    padding: "16px 21px",
                    width: "100%",
                  }}
                >
                  Confirm Release
                </Button>
                <Button
                  variant="contained"
                  className="btn-primary"
                  onClick={handleBack}
                  style={{
                    padding: "16px 21px",
                    background: "#373A43",
                    color: "#fff",
                    width: "100%",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Modal.Body>
          </Box>
        )}
        {step === 4 && (
          <>
            <Modal.Body>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <svg
                  width="144"
                  height="144"
                  viewBox="0 0 144 144"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M117 13.5H27C23.4229 13.5107 19.9953 14.9364 17.4659 17.4659C14.9364 19.9953 13.5107 23.4229 13.5 27V54C13.5107 57.5771 14.9364 61.0047 17.4659 63.5341C19.9953 66.0636 23.4229 67.4893 27 67.5C29.4853 67.5 31.5 65.4853 31.5 63V48.5342C31.5 46.5823 29.6982 45.0622 28.318 43.682C27.4741 42.8381 27 41.6935 27 40.5C27 39.3065 27.4741 38.1619 28.318 37.318C29.1619 36.4741 30.3065 36 31.5 36H112.5C113.693 36 114.838 36.4741 115.682 37.318C116.526 38.1619 117 39.3065 117 40.5C117 41.6935 116.526 42.8381 115.682 43.682C114.302 45.0622 112.5 46.5823 112.5 48.5342V63C112.5 65.4853 114.515 67.5 117 67.5C120.577 67.4893 124.005 66.0636 126.534 63.5341C129.064 61.0047 130.489 57.5771 130.5 54V27C130.489 23.4229 129.064 19.9953 126.534 17.4659C124.005 14.9364 120.577 13.5107 117 13.5Z"
                    fill="url(#paint0_linear_245_6215)"
                  />
                  <path
                    d="M40.5 117C40.5107 120.577 41.9364 124.005 44.4659 126.534C46.9953 129.064 50.4229 130.489 54 130.5H90C93.5771 130.489 97.0047 129.064 99.5341 126.534C102.064 124.005 103.489 120.577 103.5 117V61C103.5 52.1634 96.3366 45 87.5 45H56.5C47.6634 45 40.5 52.1634 40.5 61V117ZM55.3185 82.3185C56.1624 81.4749 57.3068 81.001 58.5 81.001C59.6932 81.001 60.8376 81.4749 61.6815 82.3185C63.8287 84.4657 67.5 82.945 67.5 79.9084V67.5C67.5 66.3065 67.9741 65.1619 68.818 64.318C69.6619 63.4741 70.8065 63 72 63C73.1935 63 74.3381 63.4741 75.182 64.318C76.0259 65.1619 76.5 66.3065 76.5 67.5V79.9084C76.5 82.945 80.1713 84.4657 82.3185 82.3185C83.1672 81.4988 84.3039 81.0452 85.4838 81.0555C86.6637 81.0657 87.7923 81.539 88.6267 82.3733C89.461 83.2077 89.9343 84.3363 89.9445 85.5162C89.9548 86.6961 89.5012 87.8328 88.6815 88.6815L75.1815 102.182C74.3376 103.025 73.1932 103.499 72 103.499C70.8068 103.499 69.6624 103.025 68.8185 102.182L55.3185 88.6815C54.4749 87.8376 54.001 86.6932 54.001 85.5C54.001 84.3068 54.4749 83.1624 55.3185 82.3185Z"
                    fill="url(#paint1_linear_245_6215)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_245_6215"
                      x1="167.536"
                      y1="13.5"
                      x2="-39.6506"
                      y2="62.5834"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#7FFC8D" />
                      <stop offset="1" stop-color="#C6FA56" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_245_6215"
                      x1="123.442"
                      y1="45"
                      x2="6.37903"
                      y2="54.4314"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#7FFC8D" />
                      <stop offset="1" stop-color="#C6FA56" />
                    </linearGradient>
                  </defs>
                </svg>
                <Typography
                  variant="h2"
                  sx={{
                    background:
                      "linear-gradient(263.76deg, #7FFC8D -28.53%, #C6FA56 140.05%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    marginBottom: "8px",
                  }}
                >
                  £ 1620
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#FFFFFF99",
                    fontWeight: 100,
                    fontFamily: "Eudoxus Sans",
                    fontSize: "14px",
                    marginBottom: "0px !important",
                  }}
                >
                  Successfully sold 0,00012312 ETH
                </Typography>
              </Box>
              <Box sx={{ display: "flex", marginTop: "32px", gap: "10px" }}>
                <Button
                  variant="contained"
                  className="btn-primary"
                  // onClick={handleNext}
                  style={{
                    padding: "16px 21px",
                    width: "100%",
                  }}
                >
                  Done
                </Button>
                <Button
                  variant="contained"
                  className="btn-primary"
                  onClick={handleBack}
                  style={{
                    padding: "16px 21px",
                    background: "#373A43",
                    color: "#fff",
                    width: "100%",
                  }}
                >
                  Go Home
                </Button>
              </Box>
            </Modal.Body>
          </>
        )}
      </Form>
    </Modal>
  );
};
export default PaymentReceivedPopup;
