// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const convertToUTC = (timestamp) => {
  const date = new Date(timestamp);
  return date.toUTCString();
};

const getTime = () => new Date().toString();

const getUnixTimestamp = (utcDateString) => {
  const date = new Date(utcDateString);
  const unixTimestamp = Math.floor(date.getTime());
  return unixTimestamp;
};

const isValidDate = (string) => {
  let isValid;
  if (string === undefined) {
    isValid = false;
  } else if (
    Number.isNaN(Number(string)) &&
    new Date(string) == "Invalid Date"
  ) {
    isValid = false;
  } else if (new Date(string) === "Invalid Date") {
    isValid = false;
  } else {
    isValid = true;
  }
  return isValid;
};
app.get("/api/:date?", (req, res, next) => {
  console.log("TEST PARAM ===> ", req.params.date);
  // console.log("is valid date", new Date(req.params.date));

  // console.log("current time", req.time); // Wed Mar 12 2025 03:43:24 GMT+0000 (Coordinated Universal Time)
  // console.log("date", new Date(req.time));
  const date = new Date().toISOString(); // 2025-03-12T03:43:23.000Z
  const unixTimestampDateCurrent = getUnixTimestamp(getTime()); // gets unix of current time
  const unixTimestampDateString = getUnixTimestamp("2016-12-25"); // gets unix of string date
  // new Date("2016-12-25") => 2016-12-25T00:00:00.000Z
  // console.log(new Date("2016-12-25").toUTCString()); // Sun, 25 Dec 2016 00:00:00 GMT
  console.log("Is Valid Date? ", isValidDate(req.params.date));
  if (req.params.date === undefined) {
    // If no endpoint provided, send current
    res.json({
      unix: getUnixTimestamp(getTime()),
      utc: convertToUTC(getUnixTimestamp(getTime())),
    });
  } else if (!Number.isNaN(Number(req.params.date))) {
    // If a unix, send date
    res.json({
      unix: Number(req.params.date),
      utc: convertToUTC(Number(req.params.date)),
    });
  } else if (isValidDate(req.params.date)) {
    // console.log("Valid date: ", req.params.date);
    // console.log("Valid date ===> ", getUnixTimestamp(req.params.date));
    res.json({
      unix: getUnixTimestamp(req.params.date),
      utc: new Date(req.params.date).toUTCString(),
    });
  } else {
    res.json({
      error: "Invalid Date",
    });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
