const express = require("express");
const handlebars = require("express-handlebars");
const path = require('path');
const fs = require('fs');
const adminRouter = require("./admin");
const utils = require("./utils");
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const https = require('https');
const config = require("config");

//Config
const PORT = process.env.PORT || 80;
const ssl = config.get("ssl");
const environment = process.env.NODE_ENV || "production";
const isDevelopment = environment === "development";

function CleanTmpFolder() {
  if (fs.existsSync("./tmp")) {
    fs.rmdirSync("./tmp", { recursive: true });
    fs.mkdirSync("./tmp");
  }
}

function CreateApp(){
  const app = express();
  const hbs = handlebars.create({
    defaultLayout: "main",
    extname: "hbs",
  });
  app.engine("hbs", hbs.engine);
  app.set("view engine", "hbs");
  app.use(cookieParser());
  app.use(fileUpload());
  app.use(express.static(path.join(__dirname, "static")));
  app.use('/admin', adminRouter);
  
  //Main route
  app.get("/", (_req, res) => {
    let galleryImages = utils.NamesOfDirFilesWOExtension("/static/img/gallery");
    let text = JSON.parse(fs.readFileSync(path.join(__dirname, "text.json")));
    res.render('index', { galleryImages, text });
  });
  
  return app;
}

function StartServer(app){
  if (!isDevelopment) CleanTmpFolder();
  //Start http server
  app.listen(PORT, () => {
    console.log("Server started");
  })
  //Start https server
  let sslOptions = {
    key: fs.readFileSync(ssl.key),
    cert: fs.readFileSync(ssl.cert),
  };
  https.createServer(sslOptions, app).listen(ssl.httpsport);
  //Log start
  if (isDevelopment) {
    console.log(`Server http address is http://localhost:${PORT}`);
    console.log(`Server https address is https://localhost:${ssl.httpsport}`);
  }
}

module.exports = { StartServer, CreateApp };