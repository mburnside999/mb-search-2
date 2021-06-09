var express = require("express");
var router = express.Router();

var request = require('request');

var jsforce = require("jsforce");
var conn = new jsforce.Connection();
var records=[{dc:'Product'},{dc:'Audience'}];
var dcategories=[{category:'All'}];
conn.login("mikeb@lfl.demo", "salesforce123", function (err, res) {
  if (err) {
    return console.error(err);
  }
  
  var options = {
    'method': 'GET',
    'url': 'https://lfldemo.my.salesforce.com/services/data/v50.0/support/dataCategoryGroups/Product/dataCategories/All?sObjectName=KnowledgeArticleVersion',
    'headers': {
      'Authorization': 'Bearer '+conn.accessToken,
      'Content-Type': 'application/json'  }
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    var payload= JSON.parse(response.body);
    for (i=0; i<payload.childCategories.length; i++){
      //myset.add=result.records[i].DataCategoryGroupName;
      dcategories.push({category:payload.childCategories[i].name});
     }




  // conn.query("SELECT DataCategoryGroupName FROM Knowledge__DataCategorySelection", function(err, result) {
  //   if (err) { return console.error(err); }
    
  //   for (i=0; i<result.records.length; i++){
  //       //myset.add=result.records[i].DataCategoryGroupName;
  //       var s = result.records[i].DataCategoryName;
  //       myset.add(s);
  //      }
  //   for (let item of myset) dcategories.push({category:item});
    
  //   console.log(JSON.stringify(dcategories));


  });
  console.log("logged in to Salesforce");

});

/* GET home page. */
router.get("/", function (req, res, next) {
        console.log(JSON.stringify(dcategories));
        res.render("kbsearch", {
          categories: dcategories
        });
    }
  );




module.exports = router;
