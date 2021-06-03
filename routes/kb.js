var express = require("express");
var router = express.Router();

var jsforce = require("jsforce");
var conn = new jsforce.Connection();

conn.login("mburnside@cta5.demo", "salesforce123", function (err, res) {
  if (err) {
    return console.error(err);
  }
  console.log("logged in to Salesforce");
});

/* GET home page. */
router.post("/", function (req, res, next) {
  let response = res;
  let search = req.body.srch;
  console.log('Searching for articles using search:',search);

  conn.search(
    "FIND {" +
      search +
      "} RETURNING Cirrus__kav(UrlName,Id, ArticleType, Details__c,KnowledgeArticleId, PublishStatus,Summary,Title WHERE PublishStatus='online')",
    function (err, resp) {
      if (err) {
        return console.error(err);
      }
        console.log(JSON.stringify(resp.searchRecords));
        response.render("kb", {
          sr: resp.searchRecords, pagetitle:"KB Articles"
        });
    }
  );
});

router.get("/article/:kbid", function (req, res, next) {
  let response = res;
  let kbid = req.params["kbid"];
   console.log('Searching for article with kbid:',kbid);
   conn.search('FIND {("*a*") OR ("*e*") OR ("*i*") OR ("*o*") OR ("*u*")} RETURNING Cirrus__kav(UrlName,Id, ArticleType, Details__c,KnowledgeArticleId, PublishStatus,Summary,Title WHERE language=\'en_US\' and Id=\'' +kbid +"')",
      function (err, resp) {
        if (err) {
          return console.error(err);
        }
        if (resp.searchRecords.length > 0) {
          console.log(JSON.stringify(resp));
          let summary = resp.searchRecords[0].Summary;
          let ps = resp.searchRecords[0].PublishStatus;
          let title = resp.searchRecords[0].Title;
          let details = resp.searchRecords[0].Details__c;
          let urlname = resp.searchRecords[0].UrlName;
          console.log(JSON.stringify(resp.searchRecords));
          response.render("kbarticle", {
            sr: resp.searchRecords,
            summary: summary,
            ps: ps,
            title: title,
            details: details,
            urlname: urlname,
            pagetitle: "Article Details"
            
          });
        } else response.render("kbarticle", { summary: "No data" });
      }
    );
  //});
});

module.exports = router;
