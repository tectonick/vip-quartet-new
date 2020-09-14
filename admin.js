const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const uuidV4 = require("uuid.v4");
const fs = require('fs');
const path = require('path');
const imageProcessor = require("./image-processing");
const utils = require("./utils");
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
  res.render("login", { layout: false });
});

router.get('/', function (req, res) {
  var galleryImages = utils.NamesOfDirFilesWOExtension("/static/img/gallery");
  var repertoire = utils.GetRepertoire();
  var text = JSON.parse(fs.readFileSync(path.join(__dirname, "text.json")));
  res.render('admin', { galleryImages, repertoire, text });
});


router.post("/", urlencodedParser, (req, res) => {


  console.log("1");
  var repertoire = req.body.repertoire;
  var photosToDelete = req.body.photosToDelete;
  delete req.body.repertoire;
  delete req.body.photosToDelete;

  fs.readdirSync(path.join(__dirname, "repertoire")).forEach(element => {
    fs.unlinkSync(path.join(__dirname, "repertoire", element));
  });

  console.log("2");

  if (req.body.contacts_phones) {
    var pId = 0;
    req.body.contacts_phones.forEach((element) => {
      element.id = pId;
      pId++;
    })
  }
  console.log("3");


  console.log("4");

  if (photosToDelete) {
    photosToDelete.forEach(element => {
      fs.unlinkSync(path.join(__dirname, "static", element));
      console.log(element);
    });
  }
  console.log("5");



  fs.writeFileSync(path.join(__dirname, "text.json"), JSON.stringify(req.body));
   if (repertoire) {
     repertoire.forEach(element => {
       fs.writeFileSync(path.join(__dirname, "repertoire", element.name + ".txt"), element.data);
     });
   }
  

  res.redirect("/admin");
});




router.post("/upload", urlencodedParser, (req, res) => {
  if (req.files) {
    console.log(req.files);
    var files = [];
    if (!Array.isArray(req.files.files)) {
      files.push(req.files.files);
    } else {
      files = req.files.files;
    }

    files.forEach((fileToUpload) => {
      let tmpfile = path.join(__dirname, 'tmp/', fileToUpload.name);
      fileToUpload.mv(tmpfile, function (err) {
        imageProcessor.galleryImage(tmpfile).then(() => {
          let name = path.basename(tmpfile, path.extname(tmpfile));
          let dir = path.dirname(tmpfile);
          let src = path.join(dir, name + '.jpg');
          let dst = path.join(__dirname, '/static/img/gallery/', name + '.jpg');
          fs.copyFileSync(src, dst);
          fs.unlinkSync(src);
          if (tmpfile != src) {
            fs.unlinkSync(tmpfile);
          }
          if (err) return res.status(500).send(err);
          return res.status(200).send();
        }).catch(err => {
          console.error(err);
        });;

      });
    });
  } else {
    return res.status(200).send();
  }

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