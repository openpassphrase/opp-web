var package = require('./package.json');
var fs = require('fs');
var date = new Date();
today = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
version_string = '{"version":"' + package.version + '-' + today + '"}';
fs.writeFile('src/assets/version.json', version_string, function(err) {
  if(err) {
    return console.log(err);
  }
});