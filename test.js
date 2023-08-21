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
app.listen(3000, function () {
  console.log("test started");
})



const options3 = {
	method: 'GET',
	hostname: 'tripadvisor16.p.rapidapi.com',
	port: null,
	path: '/api/v1/flights/searchFlights?sourceAirportCode=DEL&destinationAirportCode=JAI&date=2023-05-23&itineraryType=ROUND_TRIP&sortOrder=PRICE&numAdults=1&numSeniors=0&classOfService=ECONOMY&returnDate=2023-05-31&pageNumber=1&nonstop=yes&currencyCode=INR',
	headers: {
		'X-RapidAPI-Key': 'b30623951dmsh10e6f1dfc704d0ap1f3c58jsn923bf1cae744',
		'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	}
};

const requestFlight = http.request(options3, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
    var farray;
    const price=JSON.parse(body).data.flights[0].purchaseLinks[0].totalPrice;
    const linkurl=JSON.parse(body).data.flights[0].purchaseLinks[0].url;
// jaane ki
    const aarray=JSON.parse(body).data.flights[0].segments[0].legs[0].operatingCarrier.logoUrl;
    const barray=JSON.parse(body).data.flights[0].segments[0].legs[0].operatingCarrier.displayName;

// aane ki
    const carray=JSON.parse(body).data.flights[0].segments[1].legs[0].operatingCarrier.logoUrl;
    const darray=JSON.parse(body).data.flights[0].segments[1].legs[0].operatingCarrier.displayName;


    // console.log(aarray);
    // console.log(barray);
    // console.log(carray);
    // console.log(darray);
	// console.log(price*82.91);
	
	});
});

requestFlight.end();










































































