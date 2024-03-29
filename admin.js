const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const uuidV4 = require("uuid.v4");
const fs = require('fs');
const path = require('path');
const utils = require("./utils");
const bcrypt = require('bcrypt');
const config = require("config");
const urlencodedParser = bodyParser.urlencoded({ extended: true });

const admin = config.get("adminUser");
let sessionId = 'none';

router.use(function (req, res, next) {
  if ((req.cookies.id === sessionId) || (req.path == "/login") || (req.path == "/logout")) {
    next();
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/login", (_req, res) => {
  res.render("login", { layout: false });
});

router.get('/', function (_req, res) {
  let galleryImages = utils.NamesOfDirFilesWOExtension("/static/img/gallery");
  let text = JSON.parse(fs.readFileSync(path.join(__dirname, "text.json")));
  res.render('admin', { galleryImages, text });
});

router.post("/", urlencodedParser, (req, res) => {
  let photosToDelete = req.body.photosToDelete;
  delete req.body.photosToDelete;

  if (photosToDelete) {
    photosToDelete.forEach(element => {
      fs.unlinkSync(path.join(__dirname, "static", element));
    });
  }

  if (req.body.contacts_phones) {
    let pId = 0;
    req.body.contacts_phones.forEach((element) => {
      element.id = pId;
      pId++;
    })
  }

  if (req.body.repertoire) {
    let pId = 0;
    req.body.repertoire.forEach((element) => {
      element.id = pId;
      pId++;
    })
  }

  fs.writeFileSync(path.join(__dirname, "text.json"), JSON.stringify(req.body));
  res.redirect("/admin");
});

router.post("/upload", urlencodedParser, (req, res) => {
  if (req.files) {
    let files = [];
    if (!Array.isArray(req.files.files)) {
      files.push(req.files.files);
    } else {
      files = req.files.files;
    }
    files.forEach((fileToUpload) => {
      let tmpfile = path.join(__dirname, 'tmp/', fileToUpload.name);
      fileToUpload.mv(tmpfile, function (err) {
        utils.GalleryImageConvert(tmpfile).then(() => {
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
        }).catch(uploadErr => {
          console.error(uploadErr);
        });
      });
    });
  } else {
    return res.status(200).send();
  }
});

router.post("/login", urlencodedParser, (req, res) => {
  if ((req.body.username === admin.user) && (bcrypt.compareSync(req.body.password, admin.passhash))) {
    sessionId = uuidV4();
    res.cookie("id", sessionId, { maxAge: 24 * 60 * 60 * 10000 });
    res.redirect("/admin");
  } else {
    res.redirect("/admin/login");
  }
});

router.get('/logout', function (_req, res) {
  res.clearCookie('id');
  res.redirect("/");
});

module.exports = router;