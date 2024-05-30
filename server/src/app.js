const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// morgan middleware is used to log the req. made by client/browser that contain many info. It also used to redirect logs to different streams like file system or log system etc.
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", api);
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
