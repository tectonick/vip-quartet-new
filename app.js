const express=require("express");
const handlebars=require("express-handlebars");
const path=require('path');
const PORT = process.env.PORT || 5000;
const app=express();



const hbs=handlebars.create({
  //defaultLayout:"main",
  extname:"hbs"
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "static")));
app.listen(PORT, ()=>{
  console.log("Server started");
})
const https = require('https');
const fs = require('fs');
// start https server
// let sslOptions = {
//    key: fs.readFileSync('key.pem'),
//    cert: fs.readFileSync('cert.pem')
// };
// let serverHttps = https.createServer(sslOptions, app).listen(8000);


app.get("/", (req, res) => {
    var galleryImages=  NamesOfDirFilesWOExtension("/static/img/gallery");
    res.render('index', {galleryImages});
  });




function NamesOfDirFilesWOExtension(basepath){
  var names=[];
  var realpath=path.join(__dirname, basepath);  
  var files = fs.readdirSync(realpath);
    files.forEach(file => {
      names.push(path.basename(file, ".jpg"));
               
    }); 
    
  return names;
}