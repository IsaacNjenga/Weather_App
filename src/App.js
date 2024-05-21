import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    celcius: "",
    name: "",
    humidity: "",
    speed: "",
    image: "",
    description: "",
    country: "",
  });

  const [name, setName] = useState("");
  const [error, setError] = useState("");

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
        console.log(res.data);
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

  const handleClick = () => {
    if (name !== "") {
      setLoading(true);
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;
      axios
        .get(apiUrl)
        .then((res) => {
          let imagePath = "";
          if (res.data.weather[0].main === "Clouds") {
            imagePath = (
              <i className="material-icons" style={{ fontSize: "90px",color: "grey" }}>
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
              <i
                className="material-icons"
                style={{ fontSize: "90px", color: "blue" }}
              >
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
            description: res.data.weather[0].description.toUpperCase(),
            country: res.data.sys.country,
          });
          setLoading(false);
          setError("");
        })
        .catch((err) => {
          setLoading(false);
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
            <p>{data.image}</p>
            <h3>{data.description}</h3>
            <h1>{Math.round(data.celcius)}°c</h1>
            <h2>
              {data.name}, {data.country}
            </h2>
            <div className="details">
              <div className="col">
                <i className="material-icons" style={{ fontSize: "55px",color: 'rgb(5, 135, 200)'}}>
                  water_drop
                </i>
                <div className="humidity">
                  <p>{data.humidity}%</p>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="col">
                <i className="material-icons" style={{ fontSize: "55px", color:"white" }}>
                  water
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
