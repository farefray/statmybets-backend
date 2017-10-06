"use strict";

let config 			= require("../config");
let logger 			= require("../core/logger");

let Event_Controller = require("../applogic/controllers/events_controller");
module.exports = function(app, db) {
	Event_Controller.init();
	app.get("/forceLoad", (req, res) => {
		Event_Controller.forceReload();
		res.sendStatus(200);
	});

};
