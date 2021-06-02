var express = require('express');
var router = express.Router();

var jsforce = require('jsforce');
var xx='sssss';



/* GET home page. */
router.post('/', function(req, res, next) {
    var conn = new jsforce.Connection();
    let response=res;
    let search=req.body.srch;

    conn.login('mburnside@cta5.demo', 'salesforce123', function(err, res) {
      if (err) { return console.error(err); }
    conn.search("FIND {"+search+"} RETURNING Cirrus__kav(UrlName,Id, ArticleType, Details__c,KnowledgeArticleId, PublishStatus,Summary,Title WHERE PublishStatus='online')",
      function(err, resp) {
        if (err) { return console.error(err); }
        if (resp.searchRecords.length>0){
        console.log(JSON.stringify(resp));
        var summary=resp.searchRecords[0].Summary;
        var ps=resp.searchRecords[0].PublishStatus;
        var title=resp.searchRecords[0].Title;
        var details=resp.searchRecords[0].Details__c;
        var urlname=resp.searchRecords[0].UrlName;
        console.log(JSON.stringify(resp.searchRecords));

        response.render('kb',{'sr':resp.searchRecords,'summary':summary,'ps':ps,'title':title,'details':details,'urlname':urlname});
        } else
        response.render('kb',{'summary':'No data'});

      }
    );
    }); 
});

module.exports = router;
