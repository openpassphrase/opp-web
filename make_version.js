var package = require('./package.json');
var fs = require('fs');
var date = new Date();
var month = ('0' + (date.getMonth() + 1)).slice(-2);
var day = ('0' + date.getDate()).slice(-2);
var hour = ('0' + date.getHours()).slice(-2);
var minute = ('0' + date.getMinutes()).slice(-2);
var version =
  date.getFullYear() + '-' + month + '-' + day + '-' + hour + '-' + minute;
var version_string = `export const version = '${package.version}-${version}';\n`;
fs.writeFile('src/assets/version.ts', version_string, function (err) {
  if (err) {
    return console.log(err);
  }
});
