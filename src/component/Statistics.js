import React, {  useState, useEffect, useRef } from "react";
import { Card, Col, Form, Row, ProgressBar } from "react-bootstrap";
import StatisticsChart from "./StatisticsChart";
import ThisMonth from "./ThisMonth";

export const Statistics = () => {
  const categories = [{ value: '1', label: 'January 2022' }, 
  { value: '2', label: 'March 2022' },
  { value: '3', label: 'April 2022' }];
  const [showOptions, setShowOptions] = useState(false);
  const [category, setCategory] = useState("February 2022");
  const locationDropdownRef = useRef(null);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleSelectedClick = (value) => {
    setCategory(value);
    setShowOptions(false);
  };

  const handleGlobalClick = (event) => {
    // Close dropdowns if the click is outside of them
    if (
      locationDropdownRef.current &&
      !locationDropdownRef.current.contains(event.target)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    // Add global click event listener
    document.addEventListener('click', handleGlobalClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);
  
  return (
    <Card className="cards-dark statistics statisticsGraphs">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title as="h3" className="font-family-poppins">Statistics</Card.Title>
          {/* <Form.Select aria-label="February 2022">
            <option>February 2022</option>
            <option value="1">January 2022</option>
            <option value="2">March 2022</option>
            <option value="3">April 2022</option>
          </Form.Select> */}

          <div className="statisticBox" ref={locationDropdownRef}>
            <div
                className="form-select"
                onClick={toggleOptions}
                aria-label="February 2022"
              >
                {categories.find(
                  (cat) => cat.value === category
                )?.label || "February 2022"}
            </div>
            {showOptions && (
              <ul className="options">
                {categories.map((category) => (
                  <li
                    key={category.value}
                    onClick={() => handleSelectedClick(category.value)}
                  >
                    {category.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
        <div className="transaction-view">
          <div className="transaction">
            <div className="transaction-wrapper">
              <div className="transaction-number">0</div>
              <div className="transaction-label font-family-inter">Total Transaction</div>
            </div>
            <div className="divider"></div>
            <div className="transaction-wrapper">
              <ThisMonth />
            </div>
          </div>
          <div className="transaction-chart">
            <StatisticsChart />
          </div>
        </div>
        <div className="charts-details">
          <Row  className="g-0">
            <Col>
              <div className="chart-item">
                <div className="item-label">
                  <img
                    src={require('../content/images/bitcoin.png')}
                    alt="Bitcoin"
                  />{" "}
                  Bitcoin
                </div>
                <div className="item-count">0</div>
                <ProgressBar className="bitcoin" now={5} />
              </div>
            </Col>
            <Col>
              <div className="chart-item">
                <div className="item-label">
                  <img
                    src={require('../content/images/ether.png')}
                    alt="ether"
                  />{" "}
                  ETHER
                </div>
                <div className="item-count">0</div>
                <ProgressBar className="ether" now={5} />
              </div>
            </Col>
            <Col>
              <div className="chart-item">
                <div className="item-label">
                  <img src={require('../content/images/bnb.png')} alt="BNB" />{" "}
                  BNB
                </div>
                <div className="item-count">0</div>
                <ProgressBar className="bnb" now={5} />
              </div>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Statistics;
