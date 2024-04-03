import { Box } from "@mui/material";
import React from "react";
import { Col, Row, Placeholder, Card } from "react-bootstrap";

export const ProfileLoader = () => {
  return (
   <Row className="g-0">
        <Col style={{ maxWidth: "345px", width: "100%" }}>
          <Placeholder as="div" animation="wave" className="profile-loader">
            <Placeholder xs="6" className="profile-img-placeholder skeleton" />
            <Box sx={{ width: "100%" ,marginLeft:"20px"}}>
              <Placeholder className="profile-title skeleton" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "14px",
                }}
              >
                <Placeholder className="profile-subtitle skeleton" />
                <Placeholder className="profile-subtitle skeleton" />
              </div>
            </Box>
          </Placeholder>
          <Placeholder animation="wave" style={{ display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Placeholder className="skelton-button skeleton" />
              <Placeholder className="skelton-button skeleton" />
            </div>
            <div
              className="social-media-skeleton"
              style={{
                marginTop: "100px",
              }}
            >
              <Placeholder className="socials-skeleton skeleton" />
              <Placeholder className="socials-skeleton skeleton" />
              <Placeholder className="socials-skeleton skeleton" />
            </div>
          </Placeholder>
        </Col>
      </Row>
  );
};

export default ProfileLoader;

export const InfoLoader = () => {
  return (
    <Col lg="4">
      <Card className="cards-dark">
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
    </Col>
  );
};
