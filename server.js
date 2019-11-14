require("rootpath")();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const errorHandler = require("_helpers/error-handler");
//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use view engine
app.set("view engine", "ejs");
app.use(express.static("./public"));

// root api
app.get("/", (req, res) => res.render("index"));

// upload file url
app.use("/upload", require("./controllers/papaparse.controller"));

app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === "production" ? 80 : 8090;
app.listen(port, function() {
  console.log("Server listening on port " + port);
});
