import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
// import { Escrows } from "./Escrows";
import { DotedIcon } from "./SVGIcon";
import { PlusIcon } from "./SVGIcon";
import CreateEscrowView from "../layout/escrow/CreateEscrow";
import { userDetails } from "../store/slices/AuthSlice";
import { useSelector } from "react-redux";
import LoginView from "../component/Login";
import jwtAxios from "../service/jwtAxios";
import { database } from "../helper/config";
import { firebaseStatus } from "../helper/statusManage";
import { get, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
let divSize = 0;

function getWidth() {
  let width = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
  if (width > 1200) {
    width = 1440;
  }
  return width;
}

function getCount(width) {
  let userDisplayCalChange = 6;

  if (width > 1300 && width <= 1500) {
    userDisplayCalChange = 7;
  } else if (width > 701 && width <= 1299) {
    userDisplayCalChange = 5;
  } else if (width > 550 && width <= 700) {
    userDisplayCalChange = 3;
  } else if (width > 400 && width <= 500) {
    userDisplayCalChange = 2;
  }

  return userDisplayCalChange;
}

export const LatestsEscrows = () => {
  const navigate = useNavigate();
  let width = getWidth();
  let userDisplayCal = getCount(width);
  const [userDisplayCount, setDisplayCount] = useState(userDisplayCal);
  const [createEscrowModalShow, setCreateEscrowModalShow] = useState(false);
  const acAddress = useSelector(userDetails);
  const [modalShow, setModalShow] = useState(false);
  const modalToggle = () => setModalShow(!modalShow);
  const [isSign, setIsSign] = useState(null);
  const [escrows, setEscrow] = useState([]);
  const [userStatuses, setUserStatuses] = useState([]);

  const [userList, setUserList] = useState(
    escrows?.filter((item, index) => index < userDisplayCount)
  );

  useEffect(() => {
    setUserList(escrows.slice(0, userDisplayCal));
  }, [escrows]); 
  

  const loadMoreData = () => {
    setUserList(prevUserList => [...prevUserList, ...escrows.slice(prevUserList.length)]);
  };

  const getAllEscrow = async () => {
    try {
      setUserStatuses([]);
      let res;
      if (acAddress.authToken) {
        res = await jwtAxios.get(
          `/escrows/getAllOpenEscrows/${acAddress?.account}`
        );
        setEscrow(res.data?.data);
        let statuses = await Promise.all(
          res.data?.data.map(async (e) => {
            const starCountRef = ref(
              database,
              firebaseStatus.CHAT_USERS + e.trade_address
            );
            const snapshot = await get(starCountRef);
            return snapshot.exists() ? snapshot.val()?.isOnline : 4;
          })
        );
        setUserStatuses(statuses);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllEscrow();
  }, [acAddress]);

  const createEscrowModalToggle = () => {
    if (acAddress.authToken) {
      setCreateEscrowModalShow(!createEscrowModalShow);
    } else {
      setModalShow(true);
    }
  };

  const handleAccountAddress = (address) => {
    setIsSign(false);
  };

  const openEscrow = (e) => {
    navigate(`/escrow/${e._id}`);
  };

  return (
    <>
      <Card className="cards-dark latests-escrows">
        <Card.Body className="no-escrows">
          <Card.Title as="h2" className="font-family-poppins">
            Your Latests Escrows
          </Card.Title>
          <Row>
            <Col className="col-auto">
              <Box sx={{ overflowX: "auto" }}>
                <Box sx={{ width: "max-content" }}>
                  {acAddress?.authToken && (
                    <>
                      {userList.map((item, index) => (
                        <Button
                          variant="link"
                          className="dashboard-escrows"
                          onClick={() => openEscrow(item)}
                        >
                          <img
                            src={
                              item?.newImage
                                ? item?.newImage
                                : require("../content/images/avatar.png")
                            }
                            alt={require("../content/images/avatar.png")}
                          />
                          {userStatuses[index] === 1 && (
                            <div className="chat-status"></div>
                          )}
                          {userStatuses[index] === 2 && (
                            <div className="chat-status-absent"></div>
                          )}
                          {userStatuses[index] === 3 && (
                            <div className="chat-status-offline"></div>
                          )}
                          <p className="escrow-name">
                            {item.user_name ? item.user_name : "John Doe"}
                          </p>
                        </Button>
                      ))}

                      {escrows.length === userList.length ? (
                        <Button
                          variant="link"
                          onClick={createEscrowModalToggle}
                        >
                          <span className="see-more ms-0">
                            <PlusIcon width="34" height="26" />
                          </span>
                          <span className="create-escrow-text">
                            Create Escrow
                          </span>
                        </Button>
                      ) : (
                        <Button variant="link" onClick={loadMoreData}>
                          <span className="see-more">
                            <DotedIcon width="34" height="26" />
                          </span>
                          See more
                        </Button>
                      )}
                    </>
                  )}
                  {!acAddress?.authToken && (
                    <>
                      <Button variant="link" onClick={createEscrowModalToggle}>
                        <span className="see-more ms-0">
                          <PlusIcon width="34" height="26" />
                        </span>
                        <span className="create-escrow-text">
                          Create Escrow
                        </span>
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {modalShow && (
        <LoginView
          show={modalShow}
          onHide={() => setModalShow(false)}
          handleaccountaddress={handleAccountAddress}
          isSign={isSign}
        />
      )}
      <CreateEscrowView
        show={createEscrowModalShow}
        onHide={() => setCreateEscrowModalShow(false)}
      />
    </>
  );
};

export default LatestsEscrows;
