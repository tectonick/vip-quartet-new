const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const uuidV4 = require("uuid.v4");
const fs = require('fs');
const path = require('path');
const imageProcessor = require("./image-processing");
const utils=require("./utils");

const admin = {
  user: "root",
  password: "devpassword123"
}
var sessionId = 'none';

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(function (req, res, next) {
  if ((req.cookies.id === sessionId) || (req.path == "/login") || (req.path == "/logout")) {
    next();
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/login", (req, res) => {
  res.render("login",  {layout: false});
});

router.get('/', function (req, res) {
    var galleryImages=utils.NamesOfDirFilesWOExtension("/static/img/gallery");
    var repertoire=utils.GetRepertoire();
    res.render('admin', {galleryImages, repertoire});
});

router.post("/login", urlencodedParser, (req, res) => {

  if ((req.body.username === admin.user) && (req.body.password === admin.password)) {
    sessionId = uuidV4();
    res.cookie("id", sessionId, { maxAge: 24 * 60 * 60 * 10000 });
    res.redirect("/admin");
  } else {
    res.redirect("/admin/login");
  }
});

router.get('/logout', function (req, res) {
  res.clearCookie('id');
  res.redirect("/");
});


module.exports = router;