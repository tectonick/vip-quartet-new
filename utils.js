const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

function NamesOfDirFilesWOExtension(basepath) {
  let names = [];
  let realpath = path.join(__dirname, basepath);
  let files = fs.readdirSync(realpath);
  files.forEach(file => {
    names.push(path.basename(file, ".jpg"));

  });

  return names;
}

function GalleryImageConvert(filepath) {
  return Jimp.read(filepath)
    .then(file => {
      let ext = path.extname(filepath);
      let name = path.basename(filepath, ext);
      let dir = path.dirname(filepath);
      return file.resize(1600, Jimp.AUTO) // resize
        .quality(100) // set JPEG quality
        .writeAsync(path.join(dir, name + '.jpg')); //
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = { NamesOfDirFilesWOExtension, GalleryImageConvert };