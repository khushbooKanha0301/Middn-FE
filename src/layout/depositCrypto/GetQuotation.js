import React, { useState } from "react";
import { TableLoader } from "../../helper/Loader";
import Select from "react-select";
import { Modal } from "react-bootstrap";

const data = [
  {
    value: 1,
    text: "GBP",
    currency: " Pound Sterling",
    balance: "$34",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
      </svg>
    ),
  },
  {
    value: 2,
    text: "EUR",
    balance: "₹23",
    currency: " Pound Sterling",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="#C4C4C4" />
      </svg>
    ),
  },
];

const GetQuotation = (props) => {
  const [selectedOptionAny, setSelectedOptionAny] = useState(data[0]);
  const [step, setStep] = useState(1);
  const handleChangeAny = (e) => {
    setSelectedOptionAny(e);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onClose?.();
  };
  const handleNextBtn = () => {
    setStep((s) => s + 1);
  };
  const handleBackBtn = () => {
    setStep((s) => s - 1);
  };
  return (
    <Modal
      {...props}
      dialogClassName="login-modal get-quotation-modal"
      backdropClassName="login-modal-backdrop"
      backdrop="static"
      keyboard={false}
      centered
    >
      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <div className="currency-step">
            <Modal.Header>
              <Modal.Title>Select Currency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="currency-step-select">
                <Select
                  defaultValue={selectedOptionAny}
                  value={selectedOptionAny}
                  className="select-dropdown"
                  isSearchable={false}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  classNamePrefix="select-dropdown"
                  options={data}
                  onChange={handleChangeAny}
                  getOptionLabel={(e) => (
                    <div className="selected-dropdown">
                      {e.icon}
                      <span className="text-white fs-13">{e.text}</span>
                      <span className="text-muted ms-2 fs-13 fw-600">
                        {e.currency}
                      </span>
                      <div className="ms-auto fw-500">
                        <span className="text-muted">Balance: </span>
                        <span className="text-white">{e.balance}</span>
                      </div>
                    </div>
                  )}
                />
              </div>
              <h4>Withdraw to</h4>
              <label>
                <input type="radio" Name="withdrawTo" className="theme-radio" />
                Bank Transfer (Faster Payments)
              </label>
              <span className="fs-14 fw-600 text-muted">1GBP</span>
              <label>
                <input type="radio" Name="withdrawTo" className="theme-radio" />
                Bank Card (Visa/MC)
              </label>
              <span className="fs-14 fw-600 text-muted">
                1.8% Transaction Fee
              </span>
              <div className="form-action-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={props.onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextBtn}
                >
                  Next Step
                </button>
              </div>
            </Modal.Body>
          </div>
        ) : step === 2 ? (
          <>
            <Modal.Header>
              <Modal.Title>Select Account</Modal.Title>
              <button className="btn btn-primary">Add Account</button>
            </Modal.Header>
            <Modal.Body>
              <div className="table-responsive tradeList row-selectable">
                <div className="flex-table table-secondary mt-0 w-100">
                  <div className="flex-table-header">
                    <div className="flex-40 text-start">Number</div>
                    <div className="flex-40 text-start px-2">Bank</div>
                    <div className="flex-20"></div>
                  </div>
                  {!"escrowLoading" ? (
                    <TableLoader />
                  ) : (
                    Array.from({ length: 2 }).map((_, i) => (
                      <>
                        <input
                          type="radio"
                          name="account"
                          id={i}
                          className="d-none"
                        />
                        <label
                          htmlFor={i}
                          className="flex-table-body tradeListBody"
                        >
                          <div className="flex-40 d-flex  align-items-center">
                            3122 3919 3812 3881
                          </div>
                          <div className="flex-35 text-start px-2">
                            Bank local
                          </div>
                          <div className="flex-25 d-flex justify-content-end align-items-center">
                            <span className="badge badge-danger fw-600">
                              Delete
                            </span>
                          </div>
                        </label>
                      </>
                    ))
                  )}
                </div>
              </div>
              <div className="form-action-group mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBackBtn}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextBtn}
                  className="btn btn-primary"
                >
                  Next Step
                </button>
              </div>
            </Modal.Body>
          </>
        ) : (
          <>
            <Modal.Header>
              <Modal.Title>Cash Out</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="theme-input-cover mb-3">
                <span>Spend</span>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control col pe-3"
                    placeholder="0.00"
                  />
                  <Select
                    defaultValue={selectedOptionAny}
                    value={selectedOptionAny}
                    className="select-dropdown "
                    isSearchable={false}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    classNamePrefix="select-dropdown"
                    options={data}
                    onChange={handleChangeAny}
                    getOptionLabel={(e) => (
                      <div className="selected-dropdown">
                        {e.icon}
                        <span>{e.text}</span>
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="fs-14 mb-3 d-flex justify-content-between">
                <span className="text-muted">Spot balance</span>
                <span>1 ETH ≈ 16699.98629876 GBP</span>
              </div>
              <div className="theme-input-cover mb-3">
                <span>Spend</span>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control col pe-3"
                    placeholder="0.00"
                  />
                  <Select
                    defaultValue={selectedOptionAny}
                    value={selectedOptionAny}
                    className="select-dropdown"
                    isSearchable={false}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    classNamePrefix="select-dropdown"
                    options={data}
                    onChange={handleChangeAny}
                    getOptionLabel={(e) => (
                      <div className="selected-dropdown">
                        {e.icon}
                        <span>{e.text}</span>
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="form-action-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBackBtn}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Get Quotation
                </button>
              </div>
            </Modal.Body>
          </>
        )}
      </form>
    </Modal>
  );
};

export default GetQuotation;
