import React from "react";
import { Card } from "react-bootstrap";
import moment from "moment";
import PropTypes from "prop-types";

function Forecasts(props) {
  let weatherDate = moment().add(props.dayForward, "days");
  weatherDate = moment(weatherDate).format("DD. of MMMM");

  return (
    <Card style={{ width: "18rem" }} variant="success" className="card shadow p-3 rounded">
      <Card.Body>
        <Card.Title className="pb-3">
          {props.title} {weatherDate}
        </Card.Title>
        <div className="card-details">
          <div>
            <Card.Subtitle>{props.weatherType}</Card.Subtitle>
            <Card.Text className="">
              <span className="d-block">Temperature:</span> {props.minTemp}-{props.maxTemp}°C
            </Card.Text>
          </div>
          <img className="weatherImg" src={props.weatherImg} />
        </div>
      </Card.Body>
    </Card>
  );
}

Forecasts.propTypes = {
  dayForward: PropTypes.number,
  title: PropTypes.string,
  weatherType: PropTypes.string,
  minTemp: PropTypes.number,
  maxTemp: PropTypes.number,
};

export default Forecasts;
