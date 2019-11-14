"use strict";
const multer = require("multer");
const express = require("express");
const path = require("path");
const router = express.Router();
const Papa = require("papaparse");
const fs = require("fs");

// set the route path
router.post("/", fileUpload);
router.post("/papa", papaParseReadFile);
router.get("/list", listFiles);
router.get("/papaunparse", papaUnParse);

module.exports = router;

// multer storage set up for single or multiple files
/*
* if we set the storage then it wil set the path and upload file to given file path
* if we don't set the storage it req.file will return with buffer object we can parse the buffer
using toString() which is default to utf-8 encoding
*/
function multerSetUp() {
  // multer storage set up
  let storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./public/uploads/");
    },
    filename: function(req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  });
  return multer({ storage: storage }).single("myImage"); // single file upload
}

// file upload fn
function fileUpload(req, res) {
  const upload = multerSetUp();
  upload(req, res, err => {
    if (err) {
      return res.render("index", {
        msg: err
      });
    } else {
      //console.log(req.file);
      res.render("index", {
        msg: "file uploaded successfully!"
      });
    }
  });
}

// use papaparse parse the buffer or file path files
function papaParseReadFile(req, res, err) {
  const upload = multerSetUp();
  upload(req, res, err => {
    if (err) {
      return res.render("index", {
        msg: err
      });
    } else {
      if (req.file.buffer) {
        console.log("buffer");
        // if using buffer object then storage would be blank no storage for files using multer
        let filetoParse = req.file.buffer.toString();
        if (filetoParse) {
          Papa.parse(filetoParse, {
            header: true,
            skipEmptyLines: "greedy",
            dynamicTyping: false,
            error: function(err, file, inputElem, reason) {
              console.log(err);
            },
            complete: result => {
              const newArry = [];
              result.data.map(res => {
                if (res.city !== "") {
                  const newObj = {
                    city: res.city
                      ? res.city.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : "",
                    lat: res.lat
                      ? res.lat.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : "",
                    lon: res.lon
                      ? res.lon.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : "",
                    population: res.population
                      ? res.population.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : "",
                    isCapital: res.isCapital
                      ? res.isCapital.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : ""
                  };
                  newArry.push(newObj);
                }
              });

              res.send({
                msg: newArry
              });
            }
          });
          // papa parser csv file
        }
      } else {
        console.log("no buffer");
        // if no buffer use multer storage for storing files and use the file path
        let filetoParse = fs.readFileSync(`${req.file.path}`, "utf8");

        if (filetoParse) {
          Papa.parse(filetoParse, {
            header: true,
            skipEmptyLines: "greedy",
            dynamicTyping: false,
            error: function(err, file, inputElem, reason) {
              console.log(err);
            },
            complete: result => {
              const newArry = [];
              result.data.map(res => {
                if (res.city !== "") {
                  const newObj = {
                    city: res.city
                      ? res.city.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : "",
                    lat: res.lat
                      ? res.lat.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : "",
                    lon: res.lon
                      ? res.lon.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : "",
                    population: res.population
                      ? res.population.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : "",
                    isCapital: res.isCapital
                      ? res.isCapital.replace(/[^a-zA-Z0-9-.@ ]/g, " ").trim()
                      : ""
                  };
                  newArry.push(newObj);
                }
              });

              res.send({
                msg: newArry
              });
            }
          });
          // papa parser csv file
        }
      }
    }
  });
}

// list all the files
function listFiles(req, res) {
  res.send({
    msg: "list of all the files!"
  });
}

// [papa unparse]
function papaUnParse(req, res) {
  var csv = Papa.unparse([
    {
      Name: "Dipranjan",
      Address: "bhubaneswar"
    },
    {
      Name: "deepak",
      Address: "bangalore"
    },
    {
      Name: "Rohit",
      Address: "bangkok"
    },
    {
      Name: "foo",
      Address: "bar"
    }
  ]);

  //console.log(csv);

  var wstream = fs.createWriteStream("./public/uploads/myOutput.csv");
  wstream.on("finish", function() {
    console.log("file has been written");
    res.send({
      msg: "file has been written"
    });
  });
  wstream.write(csv);
  wstream.end();
}
