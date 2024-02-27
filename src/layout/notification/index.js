import React, { useRef, useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Card, Nav, OverlayTrigger, Tooltip, Button, Accordion, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userDetails } from "../../store/slices/AuthSlice";
import { database } from "../../helper/config";
import { firebaseMessagesEscrow } from "../../helper/configEscrow";
import { setIsChatEscrowPage } from "../../store/slices/chatEscrowSlice";
import { CheckIcon, SimpleDotedIcon, SimpleTrashIcon, TrashIcon } from "../../component/SVGIcon";

export const AccountSetting = () => {
  const userRef = useRef(null);
  const receiverData = useSelector((state) => state.chatReducer?.MessageUser);
  const dispatch = useDispatch();
  const [allusers, setAllUsers] = useState([]);
  const userData = useSelector(userDetails);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  const getChatUser = (user) => {
    // navigate(`/escrow/${user.escrowId}`);
    navigate(`/escrow/${user.escrowId}`, { state: { userAddress: user.senderId, escrow_id: user.escrowId } });
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
  }, [dispatch , receiverData, allusers, setAllUsers]);

  useEffect(() => {
    if (userData.authToken) {
      findFirebaseUserList();
      findFirebaseUserListNotification()
    }
  }, [userData.authToken]);

  const getAllFirebaseUser = (userIds) => {
    if (userIds) {
      const starCountRef = ref(database, firebaseMessagesEscrow.CHAT_USERS);
      onValue(starCountRef, (snapshot) => {
        if (snapshot && snapshot.val()) {
          let rootKey = userIds.filter(function (ele) {
              return (
                ele.senderId !== userData?.account &&
                Object.keys(snapshot.val())
                .filter(function (item) {
                  return ele.senderId === item;
                })
                .map((object) => {
                  let finduser =  userIds.find(function (ele) {
                    return ele.senderId === object;
                  });
                  return {
                    ...snapshot.val()[object],
                    ...finduser,
                  };
                })
              )
           })
          
          const latestUser = rootKey
            .sort(function (x, y) {
              return x.lastUpdateAt - y.lastUpdateAt;
            })
            .reverse();
          setAllUsers(latestUser);
        }
        return
      });
    }
  };

  const findFirebaseUserList = async () => {
    if (userData.authToken) {
      const starCountRef = ref(database, firebaseMessagesEscrow.CHAT_ROOM);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.val()) {
          const userIds = Object.values(snapshot.val())
          .flatMap((e) => {
            return Object.keys(e).map((object) => {
              const senderId = object.split("_")[1];
              const ReciverId = object.split("_")[0];
              const name = userData?.account;
              const messages = e[object]?.messages;
              const unreadCount = name
                ? e[object]?.unreadcount
                  ? e[object]?.unreadcount[name]
                  : 0
                : 0;

              const id = object.replace(userData?.account + "_", "")
                .replace("_" + userData?.account, "");

              let messageNode = messages[Object.keys(messages).pop()];
              let lastUpdateAt = Object.keys(messages).pop();

              if (ReciverId === name) {
                return {
                  id: id,
                  senderId: senderId,
                  ReciverId: ReciverId,
                  escrowId: messageNode.escrowId,
                  unreadCount: unreadCount,
                  last_message:
                    messageNode && messageNode.file
                      ? messageNode.file?.name
                      : messageNode.message
                      ? messageNode.message
                      : "",
                  lastUpdateAt: lastUpdateAt ? lastUpdateAt : 0,
                };
              } else {
                return null; // Return null for elements that don't meet the condition
              }
            });
          })
          .filter((user) => user !== null);

          if (userIds) {
            getAllFirebaseUser(userIds);
          }
        } 
        return
      });
    }
  };

  const findFirebaseUserListNotification = async () => {
    if (userData?.authToken) {
      const starCountRef = ref(database, firebaseMessagesEscrow.CHAT_ROOM);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.val()) {
          const unreadCount = Object.values(snapshot.val())
          .filter((e) => {
            return Object.keys(e).some((element) => {
              const ReciverId = element.split("_")[0];
              const name = userData?.account;
              return ReciverId === name && e[element]?.unreadcount && e[element]?.unreadcount[name] > 0;
            });
          });
          
          setNotificationCount(unreadCount.length);
        }
      });
    }
  };
  

  return (
    <div className="notification-view">
      <Tab.Container id="help-center-tabs" defaultActiveKey="create">
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
                    <Nav.Link eventKey="escrowmsg">
                      <span>Escrow Messages</span>
                      {notificationCount > 0 ? (
                        <span className="notification-badge">{notificationCount}</span>
                      ) : ( <span className="notification-count">0</span>)}
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
            <Tab.Content>
              <Tab.Pane eventKey="create">
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
              </Tab.Pane>
              <Tab.Pane eventKey="escrowmsg">
                <div
                  className={`${receiverData !== null ? "hide-mobile" : ""}`}
                >
                  <Card className="cards-dark messageEscrow">
                    <Card.Body>
                      <Card.Title as="h2">Escrow Messages</Card.Title>
                      <ul className="chat-list alluser-chat">
                        <PerfectScrollbar options={{ suppressScrollX: true }}>
                          {allusers &&
                            allusers?.map((user, index) => (
                              <li
                                key={index}
                                className={`active}${user?.unreadCount > 0 ? "unreaded-msg" : ""}`}
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
                                  
                                  {(user?.isOnline === 1 ||
                                    user?.isOnline === true) && (
                                    <div className="chat-status"></div>
                                  )}
                                  {user?.isOnline === 2 && (
                                    <div className="chat-status-absent"></div>
                                  )}
                                  {(user?.isOnline === 3 ||
                                    user?.isOnline === false) && (
                                    <div className="chat-status-offline"></div>
                                  )}
                                </div>

                                <div>
                                  <div>
                                    <div className="chat-name">
                                      {user?.fname_alias
                                        ? user?.fname_alias
                                        : null}{" "}
                                      {user?.lname_alias
                                        ? user?.lname_alias
                                        : null}
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
                          {allusers.length === 0 && (
                            <li className="active no-message">
                              No Messages yet
                            </li>
                          )}
                        </PerfectScrollbar>
                      </ul>
                    </Card.Body>
                  </Card>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="escrowmsg1"></Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default AccountSetting;
