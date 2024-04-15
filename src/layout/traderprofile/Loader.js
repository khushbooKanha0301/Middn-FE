import { Box } from "@mui/material";
import React from "react";
import { Col, Row, Placeholder, Card } from "react-bootstrap";

export const ProfileLoader = () => {
  return (
    <>
    <div class="loader-profile">
      <Row className="g-0">
        <Col xs="2" style={{ maxWidth: "100px", width: "100%" }}>
          <Placeholder as="div" animation="wave" className="profile-loader">
            <Placeholder xs="6" className="profile-img-placeholder skeleton" />
          </Placeholder>
        </Col>
        <Col >
          <Box className="profiles">
            <Placeholder className="profile-title skeleton" />
              <div
                className="profile-name"
              >
                <Placeholder className="profile-subtitle1 skeleton" />
                {/* <Placeholder className="profile-subtitle2 skeleton" /> */}
              </div>
          </Box>
        </Col>
      </Row>
      <Row className="g-0">
        <Col >
          <Placeholder animation="wave" style={{display: "block"}}>
            <div className="skeleton-profile-btn">
              <Placeholder className="skelton-btn skelton-button skeleton" />
              <Placeholder className="skelton-btn skeleton-button-left skeleton" />
            </div>
            <div
              className="social-media-skeleton"
            >
              <Placeholder className="socials-skeleton skeleton" />
              <Placeholder className="socials-skeleton skeleton" />
              <Placeholder className="socials-skeleton skeleton" />
            </div>
          </Placeholder>
        </Col>
      </Row>
    </div>  
    </>
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
