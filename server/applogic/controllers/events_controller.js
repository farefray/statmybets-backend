"use strict";

// let ROOT 			= "../../";
let logger 			= require("../../core/logger");
let config 			= require("../../config");

let _ 				= require("lodash");
let	path 			= require("path");
let chalk 			= require("chalk");

let Context 		= require("../../core/context");
let _Event 			= require("../.././models/event");
let Event_Provider = require("../../core/event_provider");
let response		= require("../../core/response");

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

		let addProvider = function(schema) {
			let provider = new Event_Provider(schema);
			self.providers[provider.name] = provider;
		};

		let providers = require.context("./event_providers", true, /\.js$/);
		if (providers) {
			providers.keys().map(function(module) {
				logger.info("  Loading", path.relative(path.join(__dirname, "..", "event_providers"), module), "event provider...");
				addProvider(providers(module));
                // self.forceReload();
			});
		}
	},
	forceReload() {
		return new Promise((rs, rj) => {
			console.log('im in controller. reloading');
			let self = this;
			_.forIn(self.providers, (provider) => {
				if (_.isFunction(provider.receive)) {

					return new Promise((resolve, reject) => {
						provider.receive(Context.CreateToProviderInit(provider)).then(res => {
							if(res === false) {
                                logger.warn(" Cannot load event provider!");
								return rj(response.BAD_REQUEST);
							}

							const total = res.length;
							let success = 0;
							_.forIn(res, (event) => {
								if(self.createEvent(event)) {
									success++;
								}
							});

                            logger.info("  Loaded ", successs, " from ", total, " events");
							return rs({response: response.OK, totalEvents: total, successEvents: success});
						});
					});
				}
			});
		});
	},
	createEvent(eventInfo) {
		let event = new _Event(eventInfo);
		event.save(function(err, e) {
			if (err && err.code === 11000) {
				return false;
			}

			return true;
		});
	}
};

module.exports = Event_Controller;
