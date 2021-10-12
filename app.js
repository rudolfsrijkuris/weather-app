require("dotenv").config();

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

const tempInfo = [];

//getting routes
app.get("/", (req, res) => {
  res.render("home", {results: tempInfo});
});

app.get("/result", (req, res) => {
  res.render("result", {results: tempInfo});
});

app.get("/error", (req, res) => {
  res.render("error");
});

//continue here

app.listen(3000, function() {
  console.log("Server is running on 3000");
});


app.post("/", function(req, res) {

    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey + "&units=" + unit;
  
    https.get(url, (response) => {
      let data = ""
      response.on("data", (chunk) => {
        data += chunk;
        if (response.statusCode === 404 || response.statusCode === 400) {
          res.redirect("/error");
        } else {
          const weatherData = JSON.parse(data);
          console.log(weatherData);
          const temp = weatherData.main.temp;
          const description = weatherData.weather[0].description;
          const icon = weatherData.weather[0].icon;
          const iconURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
          const result = {
            query: query,
            temp: temp,
            description: description,
            iconURL: iconURL,
           }
          tempInfo.unshift(result);
          res.redirect("/result");
        }
      });
    }).on("error", (err) => {
      console.log("Error:" + err.message);
    });
});