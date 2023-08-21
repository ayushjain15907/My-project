require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const http = require("https");
const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passport_local = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreatePlugin = require("mongoose-findorcreate");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
  secret: 'secretcode',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://127.0.0.1:27017/travelDB");

const selectionSchema=new mongoose.Schema({
  hotelinfo:String,
  flightinfo:String,
  totalprice:Number
})

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  selectedItem:selectionSchema
});

userSchema.plugin(passportLocalMongoose);

const userModel=new mongoose.model("user",userSchema);
passport.use(userModel.createStrategy());
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});




app.get("/register",function(req,res){
  res.render("register");
  
});


app.get("/login",function(req,res){
  res.render("login");
});



app.post("/register",function(req,res){
  userModel.register({ username: req.body.username }, req.body.password, function (err, user) {
    if (err) {
        console.log(err);
      
        res.render("register");
    }
    else {
        passport.authenticate("local")(req, res, function ()
        {
            res.redirect("/");
        }
        )
    }
});



});

app.post("/login",function(req,res){

  const user = new userModel({
    user: req.body.username,
    passwrod: req.body.password
  });

req.login(user, function (err) {
    if (err){
        res.render("login");
        // return next(err); 
        
    }
    else {
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        }
        )
    }
});



});



const reviewSchema = new mongoose.Schema({
  heading: String,
  description: String
})

const citySchema = new mongoose.Schema({
  cityname: String,
  bgimageurl: String,
  about: String,
  image1url: String,
  image2url: String,
  image3url: String,
  image4url: String,
  aiportCode: String,
  
  review: [reviewSchema]

});




const travelModel = new mongoose.model("User", userSchema);
const cityModel = new mongoose.model("City", citySchema);



var writeObject;
app.listen("2000", function () {
  console.log("server has been started");
})
  ;


const options = {
  method: 'POST',
  hostname: 'hotels4.p.rapidapi.com',
  port: null,
  path: '/properties/v2/list',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': '1d524250b5msh91769e6ca22d404p1268bfjsnb69a52cf222d',
    'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
  }
};


var searchName;
var options2;
var options3;
app.post("/intermediate", function (req, res) {
  searchName = req.body.search;
  options2 = {
    method: 'GET',
    hostname: 'hotels4.p.rapidapi.com',
    port: null,
    path: '/locations/v3/search?q=' + searchName + '&locale=en_US&langid=1033&siteid=300000001',
    headers: {
      'X-RapidAPI-Key': '1d524250b5msh91769e6ca22d404p1268bfjsnb69a52cf222d',
      'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
    }
  };

  res.render("intermediate");

});
app.get("/confirm", function (req, res) { res.render("confirmation"); });

var dd;
var rd;
var acode;
var numberpeople;
var ciy;
var cim;
var cid;
var com;
var coy;
var cod;
var regionid;
var destinationcode;






app.post("/test", function (req, respond) {
  console.log(req.body);
  dd = req.body.departure + "";
  rd = req.body.return + "";
  var ci = req.body.checkIn;
  var co = req.body.checkOut;
  ciy = ci.slice(0, 4);
  cim = ci.slice(5, 7);
  cid = ci.slice(8, 10);
  coy = co.slice(0, 4);
  com = co.slice(5, 7);
  cod = co.slice(8, 10);
  ciy = ciy - 0;
  cim = cim - 0;
  cid = cid - 0;
  coy = coy - 0;
  com = com - 0;
  cod = cod - 0;
  console.log(ciy);
  console.log(cim);
  console.log(cid);
  console.log(coy);
  console.log(com);
  console.log(cod);


  acode = req.body.airportCode;
  numberpeople = req.body.numberOfPeople - 0;


  const myreq = http.request(options2, function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      const body = Buffer.concat(chunks);
      var myobj = body.toString();
      regionid = JSON.parse(body).sr[0].gaiaId;
      regionid = regionid + "";
      writeObject = {
        currency: 'INR',
        eapid: 36,
        locale: 'en_US',
        siteId: 300000036,
        destination: { regionId: regionid },
        checkInDate: {
          day: cid,
          month: cim,
          year: ciy
        },
        checkOutDate: {
          day: cod,
          month: com,
          year: coy
        },
        rooms: [
          {
            adults: numberpeople,
          }
        ],
        resultsStartingIndex: 0,
        resultsSize: 200,
        sort: 'PRICE_LOW_TO_HIGH',
        filters: {
          price: {
            max: 100000,
            min: 100
          }
        }
      }

     

      cityModel.findOne({ cityname:searchName}).then(function (item){

        destinationcode = item.aiportCode;
        console.log(destinationcode);
        options3 = {
          method: 'GET',
          hostname: 'tripadvisor16.p.rapidapi.com',
          port: null,
          path: '/api/v1/flights/searchFlights?sourceAirportCode=' + acode + '&destinationAirportCode=' + destinationcode + '&date=' + dd + '&itineraryType=ROUND_TRIP&sortOrder=PRICE&numAdults=' + numberpeople + '&numSeniors=0&classOfService=ECONOMY&returnDate=' + rd + '&pageNumber=1&nonstop=yes&currencyCode=INR',
          headers: {
            'X-RapidAPI-Key': 'b30623951dmsh10e6f1dfc704d0ap1f3c58jsn923bf1cae744',
            'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
          }
        };


      }).catch(function (err) { console.log(err) });








      









      respond.redirect("/city");
    });
  });

  myreq.end();


})

