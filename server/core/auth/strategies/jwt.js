"use strict";
const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	issuer: '', //TODO
	audience: '', // TODO
	secretOrKey: 'jwtsecret' //TODO
};

//TODO I think its not yet used, this strategy is for isAuthorized i guess

module.exports = function () {
	passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
			console.log('im in jwt.js');
			User.findById(payload.id, (err, user) => {
				if (err) {
					return done(err);
				}
				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
			});
		})
	);
};
