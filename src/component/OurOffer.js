import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { NotePencilIcon, EscrowIcon, ChartLineUpIcon } from './SVGIcon'
import CreateEscrowView from '../layout/escrow/CreateEscrow';
import { userDetails } from "../store/slices/AuthSlice";
import { useSelector } from "react-redux";
import LoginView from "../component/Login";

export const OurOffer = () => {
    const [createEscrowModalShow, setCreateEscrowModalShow] = useState(false);
    const acAddress = useSelector(userDetails);
    const [modalShow, setModalShow] = useState(false);
    const modalToggle = () => setModalShow(!modalShow);
    const [isSign, setIsSign] = useState(null);
    const createEscrowModalToggle = () => {
        if(acAddress.authToken) {
        setCreateEscrowModalShow(!createEscrowModalShow);
        } else {
          setModalShow(true);
        }
    }

    const handleAccountAddress = (address) => {
        setIsSign(false);
      };


    return (
        <div className="our-offer">
            <Row>
                <Col md="4">
                    <Card className="cards-dark">
                        <Card.Body>
                            <div className="icon-bg">
                                <NotePencilIcon width="30" height="30" />
                            </div>
                            <Card.Title as="h5">Create offer</Card.Title>
                            <Card.Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Card.Text>
                            <Button variant="primary" onClick={createEscrowModalToggle}>Create Escrow</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="cards-dark">
                        <Card.Body>
                            <div className="icon-bg">
                                <EscrowIcon width="30" height="30" />
                            </div>
                            <Card.Title as="h5">Share Offer</Card.Title>
                            <Card.Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Card.Text>
                            <Button variant="primary" onClick={createEscrowModalToggle}>Create Escrow</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="cards-dark">
                        <Card.Body>
                            <div className="icon-bg">
                                <ChartLineUpIcon width="30" height="30" />
                            </div>
                            <Card.Title as="h5">Increase your stats</Card.Title>
                            <Card.Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Card.Text>
                            <Button variant="primary" onClick={createEscrowModalToggle}>Create Escrow</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <CreateEscrowView
                show={createEscrowModalShow}
                onHide={() => setCreateEscrowModalShow(false)}
            />
            {modalShow && (
                <LoginView
                show={modalShow}
                onHide={() => setModalShow(false)}
                handleaccountaddress={handleAccountAddress}
                isSign={isSign}
            />
            )}
        </div>
    );
}

export default OurOffer;
