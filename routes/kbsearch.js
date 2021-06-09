var express = require("express");
var router = express.Router();

var request = require('request');

var jsforce = require("jsforce");
var mbconn = require("../routes/sfconnect");
var records=[{dc:'Product'},{dc:'Audience'}];
var dcategories=[{category:'All'}];


/* GET home page. */
router.get("/", function (req, res, next) {
  var options = {
    'method': 'GET',
    'url': 'https://lfldemo.my.salesforce.com/services/data/v50.0/support/dataCategoryGroups/Product/dataCategories/All?sObjectName=KnowledgeArticleVersion',
    'headers': {
      'Authorization': 'Bearer '+mbconn.accessToken,
      'Content-Type': 'application/json'  }
  };   
  request(options, function (error, response) {
    if (error) throw new Error(error);
    var payload= JSON.parse(response.body);
    for (i=0; i<payload.childCategories.length; i++){
      //myset.add=result.records[i].DataCategoryGroupName;
      dcategories.push({category:payload.childCategories[i].name});
     }

  });
  
  
  
  console.log(JSON.stringify(dcategories));
        res.render("kbsearch", {
          categories: dcategories
        });
    }
  );




module.exports = router;
