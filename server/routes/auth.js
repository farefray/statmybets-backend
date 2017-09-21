"use strict";

let config = require("../config");
let logger = require("../core/logger");

let crypto = require("crypto");
let async = require("async");

let passport = require("passport");
let express = require("express");

let mailer = require("../libs/mailer");
let User = require("../models/user");
let response = require("../core/response");

/**
	* Generate JSON or HTML response to client,
	* If browser accept JSON and not HTML, we send
	* JSON response. Else we redirect to an URL
	* which defined in `redirect` parameter.
	*
	* @param  {Object} req      request object
	* @param  {Object} res      response object
	* @param  {Object} errcode      Error object.
	* @param  {Objects} errors Errors
	*/
module.exports = function (app, db) {

	let authRouter = express.Router();

	authRouter.post("/local", function (req, res, next) {
		req.assert("username", req.t("UsernameCannotBeEmpty")).notEmpty();

		let errors = req.validationErrors();
		if (errors) {
			return response.json(res, errors, {status: 402});
		}

		if (req.body.password) {
			// Login with password
			passport.authenticate("local", function (err, user, info) {
				if (!user) {
					return response.json(res, null, {status: 401, message: info.message});
				}

				req.login(user, function (err) {
					if (err) {
						return response.json(res, null, {status: 401, message: err});
					}

					// Success authentication
					// Update user's record with login time
					req.user.lastLogin = Date.now();
					req.user.save(function () {
						// Remove sensitive data before login
						req.user.password = undefined;
						req.user.salt = undefined;

						return response.json(res);
					});

				});

			})(req, res, next);

		} else {
			// Passwordless login
			async.waterfall([

				function generateToken(done) {
					crypto.randomBytes(25, function (err, buf) {
						done(err, err ? null : buf.toString("hex"));
					});
				},

				function getUser(token, done) {
					let username = req.body.username;
					User.findOne({
						$or: [
							{"username": username},
							{"email": username}
						]
					}, function (err, user) {
						if (!user) {
							return done("Invalid username or email: " + username);
						}

						// Check that the user is not disabled or deleted
						if (user.status !== 1) {
							return done(`User '${username} is disabled or deleted!`);
						}


						user.passwordLessToken = token;
						//user.passwordLessTokenExpires = Date.now() + 3600000; // expire in 1 hour
						user.save(function (err) {
							done(err, token, user);
						});
					});
				},

				function sendResetEmailToUser(token, user, done) {
					if (!config.mailer.enabled) {
						const err = "Trying to send email without config.mailer not enabled; emailing skipped. Have you configured mailer yet?";
						logger.error(err);
						return done(err, user);
					}
					let subject = req.t("mailSubjectLogin", config);

					res.render("mail/passwordLessLogin", {
						name: user.fullName,
						loginLink: "http://" + req.headers.host + "/passwordless/" + token
					}, function (err, html) {
						if (err)
							return done(err);

						mailer.send(user.email, subject, html, function (err, info) {
							/*if (err)
								req.flash("error", {msg: req.t("UnableToSendEmail", user)});
							else
								req.flash("info", {msg: req.t("emailSentWithMagicLink", user)});*/

							done(err);
						});
					});
				}

			], function (err, user) {
				if (err) {
					logger.error(err);
				}

				return response.json(res);
			});
		}

	});

	/**
		* Google authentication routes
		*
		* Available scopes: https://developers.google.com/+/web/api/rest/oauth#authorization-scopes
		*/
	authRouter.get("/google", passport.authenticate("google", {
		scope: "profile email"
		/*scope: [
			'https://www.googleapis.com/auth/plus.login',
			'https://www.googleapis.com/auth/plus.profile.emails.read'
		]*/
	}));

	authRouter.get("/google/callback", passport.authenticate("google", {
		failureRedirect: "/login"
	}), function (req, res) {
		res.redirect("/");
	});

	/**
		* Facebook authentication routes
		*/
	authRouter.get("/facebook", passport.authenticate("facebook", {
		scope: ["email", "user_location"]
	}));

	authRouter.get("/facebook/callback", passport.authenticate("facebook", {
		failureRedirect: "/login"
	}), function (req, res) {
		res.redirect("/");
	});

	/**
		* Twitter authentication routes
		*/
	authRouter.get("/twitter", passport.authenticate("twitter"));

	authRouter.get("/twitter/callback", passport.authenticate("twitter", {
		failureRedirect: "/login"
	}), function (req, res) {
		res.redirect("/");
	});

	/**
		* Github authentication routes
		*/
	authRouter.get("/github", passport.authenticate("github", {
		scope: "user:email"
	}));

	authRouter.get("/github/callback", passport.authenticate("github", {
		failureRedirect: "/login"
	}), function (req, res) {
		res.redirect("/");
	});

	// Add router to app
	app.use("/auth", authRouter);
};
