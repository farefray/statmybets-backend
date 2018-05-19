"use strict";

let logger 		= require("../../../core/logger");
let config 		= require("../../../config");
let C 	 		= require("../../../core/constants");

let _			= require("lodash");

let _Prediction 		= require("./models/prediction");

module.exports = {
	settings: {
		idParamName: "_id",
		name: "predictions",
		version: 1,
		namespace: "predictions",
		internal: false, //TODO
		rest: true,
		ws: false,
		graphql: false,
		permission: C.PERM_LOGGEDIN,
		role: "user", //TODO
		collection: _Prediction,
		modelPropFilter: null,
		modelPopulates: null
	},

	actions: {
		find: {
			cache: false, //TODO
			handler(ctx) {
				let filter = {};				
				if(ctx.params.title && ctx.params.title.length) {
					// search by team name
					const str = ctx.params.title.toLowerCase();
					filter = { $or:[ { selected_events : { $elemMatch : {'team_A.name': new RegExp(str, "i")}}}, { selected_events : { $elemMatch : {'team_B.name': new RegExp(str, "i")}}} ]};
				}

				if(ctx.params.daterange && ctx.params.daterange.length) {
					filter.date = {
						$gt: (new Date(ctx.params.daterange[0]).getTime() / 1000).toFixed(), // Todo fixme
						$lt: (new Date(ctx.params.daterange[1]).getTime() / 1000).toFixed(), // Todo fixme
					};
				}
				
				filter.user_id = ctx.user.id;

				console.log('filter');
				console.log(filter);
				let query = _Prediction.find(filter);

				return ctx.queryPageSort(query).exec().then((docs) => {
					return this.toJSON(docs);
				})
				.then((json) => {
					return this.populateModels(json);
				});
			}
		},

		// return a model by ID
		get: {
			cache: true, // if true, we don't increment the views!
			permission: C.PERM_PUBLIC,
			handler(ctx) {
				ctx.assertModelIsExist(ctx.t("app:PredictionNotFound"));

				return _Prediction.findByIdAndUpdate(ctx.ID, { $inc: { views: 1 } }).exec().then( (doc) => {
					return this.toJSON(doc);
				})
				.then((json) => {
					return this.populateModels(json);
				});
			}
		},

		create: {
			handler(ctx) {
				this.validateParams(ctx, true);
				let event = new _Prediction({
					date: ctx.params.date,
					stake: ctx.params.stake,
					status: ctx.params.status,
					final_odds: ctx.params.final_odds,
					selected_events: ctx.params.selected_events,
					user_id: ctx.params.user_id,
					categories: ctx.params.categories
				});

				return event.save()
				.then((doc) => {
					return this.toJSON(doc);
				})
				.then((json) => {
					return this.populateModels(json);
				})
				.then((json) => {
					this.notifyModelChanges(ctx, "created", json);
					return json;
				});
			}
		},

		update: {
			permission: C.PERM_OWNER,
			handler(ctx) {
				ctx.assertModelIsExist(ctx.t("app:PostNotFound"));
				this.validateParams(ctx);
				return this.collection.findById(ctx.params._id).exec()
				.then((doc) => {
					if (ctx.params.status) {
						doc.status = ctx.params.status;
					}

					if (ctx.params.final_odds) {
						doc.status = ctx.params.final_odds;
					}

					if (ctx.params.date) {
						doc.status = ctx.params.date;
					}

					if (ctx.params.stake) {
						doc.status = ctx.params.stake;
					}

					return doc.save();
				})
				.then((doc) => {
					return this.toJSON(doc);
				})
				.then((json) => {
					return this.populateModels(json);
				})
				.then((json) => {
					this.notifyModelChanges(ctx, "updated", json);
					return json;
				});
			}
		},

		remove: {
			permission: C.PERM_OWNER, // ToDo test if ownership works for removing.
			handler(ctx) {
				ctx.assertModelIsExist(ctx.t("app:BetNotFound"));

				return _Prediction.remove({ _id: ctx.model._id })
				.then(() => {
					return ctx.model;
				})
				.then((json) => {
					this.notifyModelChanges(ctx, "removed", json);
					return json;
				});
			}
		},
	},

	methods: {
		/**
		 * Validate params of context.
		 * We will call it in `create` and `update` actions
		 *
		 * @param {Context} ctx 			context of request
		 * @param {boolean} strictMode 		strictMode. If true, need to exists the required parameters
		 */
		validateParams(ctx, strictMode) {
			// TODO
			/*if (strictMode || ctx.hasParam("title"))
				ctx.validateParam("title").trim().notEmpty(ctx.t("app:PostTitleCannotBeEmpty")).end();

			if (strictMode || ctx.hasParam("content"))
				ctx.validateParam("content").trim().notEmpty(ctx.t("app:PostContentCannotBeEmpty")).end();*/

			if (ctx.hasValidationErrors())
				throw ctx.errorBadRequest(C.ERR_VALIDATION_ERROR, ctx.validationErrors);
		}

	},

	/**
	 * Check the owner of model
	 *
	 * @param {any} ctx	Context of request
	 * @returns	{Promise}
	 */
	ownerChecker(ctx) {
		return new Promise((resolve, reject) => {
			console.log('checking module');
			ctx.assertModelIsExist(ctx.t("app:NotFound"));
			console.log(ctx.model.user_id);
			console.log(ctx.user.id);
			if (ctx.model.user_id == ctx.user.id) {
				console.log('resolve');
				resolve();
			}
			else
				reject();
		});
	},

	init(ctx) {
		// Fired when start the service
		//this.personService = ctx.services("persons");


	},

	socket: {
		afterConnection(socket, io) {
			// Fired when a new client connected via websocket
		}
	}

};
