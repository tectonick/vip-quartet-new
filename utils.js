
const path=require('path');
const fs=require('fs');


function NamesOfDirFilesWOExtension(basepath){
    var names=[];
    var realpath=path.join(__dirname, basepath);  
    var files = fs.readdirSync(realpath);
      files.forEach(file => {
        names.push(path.basename(file, ".jpg"));
                 
      }); 
      
    return names;
  }


    function GetYoutubeId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
  
      return (match && match[2].length === 11)
        ? match[2]
        : null;
    }

module.exports ={NamesOfDirFilesWOExtension};