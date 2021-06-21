const express = require("express");
const http = require("https");
require("dotenv").config();
const bodyParser = require("body-parser");
const { urlencoded, response } = require("express");
const { dir } = require("console");
const e = require("express");
const app = express();

let title;
let year;
let length;
let rating;
let poster;
let plot;
let cast = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/movie", (req, res) => {
  res.render("movieInfo", {
    title: title,
    year: year,
    length: length,
    rating: rating,
    plot: plot,
    poster: poster,
    cast: cast,
  });
});

app.post("/", (req, res) => {
  if (req.body.movieName.length != 0) {
    const options = {
      method: "GET",
      hostname: "imdb-internet-movie-database-unofficial.p.rapidapi.com",
      port: null,
      path: "/film/" + req.body.movieName.replace(/\s/g, ""),
      headers: {
        "x-rapidapi-key": process.env.API_KEY,
        "x-rapidapi-host": process.env.HOST,
        useQueryString: true,
      },
    };
    const ask = http.request(options, function (response) {
      const chunks = [];
      response.on("data", function (chunk) {
        chunks.push(chunk);
      });
      if (response.statusCode === 200) {
        response.on("end", function () {
          const body = JSON.parse(Buffer.concat(chunks));
          title = body.title.toUpperCase();
          year = body.year;
          length = body.length;
          rating = body.rating;
          poster = body.poster;
          plot = body.plot;
          cast = body.cast;
        });
        if (year) {
          res.redirect("/movie");
        } else {
          res.send("<h1>Sorry! Movie not found.</h1>");
        }
      } else {
        res.send("<h1>Something has gone wrong.</h1>");
      }
    });
    ask.end();
  } else {
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000.");
});
