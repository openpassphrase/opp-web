var package = require('./package.json');
var fs = require('fs');
version_string = '{"version":"' + package.version + '"}';
fs.writeFile('src/assets/version.json', version_string, function(err) {
  if(err) {
    return console.log(err);
  }
});