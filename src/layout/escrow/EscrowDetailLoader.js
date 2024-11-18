import React from "react";
import { Col, Row, Card, Form, Button, Placeholder } from "react-bootstrap";

function EscrowDetailLoader() {
  return (
    <div className="escrow-details">
      <Row>
        <Col lg="8">
          <Row>
            <Col lg="12">
              <div className="designCheap">
                <h4></h4>
                <p></p>
                <div className="edit-btn ">
                  <Button
                    className="btn btn-success btn-width"
                    variant="success"
                  >
                    Edit
                  </Button>
                  <Button
                    className="btn btn-danger btn-width"
                    variant="success"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Amount</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    name="phone"
                    type="text"
                    value="1"
                    maxLength="10"
                  />

                  <div className="d-flex align-items-center currency-info">
                    <div className="token-type">
                      <span className="token-icon"></span>
                    </div>

                    <p className="text-white mb-0">MID</p>
                  </div>
                  <div className="country-select">
                    <div className="form-select form-select-sm" />
                  </div>
                </div>
              </Form.Group>
            </Col>
            <Col md="6">
              <Form.Group className="form-group">
                <Form.Label>Network </Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    name="phone"
                    type="text"
                    value="1"
                    maxLength="10"
                  />
                  {/* <div className="d-flex align-items-center currency-info">
                    <div className="token-type">
                      <span className="token-icon"></span>
                    </div>

                    <p className="text-white mb-0">USD</p>
                  </div> */}

                  <div className="country-select">
                    <div className="form-select form-select-sm" />
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <div className="d-flex main-limit mb-3">
                <div className="limit-txt">Limit: </div>
                <div className="limit-txt-right">3MID</div>
              </div>

              <div className="d-flex main-limit mb-2">
                <h6>Detail</h6>
              </div>

              <div className="d-flex main-limit">
                <label>Payment Information</label>
              </div>

              <div className="d-flex main-limit">
                <div className="limit-txt-right">
                  Amount to transfer to Middn{" "}
                </div>
                <div className="limit-txt-left-amount">105,02 BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div className="limit-txt-right">Invoice Amount</div>
                <div className="limit-txt-left">105,00 BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div className="limit-txt-right">Escrow fees </div>
                <div className="limit-txt-left">0,02 BNB</div>
              </div>

              <div className="d-flex main-limit">
                <div className="limit-txt-right">Total</div>
                <div className="limit-txt-left">105,02 BNB</div>
              </div>
              <div className="d-flex main-limit">
                <Form.Group className="custom-input-seller">
                  <div className="form-check">
                    <div className={`form-check-input`} />
                    <label className="form-check-label" for="vehicle1">
                      I agree to Middin's escrow terms and conditions.
                    </label>
                  </div>
                </Form.Group>
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg="4">
          <Card className="cards-dark mb-4">
            <Card.Body>
              <Card.Title as="h2">Information</Card.Title>
              <div className="profile-information">
                <Row className="align-items-center g-0">
                  <Col xs="7">
                    <label>Location</label>
                  </Col>
                  <Col>
                    <Placeholder as="div" className="skeleton" animation="wave">
                      <Placeholder className="profile-info-skeleton" />
                    </Placeholder>
                  </Col>
                </Row>
                <Row className="align-items-center g-0">
                  <Col xs="7">
                    <label>Trades</label>
                  </Col>
                  <Col>
                    <Placeholder as="div" className="skeleton" animation="wave">
                      <Placeholder className="profile-info-skeleton" />
                    </Placeholder>
                  </Col>
                </Row>
                <Row className="align-items-center g-0">
                  <Col xs="7">
                    <label>Trading partners</label>
                  </Col>
                  <Col>
                    <Placeholder as="div" className="skeleton" animation="wave">
                      <Placeholder className="profile-info-skeleton" />
                    </Placeholder>
                  </Col>
                </Row>
                <Row className="align-items-center g-0">
                  <Col xs="7">
                    <label>Feedback score</label>
                  </Col>
                  <Col>
                    <Placeholder as="div" className="skeleton" animation="wave">
                      <Placeholder className="profile-info-skeleton" />
                    </Placeholder>
                  </Col>
                </Row>
                <Row className="align-items-center g-0">
                  <Col xs="7">
                    <label>Account created</label>
                  </Col>
                  <Col>
                    <Placeholder as="div" className="skeleton" animation="wave">
                      <Placeholder className="profile-info-skeleton" />
                    </Placeholder>
                  </Col>
                </Row>
                <Row className="align-items-center g-0">
                  <Col xs="7">
                    <label>Typical finalization time</label>
                  </Col>
                  <Col>
                    <Placeholder as="div" className="skeleton" animation="wave">
                      <Placeholder className="profile-info-skeleton" />
                    </Placeholder>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>

          <Card className="cards-dark">
            <Card.Body>
              <Card.Title as="h2">Summary</Card.Title>
              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span className="summery-txt-left">Price</span>
                <strong className="summery-txt">15.4905468 ETH</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span className="summery-txt-left">Limit</span>
                <strong className="summery-txt">0.1-0.6 MID</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span className="summery-txt-left">Payment methods</span>
                <strong className="summery-txt">Ethereum</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span className="summery-txt-left">Network</span>
                <strong className="summery-txt"> Binance Smart Chain</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center buyerDetails">
                <span className="summery-txt-left">Time constraints</span>
                <strong className="summery-txt">09:00 AM - 00:00 AM</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default EscrowDetailLoader;
