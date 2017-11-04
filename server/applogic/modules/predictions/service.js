"use strict";

let logger 		= require("../../../core/logger");
let config 		= require("../../../config");
let C 	 		= require("../../../core/constants");

let _			= require("lodash");

let _Prediction 		= require("./models/prediction");

module.exports = {
	settings: {
		name: "predictions",
		version: 1,
		namespace: "predictions",
		internal: false, //TODO
		rest: true,
		ws: false,
		graphql: false,
		permission: C.PERM_PUBLIC, // TODO PERM_LOGGEDIN,
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

				/*if (ctx.params.filter == "my")
					filter.author = ctx.user.id;
				else if (ctx.params.author != null) {
					filter.author = this.personService.decodeID(ctx.params.author);
				}*/

				let query = _Prediction.find(filter);

				return ctx.queryPageSort(query).exec().then( (docs) => {
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
					user_id: ctx.params.suser_id
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

				return this.collection.findById(ctx.ID).exec()
				.then((doc) => {
					if (ctx.params.odds_1 !== null) {
						doc.odds_1 = ctx.params.odds_1;
					}

					if (ctx.params.odds_2 !== null) {
						doc.odds_2 = ctx.params.odds_2;
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
			permission: C.PERM_OWNER,
			handler(ctx) {
				ctx.assertModelIsExist(ctx.t("app:BetNotFound"));

				return _Prediction.remove({ _id: ctx.ID })
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
			ctx.assertModelIsExist(ctx.t("app:PostNotFound"));

			if (ctx.model.author.code == ctx.user.code || ctx.isAdmin())
				resolve();
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
