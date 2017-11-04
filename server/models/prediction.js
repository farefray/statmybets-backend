"use strict";

let config    		= require("../config");
let logger    		= require("../core/logger");
let C 				= require("../core/constants");
let fs 				= require("fs");
let path 			= require("path");

let _ 				= require("lodash");
let crypto 			= require("crypto");
let bcrypt 			= require("bcrypt-nodejs");

let db	    		= require("../core/mongo");
let mongoose 		= require("mongoose");
let Schema 			= mongoose.Schema;
let hashids 		= require("../libs/hashids")("users");
let autoIncrement 	= require("mongoose-auto-increment");

let schemaOptions = {
	timestamps: true,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	},
	id: false,
	_id: false
};

let PredictionSchema = new Schema({
	date: {
		type: Number,
		required: true
	},
	stake: {
		type: Number,
		required: true
	},
	status: {
		type: [
			{
				type: String,
				"enum": [
					C.STATUS_WON,
					C.STATUS_LOST,
					C.STATUS_PENDING
				]
			}
		],
		default: [C.STATUS_PENDING]
	},
	final_odds: {
		type: Number,
		default: 1
	},
	selected_events: [
	],
	user_id: {
		type: Number,
		default: 0
	},
}, schemaOptions);

/**
	* Auto increment for `_id`
	*/
PredictionSchema.plugin(autoIncrement.plugin, {
	model: "User",
	startAt: 1
});



let Prediction = mongoose.model("Prediction", PredictionSchema);

module.exports = Prediction;
