"use strict";

let logger 		= require("../../../core/logger");
let config 		= require("../../../config");
let C 	 		= require("../../../core/constants");

let _			= require("lodash");

let _Event 		= require("./models/event");

module.exports = {
	settings: {
		name: "events",
		version: 1,
		namespace: "events",
		internal: false, //TODO
		rest: true,
		ws: false,
		graphql: true,
		permission: C.PERM_PUBLIC, // TODO PERM_LOGGEDIN,
		role: "user", //TODO
		collection: _Event,
		modelPropFilter: null,
		modelPopulates: null
	},

	actions: {
		find: {
			cache: false, //TODO
			handler(ctx) {
				let filter = {};

				if (ctx.params.discipline !== undefined) {
					filter.discipline = ctx.params.discipline;
				}

				if (ctx.params.game && ctx.params.game.length) {
					filter.game = {
						$in: ctx.params.game
					};
				}

				filter.date = {
					$gt: ctx.params.since,
					$lt: ctx.params.until
				}

				console.log(filter);
				let query = _Event.find(filter);
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
				ctx.assertModelIsExist(ctx.t("app:BetNotFound"));

				return _Event.findByIdAndUpdate(ctx.ID, { $inc: { views: 1 } }).exec().then( (doc) => {
					return this.toJSON(doc);
				})
				.then((json) => {
					return this.populateModels(json);
				});
			}
		},

		create: {
			handler(ctx) {
				console.log(ctx.params)
				this.validateParams(ctx, true);
				let event = new _Event(ctx.params.event);
				event.source = [C.SOURCE_MANUAL];
				console.log(event);
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

				return _Event.remove({ _id: ctx.ID })
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
	},

	graphql: {

		query: `
			events(limit: Int, offset: Int, sort: String): [_Event]
			event(ID: String): _Event
		`,

		types: `
			type _Event {
				id: String!
				game: String
				game_league: String
				odds_1: Int
				odds_2: Int,
				odds_draw: Int,
				date: Timestamp!,
				source: String,
				verified: Boolean,
				team_A: String!,
				flagA: String,
				exA: String,
				team_B: String!,
				flag_B: String,
				ex_B: String
			}
		`,

		mutation: `
			eventCreate(ID: String!, team_A: String!, team_B: String!, date: Timestamp!): _Event
			eventUpdate(ID: String!, team_A: String!, team_B: String!, date: Timestamp!): _Event
			eventRemove(ID: String!): _Event
		`,

		resolvers: {
			Query: {
				events: "find",
				event: "get"
			},

			Mutation: {
				postCreate: "create",
				postUpdate: "update",
				postRemove: "remove"
			}
		}
	}

};

/*
## GraphiQL test ##

# Find all posts
query getPosts {
  posts(sort: "-createdAt -votes", limit: 3) {
    ...postFields
  }
}

# Create a new post
mutation createPost {
  postCreate(title: "New post", content: "New post content") {
    ...postFields
  }
}

# Get a post
query getPost($code: String!) {
  post(code: $code) {
    ...postFields
  }
}

# Update an existing post
mutation updatePost($code: String!) {
  postUpdate(code: $code, content: "Modified post content") {
    ...postFields
  }
}

# vote the post
mutation votePost($code: String!) {
  postVote(code: $code) {
    ...postFields
  }
}

# unvote the post
mutation unVotePost($code: String!) {
  postUnvote(code: $code) {
    ...postFields
  }
}

# Remove a post
mutation removePost($code: String!) {
  postRemove(code: $code) {
    ...postFields
  }
}



fragment postFields on Post {
    code
    title
    content
    author {
      code
      fullName
      username
      avatar
    }
    views
    votes
  	voters {
  	  code
  	  fullName
  	  username
  	  avatar
  	}
}

*/
