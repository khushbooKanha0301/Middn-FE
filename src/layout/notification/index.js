import React, { useRef, useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { userDetails, userGetFullDetails } from "../../store/slices/AuthSlice";
import { setUnReadCountZero } from "../../helper/firebaseConfigEscrow";
import { database } from "../../helper/config";
import { firebaseMessagesEscrow } from "../../helper/configEscrow";
import { setIsChatEscrowPage } from "../../store/slices/chatEscrowSlice";
import {
  Col,
  Row,
  Card,
  Nav,
  OverlayTrigger,
  Tooltip,
  Button,
  Accordion,
  Form,
} from "react-bootstrap";
import {
  CheckIcon,
  SimpleDotedIcon,
  SimpleTrashIcon,
  TrashIcon,
} from "../../component/SVGIcon";

export const AccountSetting = () => {
  const [loader, setLoader] = useState(false);
  const [ReciverId, setReciverId] = useState(null);
  const userRef = useRef(null);
  const receiverData = useSelector((state) => state.chatReducer?.MessageUser);
  const dispatch = useDispatch();
  const [allusers, setAllUsers] = useState([]);
  const userData = useSelector(userDetails);

  const getChatUser = (user) => {
    dispatch(setIsChatEscrowPage({ user: user, isChatOpen: true }));
    window.localStorage.setItem("user", user?.id);
    setReciverId(user?.id);
    if (userData?.account && user?.id) {
      setUnReadCountZero(userData?.account, user?.id);
    }
  };

  useEffect(() => {
    if (receiverData) {
      const latestChanges = allusers.filter(function (e) {
        return e.wallet_address === receiverData.wallet_address;
      });
      if (latestChanges) {
        dispatch(
          setIsChatEscrowPage({ user: latestChanges[0], isChatOpen: true })
        );
      }
    }
  }, [receiverData?.wallet_address, allusers, setAllUsers]);

  useEffect(() => {
    setLoader(true);
    if (userData.authToken) {
      findFirebaseUserList();
    }
  }, [userData.authToken]);

  const getAllFirebaseUser = (userIds) => {
    if (userIds) {
      const starCountRef = ref(database, firebaseMessagesEscrow.CHAT_USERS);
      onValue(starCountRef, (snapshot) => {
        if (snapshot && snapshot.val()) {
          
          let rootKey = Object.keys(snapshot.val())
            .filter(function (item) {
              return (
                item !== userData?.account &&
                userIds.find(function (ele) {
                  return ele.senderId === item;
                })
              );
            })
            .map((object) => {
              let finduser = userIds.find(function (ele) {
                return ele.senderId === object;
              });
              return {
                ...snapshot.val()[object],
                ...finduser,
              };
            });
          const latestUser = rootKey
            .sort(function (x, y) {
              return x.lastUpdateAt - y.lastUpdateAt;
            })
            .reverse();
          setAllUsers(latestUser);
 
          setLoader(false);
        } else {
          setLoader(false);
        }
      });
    }
  };

  const findFirebaseUserList = async () => {
    if (userData.authToken) {
      const starCountRef = ref(database, firebaseMessagesEscrow.CHAT_ROOM);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.val()) {
          const userIds = Object.keys(snapshot.val())
            .filter((element) => {
              return element.includes(userData?.account);
            })
            .map((object) => {
              let name = userData?.account;
              const senderId = object.split("_")[1];
              const ReciverId = object.split("_")[0];

              let messages = snapshot.val()[object]?.messages;
              let unreadCount = name
                ? snapshot.val()[object]?.unreadcount
                  ? snapshot.val()[object]?.unreadcount[name]
                  : 0
                : 0;

              let id = object
                .replace(userData?.account + "_", "")
                .replace("_" + userData?.account, "");
                console.log(id)

              let messageNode = messages[Object.keys(messages).pop()];
              let lastUpdateAt = Object.keys(messages).pop();

              if (senderId === name) {
                return {};
              } else if (ReciverId === name) {
                return {
                  id: id,
                  senderId: senderId,
                  ReciverId: ReciverId,
                  unreadCount: unreadCount,
                  last_message:
                    messageNode && messageNode.file
                      ? messageNode.file?.name
                      : messageNode.message
                      ? messageNode.message
                      : "",
                  lastUpdateAt: lastUpdateAt ? lastUpdateAt : 0,
                };
              }
            });

          if (userIds) {
            getAllFirebaseUser(userIds);
          }
        } else {
          setLoader(false);
        }
      });
    }
  };

  return (
    <div className="notification-view">
      <Row>
        <Col lg="3">
          <Card className="cards-dark mb-32">
            <Card.Body>
              <Card.Title as="h2">Notification</Card.Title>
              <Nav
                variant="tabs"
                defaultActiveKey="all"
                as="ul"
                className="flex-column"
              >
                <Nav.Item as="li">
                  <Nav.Link eventKey="all">
                    <span>All</span>
                    <span className="notification-count">0</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="activities">
                    <span>Activities</span>
                    <span className="notification-count">0</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="trade">
                    <span>Trade Notification</span>
                    <span className="notification-count">0</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="system">
                    <span>System Messages</span>
                    <span className="notification-count">0</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col lg="9">
          <div className="notification-list">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Notification</h2>
              <div className="btn-action-group" ref={userRef}>
                <OverlayTrigger
                  placement="top"
                  container={userRef}
                  overlay={
                    <Tooltip id="tooltip-check">Mark all as read</Tooltip>
                  }
                >
                  <Button variant="dark">
                    <CheckIcon width="25" height="18" />
                  </Button>
                </OverlayTrigger>
                <Button variant="dark">
                  <TrashIcon width="35" height="35" />
                </Button>
                <OverlayTrigger
                  placement="bottom right"
                  container={userRef}
                  overlay={
                    <Tooltip id="tooltip-more">
                      <SimpleTrashIcon width="20" height="20" /> Clear all
                    </Tooltip>
                  }
                >
                  <Button variant="dark">
                    <SimpleDotedIcon width="25" height="4" />
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
            <Accordion defaultActiveKey="0">
              <PerfectScrollbar options={{ suppressScrollX: true }}>
                <Accordion.Item eventKey="0">
                  <div className="accordion-body">
                    <div className="accordion-title">
                      <h5>No Notification yet</h5>
                      <div className="notification-time"></div>
                    </div>
                    <span className="accordion-text no-notification">
                      There's no notification yet
                    </span>
                  </div>
                </Accordion.Item>
              </PerfectScrollbar>
            </Accordion>
          </div>

          <div className={`${receiverData !== null ? "hide-mobile" : ""}`}>
            <Card className="cards-dark messageEscrow">
              <Card.Body>
                <Card.Title as="h2"> Escrow Messages</Card.Title>
                <ul className="chat-list alluser-chat">
                  <PerfectScrollbar options={{ suppressScrollX: true }}>
                    {allusers &&
                      allusers?.map((user, index) => (
                        <li
                          key={index}
                          className={`active
                          }${user?.unreadCount > 0 ? "unreaded-msg" : ""}`}
                          onClick={() => getChatUser(user)}
                        >
                          <div className="chat-image">
                            <img
                              src={
                                user?.imageUrl
                                  ? user?.imageUrl
                                  : require("../../content/images/avatar.png")
                              }
                              alt={user?.fname_alias}
                            />
                            {(user?.isOnline === 0 ||
                              user?.isOnline === false) && (
                              <div className="chat-status-offline"></div>
                            )}
                            {(user?.isOnline === 1 ||
                              user?.isOnline === true) && (
                              <div className="chat-status"></div>
                            )}
                            {user?.isOnline === 2 && (
                              <div className="chat-status-absent"></div>
                            )}
                          </div>

                          <div>
                            <div>
                              <div className="chat-name">
                                {user?.fname_alias ? user?.fname_alias : null}{" "}
                                {user?.lname_alias ? user?.lname_alias : null}
                              </div>
                            </div>

                            <div>
                              <p>
                                {user?.last_message?.slice(0, 50) +
                                  (user?.last_message?.length > 50
                                    ? "..."
                                    : "")}
                              </p>
                            </div>
                          </div>
                          {user?.unreadCount > 0 && (
                            <span className="notification-badge-chat">
                              {user?.unreadCount}
                            </span>
                          )}
                        </li>
                      ))}
                    {allusers.length == 0 && (
                      <li className="active no-message">No Messages yet</li>
                    )}
                  </PerfectScrollbar>
                </ul>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AccountSetting;
