var express = require("express");
var router = express.Router();

var jsforce = require("jsforce");
var conn = new jsforce.Connection();
var recordTypesArray=[];

conn.login("mikeb@lfl.demo", "salesforce123", function (err, res) {
  if (err) {
    return console.error(err);
  }
  
  conn.query("SELECT Id,Name FROM RecordType WHERE SobjectType = 'Knowledge__kav'", function(err, result) {
    if (err) { return console.error(err); }
    console.log("=======>record types result===>",JSON.stringify(result));
    console.log(result.records[0].Name);
    console.log(result.records[0].Id);
    recordTypesArray=[];
    for (i=0; i<result.records.length; i++){
     recordTypesArray[i]={"key":result.records[i].Id, "val":result.records[i].Name};
    }

    let rt = recordTypesArray.find(rt => rt.key === "0122v000002FlncAAC")
console.log(JSON.stringify(rt));
  });




  console.log("logged in to Salesforce");
});

/* GET home page. */
router.post("/", function (req, res, next) {
  let response = res;
  let search = req.body.srch;
  var psearch = (req.body.product=="restrict") ? true : false;
  console.log("psearch",psearch)
  console.log('Searching for articles using search:',search);
  
  var searchstr='';
  if (psearch){
   searchstr="FIND {" +search +"} RETURNING Knowledge__kav(UrlName,Id, ArticleNumber, FAQ_Answer__c,KnowledgeArticleId, PublishStatus,RecordTypeId, Summary,Title WHERE PublishStatus='online') WITH DATA CATEGORY Product__c below  All__c";
  } else {
    searchstr="FIND {" +search +"} RETURNING Knowledge__kav(UrlName,Id, ArticleNumber, FAQ_Answer__c,KnowledgeArticleId, PublishStatus,RecordTypeId, Summary,Title WHERE PublishStatus='online' )";
  }
   console.log("searchstr",searchstr);
  conn.search(
    searchstr,
    function (err, resp) {
      if (err) {
        return console.error(err);
      }
        
      
        console.log(JSON.stringify(resp.searchRecords));

        for (i=0; i<resp.searchRecords.length; i++){
          resp.searchRecords[i]["RT"]="xx";
         }
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
   conn.search('FIND {("*a*") OR ("*e*") OR ("*i*") OR ("*o*") OR ("*u*")} RETURNING Knowledge__kav(UrlName,Id, FAQ_Answer__c,KnowledgeArticleId, PublishStatus,RecordTypeId, Summary,VersionNumber,ArticleNumber,FirstPublishedDate,Title WHERE language=\'en_US\' and Id=\'' +kbid +"')",
      function (err, resp) {
        if (err) {
          return console.error(err);
        }
        if (resp.searchRecords.length > 0) {
          console.log(JSON.stringify(resp));
          let summary = resp.searchRecords[0].Summary;
          let ps = resp.searchRecords[0].PublishStatus;
          let title = resp.searchRecords[0].Title;
          let details = resp.searchRecords[0].FAQ_Answer__c;
          let urlname = resp.searchRecords[0].UrlName;
          let version = resp.searchRecords[0].VersionNumber;
          let published = resp.searchRecords[0].FirstPublishedDate;
          let articlenumber = resp.searchRecords[0].ArticleNumber;
          let recordtypeid=resp.searchRecords[0].RecordTypeId;
          let recordtypename = recordTypesArray.find(rt => rt.key === recordtypeid).val;

          console.log(JSON.stringify(resp.searchRecords));



          response.render("kbarticle", {
            sr: resp.searchRecords,
            summary: summary,
            ps: ps,
            title: title,
            details: details,
            urlname: urlname,
            version: version,
            published: published.substring(0,10),
            articlenumber: articlenumber,
            pagetitle: "Article",
            recordtypename: recordtypename
            
          });
        } else response.render("kbarticle", { summary: "No data" });
      }
    );
  //});
});

module.exports = router;
