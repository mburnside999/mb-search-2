var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fetch = require("node-fetch");
const session = require("express-session");
const jsforce = require("jsforce");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var kbRouter = require("./routes/kb");
var kbSearchRouter = require("./routes/kbsearch");

console.log("clientid-", process.env.CLIENT_ID);
//jsForce connection
const oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl: "https://lfldemo.my.salesforce.com",
  //clientId and Secret will be provided when you create a new connected app in your SF developer account
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  //redirectUri : 'http://localhost:' + port +'/token'
  //redirectUri : 'http://localhost:3000/token'
  redirectUri: process.env.REDIRECT_URI,
});
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(session({ secret: "S3CRE7", resave: true, saveUninitialized: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.get("/auth/login", function (req, res) {
  // Redirect to Salesforce login/authorization page
  console.log("in /auth/login");
  res.redirect(oauth2.getAuthorizationUrl({ scope: "api id web" }));
  //res.render("index");
});

app.get("/token", function (req, res) {
  console.log("client id=" + process.env.CLIENT_ID);
  const conn = new jsforce.Connection({ oauth2: oauth2 });
  const code = req.query.code;
  conn.authorize(code, function (err, userInfo) {
    if (err) {
      return console.error("This error is in the auth callback: " + err);
    }
    console.log("Access Token: " + conn.accessToken);
    console.log("Instance URL: " + conn.instanceUrl);
    console.log("refreshToken: " + conn.refreshToken);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    req.session.accessToken = conn.accessToken;
    req.session.instanceUrl = conn.instanceUrl;
    req.session.refreshToken = conn.refreshToken;
    req.session.oauth2 = oauth2;
    var string = encodeURIComponent("true");
    console.log("app.js /token redirecting tp kbsearch");
    res.redirect("/kbsearch");
  });
});

app.use("/users", usersRouter);
app.use("/kb", kbRouter);
app.use("/kbsearch", kbSearchRouter);

fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => response.json())
  .then((json) => console.log(json));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.fred = "wwqwq";
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
