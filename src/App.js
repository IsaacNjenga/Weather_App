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
    image: null,
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

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = tomorrow.toLocaleDateString("en-UK", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getWeatherDisplay = (weatherMain) => {
    switch (weatherMain) {
      case "Clear":
        return (
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
          </div>
        );
      case "Clouds":
        return (
          <i className="material-icons" style={{ fontSize: "90px" }}>
            cloud
          </i>
        );
      case "Rain":
        return (
          <div className="wrapper">
            <div className="cloud">
              <div className="cloud_left"></div>
              <div className="cloud_right"></div>
            </div>
            <div className="rain">
              <div className="drop"></div>
              <div className="drop"></div>
              <div className="drop"></div>
              <div className="drop"></div>
              <div className="drop"></div>
            </div>
            <div className="surface">
              <div className="hit"></div>
              <div className="hit"></div>
              <div className="hit"></div>
              <div className="hit"></div>
              <div className="hit"></div>
            </div>
          </div>
        );
      case "Drizzle":
      case "Mist":
        return (
          <i className="material-icons" style={{ fontSize: "90px" }}>
            cloud
          </i>
        );
      default:
        return <div>No specific display</div>;
    }
  };

  //data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Nairobi&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;
        const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?q=nairobi&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;

        const [response, response2] = await Promise.all([
          axios.get(apiUrl),
          axios.get(apiUrl2),
        ]);

        const weatherMain = response.data.weather[0].main;
        const forecastWeather = response2.data.list.slice(0, 20);
        const weatherDisplay = getWeatherDisplay(weatherMain);

        const procesedForecastData = forecastWeather.map((forecast) => {
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
          let formattedDateString = new Intl.DateTimeFormat(
            "en-GB",
            options
          ).format(convertToDate);
          const formattedTimeString = new Intl.DateTimeFormat(
            "en-GB",
            optionsTime
          ).format(convertToDate);
          if (formattedDateString === formattedDate) {
            formattedDateString = "Today";
          } else if (formattedDateString === formattedTomorrow) {
            formattedDateString = "Tomorrow";
          }
          const forecastWeatherMain = forecast.weather[0].main;
          const forecastWeatherDisplay = getWeatherDisplay(forecastWeatherMain);
          return {
            celcius: forecast.main.temp,
            name: response2.data.city.name,
            humidity: forecast.main.humidity,
            speed: forecast.wind.speed,
            image: forecastWeatherDisplay,
            description: forecast.weather[0].description,
            country: response2.data.city.country,
            date: formattedDateString,
            time: formattedTimeString,
          };
        });
        setData({
          ...data,
          celcius: response.data.main.temp,
          name: response.data.name,
          humidity: response.data.main.humidity,
          speed: response.data.wind.speed,
          image: weatherDisplay,
          description: response.data.weather[0].description,
          country: response.data.sys.country,
        });
        setData2(procesedForecastData);
        setLoading(false);
        setError("");
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 404) {
          setError("City not found. Please try again.");
        } else {
          setError("Failed to fetch weather data.");
        }
        console.error("Error fetching weather data:", error);
      }
    };
    fetchData();
  }, []);

  const handleClick = () => {
    if (name !== "") {
      setLoading(true);
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;
      const apiForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=b882f0719ba7e08e90a827d174b54f6a&units=metric`;

      Promise.all([axios.get(apiUrl), axios.get(apiForecast)])
        .then(([currentWeatherResponse, forecastWeatherResponse]) => {
          const currentResponse = currentWeatherResponse.data;
          const weatherMain = currentResponse.weather[0].main;
          const weatherDisplay = getWeatherDisplay(weatherMain);

          setData({
            celcius: currentResponse.main.temp,
            name: currentResponse.name,
            humidity: currentResponse.main.humidity,
            speed: currentResponse.wind.speed,
            image: weatherDisplay,
            description: currentResponse.weather[0].description,
            country: currentResponse.sys.country,
          });

          const forecastData = forecastWeatherResponse.data.list.slice(0, 20);
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
            let formattedDateString = new Intl.DateTimeFormat(
              "en-GB",
              options
            ).format(convertToDate);
            const formattedTimeString = new Intl.DateTimeFormat(
              "en-GB",
              optionsTime
            ).format(convertToDate);
            if (formattedDateString === formattedDate) {
              formattedDateString = "Today";
            } else if (formattedDateString === formattedTomorrow) {
              formattedDateString = "Tomorrow";
            }
            const forecastWeatherMain = forecast.weather[0].main;
            const forecastWeatherDisplay =
              getWeatherDisplay(forecastWeatherMain);
            return {
              celcius: forecast.main.temp,
              name: forecastWeatherResponse.data.city.name,
              humidity: forecast.main.humidity,
              speed: forecast.wind.speed,
              image: forecastWeatherDisplay,
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
        .catch((error) => {
          setLoading(false);
          if (error.response && error.response.status === 404) {
            setError("City not found. Please try again.");
          } else {
            setError("Failed to fetch weather data.");
          }
          console.error("Error fetching weather data:", error);
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

//drizzles
/*<div class="loader">
    <div class="snow">
        <span style="--i:11"></span>
        <span style="--i:12"></span>
        <span style="--i:15"></span>
        <span style="--i:17"></span>
        <span style="--i:18"></span>
        <span style="--i:13"></span>
        <span style="--i:14"></span>
        <span style="--i:19"></span>
        <span style="--i:20"></span>
        <span style="--i:10"></span>
        <span style="--i:18"></span>
        <span style="--i:13"></span>
        <span style="--i:14"></span>
        <span style="--i:19"></span>
        <span style="--i:20"></span>
        <span style="--i:10"></span>
        <span style="--i:18"></span>
        <span style="--i:13"></span>
        <span style="--i:14"></span>
        <span style="--i:19"></span>
        <span style="--i:20"></span>
        <span style="--i:10"></span>
    </div>
</div> */

//rainy
/*
<div class="wrapper">
  <div class="cloud">
    <div class="cloud_left"></div>
    <div class="cloud_right"></div>
  </div>
  <div class="rain">
    <div class="drop"></div>
    <div class="drop"></div>
    <div class="drop"></div>
    <div class="drop"></div>
    <div class="drop"></div>
  </div>
  <div class="surface">
    <div class="hit"></div>
    <div class="hit"></div>
    <div class="hit"></div>
    <div class="hit"></div>
    <div class="hit"></div>
  </div>
</div>*/
