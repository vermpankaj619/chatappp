const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const http = require('http');
const cookieParser= require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore= require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const container = require('./container');

container.resolve(function(users, _, admin, homi){

  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://pankaj:pankaj@ds133558.mlab.com:33558/sir', {useMongoClient: true});
     
  const app = SetupExpress();

  function SetupExpress(){
    const app = express();
    const server = http.createServer(app);
    server.listen(8000, function(){
      console.log("Listening on port 8000");
    });
    ConfigureExpress(app);
    //Setup router
    const router = require('express-promise-router')();
    users.SetRouting(router);
    admin.SetRouting(router);
    homi.SetRouting(router);
   
  

    app.use(router);
  }


  function ConfigureExpress(app){

     require('./passport/passport-local');
     require('./passport/passport-facebook');
     require('./passport/passport-google');
    // require('./passport/passport-github');


    app.use(express.static('public'));
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    
    app.use(validator());
    app.use(session({
      secret : 'thisisasecretkey',
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({mongooseConnection: mongoose.connection})
    }));
     app.use(flash());

     app.use(passport.initialize());
     app.use(passport.session());
     app.locals= _;

  }
  
});