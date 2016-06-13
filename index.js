var express = require('express');
var app 	= express();
var fs 	= require('fs');
var secret 	= {};
var users 	= {};


var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
	consumerKey: 'MQtBSCnasD6Eth0lHCSGOQiMp',
	consumerSecret: '2FALIuUEHO8UttLYbrWEwMxNyvj09nf4uygpzhYGfSazj7YUwX',
	callback: 'http://127.0.0.1:3000/callback'
});


app.get('/', function (req, res) {
	twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
		if (error) {
			res.send("Error getting OAuth request token : " + error);
		} else {
			console.warn(requestToken, requestTokenSecret);
			secret[requestToken]  = requestTokenSecret;
			res.redirect("https://twitter.com/oauth/authenticate?oauth_token="+requestToken);
		}
	});

});


app.get('/callback', function(req, res) {
	var requestToken 	= req.query.oauth_token;
	var verifier 		= req.query.oauth_verifier;
	var requestSecret 	= secret[requestToken];

	twitter.getAccessToken(requestToken, requestSecret, verifier, function(error, accessToken, accessTokenSecret, results) {
		if (error) {
			console.log(error);
		} else {
			//store accessToken and accessTokenSecret somewhere (associated to the user) 
			//Step 4: Verify Credentials belongs here 
			users[results["user_id"]] = {
				accessToken: accessToken,
				accessSecret: accessTokenSecret
			};
			res.json({
				result: results
			});
		}
	});
});


app.get('/token', function(req, res) {
	var userId = req.query.uid;
	if(userId in users) {
		res.json({
			code: 0,
			msg: users[userId]
		});
	} else {
		res.json({
			code: -1,
			msg: 'User id not found'
		});
	}

});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
