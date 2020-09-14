
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
  
  function GetRepertoire(){
      var names=[];
      var realpath=path.join(__dirname,'repertoire');  
      var n=0;
      var files = fs.readdirSync(realpath);
        files.forEach(file => {
          let content=fs.readFileSync(path.join(realpath,file));  
          names.push({name:path.basename(file, ".txt"),data:content, num:n});           
          n++;      
        }); 
        
      return names;
    }


module.exports ={NamesOfDirFilesWOExtension, GetRepertoire};