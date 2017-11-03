"use strict";

let config 			= require("../config");
let logger 			= require("../core/logger");
let response = require("../core/response");
let Prediction 		= require("../models/prediction");

module.exports = function(app, db) {
	app.post("/predictions/store", (req, res, next) => {
		let prediction = new Prediction({
			date: req.body.date,
			final_odds: req.body.final_odds,
			selected_events: req.body.selected_events,
			user_id: req.body.user_id
		});

		console.log(prediction)
		console.log(req.body)
		console.log('inside');

		prediction.save(function(err, result) {
			console.log(result)
			if (err) {
				console.log(err)
				return response.json(res, err.msg, response.BAD_REQUEST);
			}

			return response.json(res, response.OK.message, response.OK);
		});
	});
};
