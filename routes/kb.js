var express = require('express');
var router = express.Router();

var jsforce = require('jsforce');
var xx='sssss';



/* GET home page. */
router.get('/', function(req, res, next) {
    var conn = new jsforce.Connection();
    let fred=res;
    conn.login('mburnside@cta5.demo', 'salesforce123', function(err, res) {
      if (err) { return console.error(err); }
    conn.search("FIND {turbine} RETURNING Cirrus__kav(UrlName,Id, ArticleType, Details__c,KnowledgeArticleId, PublishStatus,Summary,Title WHERE PublishStatus='online')",
      function(err, resp) {
        if (err) { return console.error(err); }
        
        console.log('xx',xx);
        console.log('resp',fred);
        
        console.log(JSON.stringify(resp.searchRecords));
        fred.render('kb', { title:'xx'  });


      }
    );
    }); 
});

module.exports = router;
