import { React, useState, useEffect } from "react";
import { apiUrl } from "../../constants/api";
import Heading from "../Heading";
import Forecasts from "./Forecasts";
import { Container, Row } from "react-bootstrap";

import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  city: yup
    .string()
    .required("Please enter a city")
    .matches(/^[aA-zZ\s]+$/, "Only letters A-Z are allowed"),
});

function Home() {
  const [forecast, setForecast] = useState([]);
  const [region, setRegion] = useState("Oslo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function fetchData(city) {
    let url = apiUrl + city;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.region) {
          const dataForecast = data.next_days;
          setForecast(dataForecast);
          setRegion(data.region);
        } else {
          setRegion("Didn't find in our database, please try again");
        }
      } else {
        setError("An error occured");
      }
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }
  function onSubmit(data) {
    fetchData(data.city);
  }
  useEffect(() => {
    fetchData(region);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="loading">Loading...</div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <div className="error-api">ERROR: {error}</div>
      </Container>
    );
  }

  let key = 0;
  let dayForward = 0;
  return (
    <Container>
      <Heading title="Weather Forecast" />
      <div>
        <h2>{region}</h2>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="form__search-city d-inline-flex">
          <Form.Group className="mb-3">
            <Form.Control {...register("city")} type="text" placeholder="City" className="me-2" />
            {errors.city && <span className="error-input">{errors.city.message}</span>}
          </Form.Group>
          <Button variant="primary" className="h-50" type="submit">
            Search
          </Button>
        </div>
      </Form>
      <Row className="forecast-container m-auto">
        {forecast.map(function (forecastDay) {
          return <Forecasts region={region} key={key++} title={forecastDay.day} weatherImg={forecastDay.iconURL} weatherType={forecastDay.comment} dayForward={dayForward++} minTemp={forecastDay.min_temp.c} maxTemp={forecastDay.max_temp.c} />;
        })}
      </Row>
    </Container>
  );
}

export default Home;
