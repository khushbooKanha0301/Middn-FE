import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  IconButton,
  Box,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearAllIcon from "@mui/icons-material/ClearAll";

const NotificationAccordion = () => {
  const [expanded, setExpanded] = useState(false);
  const [isChecked, setChecked] = useState(null);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const toggleCheckbox = (id) => {
    setChecked(isChecked === id ? null : id);
  };

  const notifications = [
    {
      label: "Login attempted from new IP",
      date: "2022-03-11 22:12:11",
      description:
        "The system has detected that your account is logged in from an unused IP address. Account: 81212008762 Device: unknown Time: 2022-03-11 15:12:11(UTC) IP: 180.242.97.49 If this activity is not your own operation, please disable your account and contact us immediately.",
    },
    {
      label: "Trade Success",
      date: "2022-03-12 10:05:00",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      label: "Trade Failed",
      date: "2022-03-13 09:22:15",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      label: "Login attempted from new IP",
      date: "2022-03-13 09:22:15",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      label: "Login attempted from new IP",
      date: "2022-03-13 09:22:15",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      label: "Login attempted from new IP",
      date: "2022-03-13 09:22:15",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ];

  return (
    <Box className="notification-accordion-inner">
      {notifications.map((notification, index) => (
        <Grid
          container
          key={index}
          sx={{
            padding: "15px 24px",
            gap: "22px",
            borderRadius: "24px",
            alignItems: { md: "center", xs: "flex-start" },
            background: "#18191D",
            color: "#fff",
            flexWrap: "nowrap",
            marginBottom: "16px",
          }}
        >
          <Grid item md={1} sx={{ maxWidth: "24px !important" }}>
            <div
              className="customCheckbox"
              onClick={() => toggleCheckbox(index)}
            >
              <div
                className={`check ${isChecked === index ? "checked" : ""}`}
              />
            </div>
          </Grid>
          <Grid item md={11} sx={{ width: "100%" }}>
            <Box>
              <Box
                sx={{
                  display: { lg: "flex", xs: "block" },
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    fontFamily: "eudoxus sans",
                    fontWeight: 600,
                  }}
                >
                  {notification.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#FFFFFF80",
                    fontFamily: "eudoxus sans",
                    fontWeight: 600,
                    marginTop: { lg: "0px", xs: "10px" },
                  }}
                >
                  {notification.date}
                </Typography>
              </Box>
              <Accordion
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  color: "#fff",
                  marginTop: "10px",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon style={{ color: "#ffffff" }} />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{
                    border:
                      expanded === `panel${index}`
                        ? "2px solid #4a90e2"
                        : "1px solid transparent",
                    borderRadius: "8px",
                    padding: "0",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      color: "#888888",
                      fontFamily: "eudoxus sans",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                    className={
                      expanded === `panel${index}`
                        ? "notification-expanded"
                        : "notification-collapsed"
                    }
                  >
                    {notification.description}
                  </Typography>
                </AccordionSummary>
              </Accordion>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default NotificationAccordion;
