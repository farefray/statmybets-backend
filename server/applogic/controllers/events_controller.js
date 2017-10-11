"use strict";

// let ROOT 			= "../../";
let logger = require("../../core/logger");
let config = require("../../config");

let _ = require("lodash");
let path = require("path");
let chalk = require("chalk");

let Context = require("../../core/context");
let _Event = require("../.././models/event");
let Event_Provider = require("../../core/event_provider");
let response = require("../../core/response");
let crypto = require("crypto");
let async = require('async');

/* global WEBPACK_BUNDLE */
if (!WEBPACK_BUNDLE) require("require-webpack-compat")(module, require);

let Event_Controller = {
	providers: {},
	constructor() {
		this.providers = {};
	},

	init() {
		let self = this;
		logger.info();
		logger.info(chalk.bold("Initializing Events controller..."));

		let addProvider = function (schema) {
			let provider = new Event_Provider(schema);
			self.providers[provider.name] = provider;
		};

		let providers = require.context("./event_providers", true, /\.js$/);
		if (providers) {
			providers.keys().map(function (module) {
				logger.info("  Loading", path.relative(path.join(__dirname, "..", "event_providers"), module), "event provider...");
				addProvider(providers(module));
				// self.forceReload();
			});
		}
	},
	forceReload() {
		return new Promise((rs, rj) => {
			let self = this;
			_.forIn(self.providers, (provider) => {
				if (_.isFunction(provider.receive)) {

					return new Promise((resolve, reject) => {
						provider.receive(Context.CreateToProviderInit(provider)).then(res => {
							if (res === false) {
								logger.warn(" Cannot load event provider!");
								return rj(response.BAD_REQUEST);
							}

							const total = res.length;
							let success = 0;
							async.eachSeries(res, function(event, callback) {
								event._id = crypto.createHash("sha256").update((event.date + event.team_A.name + event.team_B.name), "utf8").digest("hex");
								let _event = new _Event(event);
								_event.save(function (error) {
									console.log('Processed bet ' + event._id);
									if(error === null) {
										success++;
									}
									callback(null);
								});
							}, function(err) {
								logger.info("  Loaded ", success, " from ", total, " events");
								return rs({response: response.OK, totalEvents: total, successEvents: success});
							});
						});
					});
				}
			});
		});
	}
};

module.exports = Event_Controller;
