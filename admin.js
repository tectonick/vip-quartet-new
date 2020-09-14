const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const uuidV4 = require("uuid.v4");
const fs = require('fs');
const path = require('path');
const imageProcessor = require("./image-processing");
const utils=require("./utils");
const { request } = require("http");

const admin = {
  user: "root",
  password: "devpassword123"
}
var sessionId = 'none';

const urlencodedParser = bodyParser.urlencoded({ extended: true });

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
    var text=JSON.parse(fs.readFileSync(path.join(__dirname, "text.json")));
    res.render('admin', {galleryImages, repertoire, text});
});


router.post("/", urlencodedParser, (req, res) => {
  
  var repertoire=req.body.repertoire;
  delete req.body.repertoire; 
  fs.readdirSync(path.join(__dirname,"repertoire")).forEach(element => {
    fs.unlinkSync(path.join(__dirname,"repertoire",element));    
  });



  if(req.body.contacts_phones){
    var pId=0;
    req.body.contacts_phones.forEach((element)=>{
      element.id=pId;
      pId++;
    })
  }

  repertoire.forEach(element => {
    fs.writeFileSync(path.join(__dirname,"repertoire",element.name+".txt"),element.data);    
  });

  fs.writeFileSync(path.join(__dirname, "text.json"),JSON.stringify(req.body));
    res.redirect("/admin");
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