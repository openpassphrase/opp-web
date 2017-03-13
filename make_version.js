var package = require('./package.json');
var fs = require('fs');
var date = new Date();
var today = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
version_string = '{"version":"' + package.version + '-' + today + '"}';
fs.writeFile('src/assets/version.json', version_string, function(err) {
  if(err) {
    return console.log(err);
  }
});