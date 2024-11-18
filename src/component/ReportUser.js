import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  notificationFail,
  notificationSuccess,
} from "../store/slices/notificationSlice";
import jwtAxios from "../service/jwtAxios";
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../store/slices/AuthSlice";
import { Box } from "@mui/material";

//This component is used for report user on profile page 
export const ReportUserView = (props) => {
  const { id} = props;
  const [reason, setReason] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector(userDetails);

  useEffect(() => {
    if (props.show) {
      setReason("");
    }
  }, [props.show]);

  const verifiedWith = (selectedReason) => {
    if (selectedReason === reason) {
      setReason("");
    } else {
      setReason(selectedReason);
    }
  };

  const submitHandler = async () => {
    if (!reason || reason == "") {
      dispatch(notificationFail("Please select any one reason"));
    } else {
      const reqData = {
        report_from_user_address: userData?.account,
        to_report_user: id,
        reason,
      };
      await jwtAxios
        .post(`/users/reportUser`, reqData)
        .then((result) => {
          if (result) {
            dispatch(notificationSuccess(result?.data?.message));
            props.onHide();
          }
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
          props.onHide();
        });
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
      <Modal.Header closeButton>
        <Modal.Title>Report User</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-4">
        <h4>Report this user</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <Form className="mt-4">
          <Form.Group className="custom-input">
            {[1, 2, 3].map((num) => (
              <div
                key={`test${num}`}
                className="document-issued form-check"
                onClick={() => verifiedWith(`Test ${num}`)}
              >
                <div
                  className={`form-check-input ${
                    reason === `Test ${num}` ? "checked" : ""
                  }`}
                />
                <label className="form-check-label">
                  <>Test {num}</>
                </label>
              </div>
            ))}
          </Form.Group>

          <Form.Group className="custom-input">
            <Box className="other-reason">
              <Form.Label className="mb-1">Other reason</Form.Label>
              <div
                className="document-issued form-check"
                onClick={() => verifiedWith("")}
              >
                <div
                  className={`form-check-input ${
                    reason === "" ? "checked" : ""
                  }`}
                />
                <Form.Control
                  className=""
                  type="text"
                  name="reason"
                  placeholder="Other reason"
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </Box>
          </Form.Group>

          <div className="form-action-group">
            <Button variant="primary" onClick={submitHandler}>
              Submit
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

export default ReportUserView;
