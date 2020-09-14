const express=require("express");
const handlebars=require("express-handlebars");
const path=require('path');
const adminRouter=require("./admin");
const utils=require("./utils");
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');



const PORT = process.env.PORT || 5000;
const app=express();



const hbs=handlebars.create({
  defaultLayout:"main",
  extname:"hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "static")));
app.use('/admin',adminRouter);
app.listen(PORT, ()=>{
  console.log("Server started");
})
const https = require('https');
const fs = require('fs');

//start https server
let sslOptions = {
   key: fs.readFileSync('key.pem'),
   cert: fs.readFileSync('cert.pem')
};
let serverHttps = https.createServer(sslOptions, app).listen(8000);


app.get("/", (req, res) => {
    var galleryImages=  utils.NamesOfDirFilesWOExtension("/static/img/gallery");
    var text=JSON.parse(fs.readFileSync(path.join(__dirname, "text.json")));
    res.render('index', {galleryImages, text});
  });



