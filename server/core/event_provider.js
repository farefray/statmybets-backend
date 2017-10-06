"use strict";

let logger 		= require("./logger");
let config 		= require("../config");
let C 	 		= require("./constants");

let _			= require("lodash");
let hash		= require("object-hash");

let warn = function(msg) {
	logger.warn("[Event_Provider warn]: " + msg);
};

let exception = function(msg) {
	throw new Error("[Event_Provider warn]: " + msg);
};

class Event_Provider {

	/**
		* Creates an instance of Event_Provider.
		*
		* @param {any} schema
		* @param {any} app
		* @param {any} db
		*
		* @memberOf Service
		*/

	constructor(schema) {
		let self = this;
		schema = schema || {};
		self.$schema = schema;

		if (!schema.settings) {
			exception(`No settings of events provider '${self.name}'! Please create a settings object in service schema!`);
		}

		self.$settings = schema.settings;

		// Common properties
		self.name = schema.settings.name;
		self.url = schema.settings.url;

		// Assert properties
		if (!self.name) {
			exception(`No name of events provider '${self.name}'! Please set in settings of events provider schema!`);
		}

		// Handle methods
		if (schema.methods && _.isObject(schema.methods)) {
			_.forIn(schema.methods, (method, name) => {
				self[name] = method.bind(self);
			});
		}

	}
}

module.exports = Event_Provider;
