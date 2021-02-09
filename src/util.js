var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

module.exports.toDataURL = (url, callback) => {
  console.log('>>>>>  url : ', url);
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      console.log('>>>>>  reader.result : ', reader.result);
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
};