var airportCodedest;








app.get("/", function (req, res){ 
  if(req.isAuthenticated()){
    res.render("home");
  }
  else{
    res.redirect("/login");
  }
});











app.get("/city", function (requesting, response) {
  if(requesting.isAuthenticated()){
     //database fetch
  console.log("printting search name" + searchName);
  var cityreturnobject;
  var cityname;
  var bg;
  var about;
  var i1;
  var i2;
  var i3;
  var i4;
  cityModel.findOne({ cityname:searchName}).then(function (item) {
    cityreturnobject = item;
    // console.log(item);
    cityname = item.cityname;
    bg = item.bgimageurl;
    about = item.about;
    i1 = item.image1url;
    i2 = item.image2url;
    i3 = item.image3url;
    i4 = item.image4url;
  

  }).catch(function (err) { console.log(err) });


  //hotel api call
  var name;
  var myurl;

  if (regionid != 0) {

    // console.log("before request " + regionid);
    const req = http.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        const myobj = body.toString();
        // console.log(myobj);
        // console.log("after request " + regionid);
        const myarray = JSON.parse(myobj).data.propertySearch.properties;



        //  FLIGHT API
        // console.log(options3);
        const requestFlight = http.request(options3, function (res) {
          const chunks = [];

          res.on('data', function (chunk) {
            chunks.push(chunk);
          });

          res.on('end', function () {
            const body = Buffer.concat(chunks);

            const sending = JSON.parse(body).data.flights;
            



            response.render("city", { darray: myarray, farray: sending, myobj: cityreturnobject });

          });
        });
        
        requestFlight.end();
      });
    });
    // console.log(writeObject);
    req.write(JSON.stringify(writeObject));
    req.end();

  }
  }
  else{
    res.render("login");
  }


 
});

var hprice;
var fprice;
app.post("/hotelprice", function (req, res) {
  hprice = req.body.price;
  hprice=hprice.slice(1,hprice.length);
  var days=cod-cid;
  console.log(days);
  hprice=parseInt(hprice);
  console.log(hprice);
  numberpeople=numberpeople-0;
  hprice=hprice*numberpeople;
  console.log(hprice);
  hprice=hprice*days;
  console.log(hprice);
  res.status(204).send();
})
;

app.post("/fprice", function (req, res) {
  console.log("entered flight yaaa");
  console.log(req.body);
  fprice = req.body.price;
  fprice=Math.round(fprice);
  console.log(fprice);

  res.status(204).send();
});



app.get("/admin9983037173", function (req, res) {
  res.render("admin");
})
  ;

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
    });
    
    res.redirect("/");
    
});

app.post("/admin9983037173", function (req, res) {
  console.log(req.body);

  const cname = req.body.cityName;
  const about = req.body.cityAbout;
  const bg = req.body.background;
  const i1 = req.body.i1;
  const i2 = req.body.i2;
  const i3 = req.body.i3;
  const i4 = req.body.i4;
  const myCode = req.body.code;
  console.log(myCode);

  const newEntry = new cityModel({
    cityname: cname,
    bgimageurl: bg,
    about: about,
    image1url: i1,
    image2url: i2,
    image3url: i3,
    image4url: i4,
    aiportCode: myCode,
    
  })

  console.log(cname);
  newEntry.save();
  console.log("saved the new city!");
  res.redirect("/");
});




app.post("/review",function(req,res){

  console.log("entered review post");

  var username=req.session.passport.user.username;

  var review=req.body.review;


  var newobj={
    heading: username,
    description: review
  }
  

  var filter={cityname:searchName};
  var robj=[];
  

  cityModel.findOne(filter).
  then(function(item)
  {
    robj=item.review;
  })
  .catch(function(err){console.log(err)})
  console.log("this is before push "+robj);
  robj.push(newobj);
  console.log("this is after push "+robj);
  const update={review: robj};
  

  cityModel.findOneAndUpdate(filter, update).then(function(item){console.log(item);}).catch(function(err){console.log(err);});

  res.redirect("/city");

})


app.post("/pricecal",function(req,res){
  res.render("price",{fprice:fprice,hprice:hprice});
});