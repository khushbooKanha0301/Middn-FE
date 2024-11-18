import { onValue, ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../../store/slices/AuthSlice";
import { notificationFail } from "../../store/slices/notificationSlice";

import { setIsChatPage } from "../../store/slices/chatSlice";
import { database } from "../../helper/config";
import { firebaseMessages } from "../../helper/configVariables";
import { setUnReadCountZero } from "../../helper/firebaseConfig";
import { firebaseStatus } from "../../helper/configVariables";
import jwtAxios from "../../service/jwtAxios";

export const UserList = (props) => {
  const { setLoader, setReciverId } = props;
  const dispatch = useDispatch();
  const [allusers, setAllUsers] = useState([]);
  const userData = useSelector(userDetails);
  const receiverData = useSelector((state) => state.chatReducer?.MessageUser);
  const [userLoginStatuses, setUserLoginStatuses] = useState([]);

  const getChatUser = (user) => {
    dispatch(setIsChatPage({ user: user, isChatOpen: true }));
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
        dispatch(setIsChatPage({ user: latestChanges[0], isChatOpen: true }));
      }
    }
  }, [receiverData?.wallet_address, allusers, setAllUsers]);

  useEffect(() => {
    setLoader(true);
    if (userData.authToken) {
      findFirebaseUserList();
    }
  }, [userData.authToken, receiverData?.wallet_address]);

  const getAllFirebaseUser = async (userIds) => {
    if (userIds) {
      const starCountRef = ref(database, firebaseMessages.CHAT_USERS);
      onValue(starCountRef, async (snapshot) => {
        if (snapshot && snapshot.val()) {
          let rootKey = Object.keys(snapshot.val())
            .filter(function (item) {
              return (
                item !== userData?.account &&
                userIds.find(function (ele) {
                  return ele.id === item;
                })
              );
            })
            .map((object) => {
              let finduser = userIds.find(function (ele) {
                return ele.id === object;
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
          getAllStatus(latestUser);
          setLoader(false);
        } else {
          setLoader(false);
        }
      });
    }
  };
  const getAllStatus = async (latestUser) => {
    if (latestUser) {
      const userStatusResults = await Promise.all(
        latestUser.map(async (user) => {
          const reqData = {
            report_from_user_address: userData?.account,
            report_to_user_address: user?.id,
          };
          try {
            const result = await jwtAxios.post(`/users/getUserStatus`, reqData);
            if (result?.data?.reportUser) {
              return result?.data?.reportUser?.userStatus;
            } else {
              dispatch(notificationFail("Something went wrong"));
              return null;
            }
          } catch (error) {
            console.error("Error fetching user status:", error);
            dispatch(notificationFail("Error fetching user status"));
            return null;
          }
        })
      );

      const updatedLatestUser = latestUser.map((user, index) => ({
        ...user,
        userStatus: userStatusResults[index] || false,
      }));

      setAllUsers(updatedLatestUser);

      let statuses = await Promise.all(
        latestUser.map(async (e) => {
          const starCount = ref(database, firebaseStatus.CHAT_USERS + e.id);
          const snapshot = await get(starCount);
          return snapshot.exists() ? snapshot.val()?.isOnline : 4;
        })
      );
      setUserLoginStatuses(statuses);
    }
  };
  const findFirebaseUserList = async () => {
    if (userData.authToken) {
      const starCountRef = ref(database, firebaseMessages.CHAT_ROOM);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.val()) {
          const userIds = Object.keys(snapshot.val())
            .filter((element) => {
              return element.includes(userData?.account);
            })
            .map((object) => {
              const name = userData?.account;
              const messages = snapshot.val()[object]?.messages;
              const msg = Object.values(messages)?.filter((o1) => {
                return (
                  o1.senderID === userData?.account || o1.userStatus === false
                );
              });
              const unreadCount = name
                ? snapshot.val()[object]?.unreadcount
                  ? snapshot.val()[object]?.unreadcount[name]
                  : 0
                : 0;

              const id = object
                .replace(userData?.account + "_", "")
                .replace("_" + userData?.account, "");
              let lstmsg = msg?.pop();
              let messageNode = messages[lstmsg?.sendTime];

              const lastUpdateAt = lstmsg?.sendTime;
              return {
                id: id,
                unreadCount: unreadCount,
                last_message:
                  messageNode && messageNode?.file
                    ? messageNode?.file?.name
                    : messageNode?.message
                    ? messageNode?.message
                    : "",
                lastUpdateAt: lastUpdateAt ? lastUpdateAt : 0,
              };
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
    <Col lg="4" className={` ${receiverData?.id ? "hide-mobile" : "show-mobile"}`}>
      <Card className="cards-dark">
        <Card.Body>
          <Card.Title as="h2">Messages</Card.Title>
          <ul className="chat-list alluser-chat">
            <PerfectScrollbar options={{ suppressScrollX: true }}>
              {allusers &&
                allusers?.map((user, index) => (
                  <li
                    key={index}
                    className={`${
                      user?.id === receiverData?.id ? "active" : "deactive"
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
                      {userLoginStatuses[index] === 0 && (
                        <div className="chat-status-offline"></div>
                      )}
                      {userLoginStatuses[index] === 1 && (
                        <div className="chat-status"></div>
                      )}
                      {userLoginStatuses[index] === 2 && (
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
                            (user?.last_message?.length > 50 ? "..." : "")}
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
              {/* {loader &&  */}
              <>
                {allusers.length == 0 && (
                  <li className="active no-message">No Messages yet</li>
                )}
              </>
              {/* } */}
            </PerfectScrollbar>
          </ul>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UserList;
