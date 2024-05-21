import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  let [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [data, setData] = useState({
    celcius: "",
    name: "",
    humidity: "",
    speed: "",
    image: "",
    description: "",
    country: "",
  });
  const [data2, setData2] = useState([]);

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("en-UK", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  //data
  useEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Nairobi&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;
    axios
      .get(apiUrl)
      .then((res) => {
        let imagePath = "";
        if (res.data.weather[0].main === "Clouds") {
          imagePath = (
            <i className="material-icons" style={{ fontSize: "90px" }}>
              cloud
            </i>
          );
        } else if (res.data.weather[0].main === "Clear") {
          imagePath = (
            <i
              className="material-icons"
              style={{ fontSize: "90px", color: "yellow" }}
            >
              sunny
            </i>
          );
        } else if (res.data.weather[0].main === "Rain") {
          imagePath = (
            <i className="material-icons" style={{ fontSize: "90px" }}>
              cloud
            </i>
          );
        } else if (res.data.weather[0].main === "Drizzle") {
          imagePath = (
            <i className="material-icons" style={{ fontSize: "90px" }}>
              cloud
            </i>
          );
        } else if (res.data.weather[0].main === "Mist") {
          imagePath = (
            <i className="material-icons" style={{ fontSize: "90px" }}>
              cloud
            </i>
          );
        }
        setData({
          ...data,
          celcius: res.data.main.temp,
          name: res.data.name,
          humidity: res.data.main.humidity,
          speed: res.data.wind.speed,
          image: imagePath,
          description: res.data.weather[0].description,
          country: res.data.sys.country,
        });
        setError("");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setError("Invalid city name! Try again");
        } else {
          setError("");
        }
        console.log(err);
      });
  }, []);

  //data2
  useEffect(() => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=nairobi&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;
    axios
      .get(apiUrl)
      .then((res) => {
        let imagePath = "";
        if (res.data.list[4].weather[0].main === "Clouds") {
          imagePath = (
            <i className="material-icons" style={{ fontSize: "90px" }}>
              cloud
            </i>
          );
        } else if (res.data.list[4].weather[0].main === "Clear") {
          imagePath = (
            <i
              className="material-icons"
              style={{ fontSize: "90px", color: "yellow" }}
            >
              sunny
            </i>
          );
        } else if (res.data.list[4].weather[0].main === "Rain") {
          imagePath = (
            <i className="material-icons" style={{ fontSize: "90px" }}>
              cloud
            </i>
          );
        } else if (res.data.list[4].weather[0].main === "Drizzle") {
          imagePath = (
            <i className="material-icons" style={{ fontSize: "90px" }}>
              cloud
            </i>
          );
        } else if (res.data.list[4].weather[0].main === "Mist") {
          imagePath = (
            <i className="material-icons" style={{ fontSize: "90px" }}>
              cloud
            </i>
          );
        }
        const forecastData = res.data.list.slice(0, 8);
        setData2(
          forecastData.map((forecast) => {
            const dateString = forecast.dt_txt;
            const convertToDate = new Date(dateString);
            const options = {
              year: "numeric",
              month: "short",
              day: "numeric",
              weekday: "short",
            };

            const optionsTime = {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            };
            const formattedDateString = new Intl.DateTimeFormat(
              "en-GB",
              options
            ).format(convertToDate);
            const formattedTimeString = new Intl.DateTimeFormat(
              "en-GB",
              optionsTime
            ).format(convertToDate);
            return {
              ...data2,
              celcius: forecast.main.temp,
              name: res.data.city.name,
              humidity: forecast.main.humidity,
              speed: forecast.wind.speed,
              image: imagePath,
              description: forecast.weather[0].description,
              country: res.data.city.country,
              date: formattedDateString,
              time: formattedTimeString,
            };
          })
        );

        setError("");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setError("Invalid city name! Try again");
        } else {
          setError("");
        }
        console.log(err);
      });
  }, []);

  const handleClick = () => {
    if (name !== "") {
      setLoading(true);
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;
      const apiForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;

      Promise.all([axios.get(apiUrl), axios.get(apiForecast)])
        .then(([currentWeatherResponse, forecastWeatherResponse]) => {
          const currentResponse = currentWeatherResponse.data;
          let imagePath = "";
          if (currentResponse.weather[0].main === "Clouds") {
            imagePath = (
              <i
                className="material-icons"
                style={{ fontSize: "90px", color: "grey" }}
              >
                cloud
              </i>
            );
          } else if (currentResponse.weather[0].main === "Clear") {
            imagePath = (
              <i
                className="material-icons"
                style={{ fontSize: "90px", color: "yellow" }}
              >
                sunny
              </i>
            );
          } else if (currentResponse.weather[0].main === "Rain") {
            imagePath = (
              <i
                className="material-icons"
                style={{ fontSize: "90px", color: "blue" }}
              >
                cloud
              </i>
            );
          } else if (currentResponse.weather[0].main === "Drizzle") {
            imagePath = (
              <i className="material-icons" style={{ fontSize: "90px" }}>
                cloud
              </i>
            );
          } else if (currentResponse.weather[0].main === "Mist") {
            imagePath = (
              <i className="material-icons" style={{ fontSize: "90px" }}>
                cloud
              </i>
            );
          }
          setData({
            celcius: currentResponse.main.temp,
            name: currentResponse.name,
            humidity: currentResponse.main.humidity,
            speed: currentResponse.wind.speed,
            image: imagePath,
            description: currentResponse.weather[0].description,
            country: currentResponse.sys.country,
          });

          const forecastData = forecastWeatherResponse.data.list.slice(0, 8);
          const processedForecastData = forecastData.map((forecast) => {
            const dateString = forecast.dt_txt;
            const convertToDate = new Date(dateString);
            const options = {
              year: "numeric",
              month: "short",
              day: "numeric",
              weekday: "short",
            };

            const optionsTime = {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            };
            const formattedDateString = new Intl.DateTimeFormat(
              "en-GB",
              options
            ).format(convertToDate);
            const formattedTimeString = new Intl.DateTimeFormat(
              "en-GB",
              optionsTime
            ).format(convertToDate);
            return {
              celcius: forecast.main.temp,
              name: forecastWeatherResponse.data.city.name,
              humidity: forecast.main.humidity,
              speed: forecast.wind.speed,
              image: imagePath,
              description: forecast.weather[0].description,
              country: forecastWeatherResponse.data.city.country,
              date: formattedDateString,
              time: formattedTimeString,
            };
          });
          setData2(processedForecastData);
          setLoading(false);
          setError("");
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setError("Invalid city name! Try again");
          } else {
            setError("");
          }
          console.log(err);
        });
    }
  };

  return (
    <div className="container2">
      <div className="weather">
        <div className="search">
          <input
            type="text"
            placeholder="Enter City name"
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleClick}>
            <i className="material-icons">search</i>
          </button>
        </div>
        <div className="error">
          <p>{error}</p>
        </div>
        {!error && (
          <div className="winfo">
            <img src={data.image} alt="" className="icon" />
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
            <p>{data.image}</p>
            <h3>{data.description}</h3>
            <h1>{Math.round(data.celcius)}°c</h1>
            <h2>
              {data.name}, {data.country}
            </h2>
            <hr />
            {/* Forecast */}
            <div className="forecast-container">
              {data2.map((forecast, index) => (
                <div className="mini-weather" key={index}>
                  <div className="forecasted">
                    <div>
                      <p>{forecast.time}</p>
                      <p>{forecast.image}</p>
                      <p>{forecast.description}</p>
                      <p>{forecast.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="details">
              <div className="col">
                <i
                  className="material-icons"
                  style={{ fontSize: "55px", color: "rgb(5, 135, 200)" }}
                >
                  water_drop
                </i>
                <div className="humidity">
                  <p>{data.humidity}%</p>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="col">
                <i
                  className="material-icons"
                  style={{ fontSize: "55px", color: "white" }}
                >
                  air
                </i>
                <div className="wind">
                  <p>{Math.round(data.speed)}Km/h</p>
                  <p>Wind Speed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
     
      {loading && (
        <div className="loader">
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
          <div className="loader__circle"></div>
        </div>
      )}
    </div>
  );
}

export default App;
//sunny
/*
 <div>
        <div className="container">
          <div className="cloud front">
            <span className="left-front"></span>
            <span className="right-front"></span>
          </div>
          <span className="sun sunshine"></span>
          <span className="sun"></span>
          <div className="cloud back">
            <span className="left-back"></span>
            <span className="right-back"></span>
          </div>
        </div>
      </div>*/
