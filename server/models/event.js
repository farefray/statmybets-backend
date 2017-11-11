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

// get events from api (f.e. https://egb.com/bets?st=0&ut=0&f=) , store in BD
let EventSchema = new Schema({
	_id: {
		// External ID based on API where we took that bet (actually ID + SOURCE is unique pair; maybe it can be done with some constrains)
		type: String,
		index: true,
		required: true,
		unique: true
	},
	date: {
		type: Number,
		required: true
	},
	game: {
		type: String,
		trim: true,
		default: ""
	},
	game_league: {
		type: String,
		trim: true,
		default: ""
	},
	odds_1: {
		type: Number,
		default: 1
	},
	odds_2: {
		type: Number,
		default: 1
	},
	odds_draw: {
		type: Number,
		default: 1
	},
	team_A: {
		name: { type: String, required: true },
		flag: { type: String, default: "" },
		ex: { type: String }
	},
	team_B: {
		name: { type: String, required: true },
		flag: { type: String, default: "" },
		ex: { type: String }
	},
	source: {
		type: [
			{
				type: String,
				"enum": [
					C.SOURCE_EGB,
					C.SOURCE_MANUAL
				]
			}
		],
		default: [C.SOURCE_MANUAL]
	},
	verified: {
		type: Boolean,
		default: false
	},
	user_id: {
		type: Number,
		default: 0
	},
}, schemaOptions);

/**
 * Pick is only some fields of object
 *
 * http://mongoosejs.com/docs/api.html#document_Document-toObject
 *
UserSchema.methods.pick = function(props, model) {
	return _.pick(model || this.toJSON(), props || [
		"code",
		"fullName",
		"email",
		"username",
		"roles",
		"lastLogin",
		"avatar"
	]);
};

UserSchema.method('toJSON', function() {
    var user = this.toObject();
    delete user.salt;
    delete user.hash;
    delete user.__v;
    return user;
  });
*/

let _Event = mongoose.model("Event", EventSchema);

module.exports = _Event;
