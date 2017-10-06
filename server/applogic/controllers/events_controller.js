"use strict";

// let ROOT 			= "../../";
let logger 			= require("../../core/logger");
let config 			= require("../../config");

let _ 				= require("lodash");
let	path 			= require("path");
let chalk 			= require("chalk");

let _Event 			= require("../.././models/event");
let Event_Provider = require("../../core/event_provider");

/* global WEBPACK_BUNDLE */
if (!WEBPACK_BUNDLE) require("require-webpack-compat")(module, require);

let Event_Controller = {
	providers: {},
	constructor() {
		this.providers = {};
	},

	init() {
		let self = this;
		logger.info(chalk.bold("Initializing Events controller..."));

		let addProvider = function(schema) {
			let provider = new Event_Provider(schema);
			self.providers[provider.name] = provider;
		};

		let providers = require.context("./event_providers", true, /\.js$/);
		if (providers) {
			providers.keys().map(function(module) {
				logger.info("  Load", path.relative(path.join(__dirname, "..", "event_providers"), module), "event provider...");
				addProvider(providers(module));
			});
		}
	},
	forceReload() {
		console.log('im in controller. reloading');
		// TODO promise async await anything like this
		let bets = this.providers["EGB"].receive(); // TODO iterate all providers
		console.log(bets);
	}
};

module.exports = Event_Controller;
