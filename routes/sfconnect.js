var jsforce = require("jsforce");
var mbconn = new jsforce.Connection();
var recordTypesArray=[];
console.log("in sfconnect");
if (typeof mbconn.accessToken==='undefined'){
mbconn.login("mikeb@lfl.demo", "salesforce123", function (err, res) {
  if (err) {
    console.log("!@!!!!");
    return console.error(err);
  } 
  console.log("sfconnect===>",mbconn.accessToken);
}); } else console.log('reusing token');


module.exports = mbconn;
