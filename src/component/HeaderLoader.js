import React from "react";
import { NavDropdown } from "react-bootstrap";
import { userDetails } from "../store/slices/AuthSlice";
import { useSelector } from "react-redux";

//Skeleton design for header
export const HeaderLoader = () => {
  const acAddress = useSelector(userDetails);
  return (
    <>
      {acAddress && acAddress?.authToken && (
        <NavDropdown
          as="li"
          title={
            <img
              className="rounded-circle"
              style={{ width: "48px", height: "48px" }}
              src={require("../content/images/avatar.png")}
              alt="No Profile"
            />
          }
          id="nav-dropdown"
        ></NavDropdown>
      )}
    </>
  );
};
