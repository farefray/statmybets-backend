"use strict";

let pkg 	= require("../../package.json");

module.exports = {
	app: {
	},

	db: {
		uri: "mongodb://root:Mlab1!!@ds113915.mlab.com:13915/bettingstats", //TODO check if thats secure
		options: {
			autoReconnect: true,
			reconnectTries: 1000,
			reconnectInterval: 1000,
			user: "root",
			pass: "Mlab1!!"
		}
	}
};