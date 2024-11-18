import React from "react";
import { Modal } from "react-bootstrap";

const AddBankTransfer = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onClose?.();
  };
  return (
    <Modal
      {...props}
      dialogClassName="login-modal add-bank-transfer-modal"
      backdropClassName="login-modal-backdrop"
      backdrop="static"
      keyboard={false}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>Add Bank Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="theme-input-cover mb-3">
            <span>Name</span>
            <input
              type="text"
              className="form-control"
              placeholder="Your full name"
            />
          </label>
          <label className="theme-input-cover mb-3">
            <span>Bank account number</span>
            <input
              type="text"
              className="form-control"
              placeholder="Please enter your bank account number"
            />
          </label>
          <label className="theme-input-cover mb-3">
            <span>Bank name</span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the name of your bank"
            />
          </label>
          <label className="theme-input-cover ">
            <span>Account opening branch (optional)</span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter bank branch information"
            />
          </label>
          <div className="form-action-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={props.onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add bank
            </button>
          </div>
        </Modal.Body>
      </form>
    </Modal>
  );
};

export default AddBankTransfer;
