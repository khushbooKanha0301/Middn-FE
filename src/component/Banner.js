import React from "react";
import { Card, Button } from "react-bootstrap";

export const Banner = () => {
  
  const cardTitle = "Time to build your reputation";
  const cardText = `Customize your profile and start sharing it. We secure the rest, your customers will love it.`;

  return (
    <Card className="cards-dark banner">
      <Card.Body>
        <div className="banner-contain">
          {cardTitle && <Button variant="primary">Middn App</Button>}
          <Card.Title as="h1">{cardTitle}</Card.Title>
          <Card.Text>{cardText}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Banner;

