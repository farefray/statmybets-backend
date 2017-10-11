"use strict";
let axios = require('axios')
let _ 				= require("lodash");
let C 				= require("../../../core/constants");

module.exports = {
	settings: {
		name: "EGB",
		url: "https://egb.com/bets?st=0&ut=0&f="
	},
	methods: {
		receive(context) {
			console.log(context.service.url);
			return axios.get(context.service.url)
				.then(function (response) {
					if(response && response.data && response.data.bets) {
						let events = [];
						_.forIn(response.data.bets, (bet) => {
							let event = {
								id: bet.id,
								date: bet.date,
								game: bet.game,
								game_league: bet.tourn,
								odds_1: bet.coef_1,
								odds_2: bet.coef_2,
								odds_draw: bet.coef_draw,
								team_A: {
									name: bet.gamer_1.nick,
									flag: bet.gamer_1.flag,
									ex: ""
								},
								team_B: {
									name: bet.gamer_2.nick,
									flag: bet.gamer_2.flag,
									ex: ""
								},
								source: C.SOURCE_EGB,
								verified: true
							};

							if(event.team_A.name.indexOf("(") < 0) {
								// Exclude subbets like (Map 1)
                                events.push(event);
                            }
						});

						return events;
					}

					return false;
				})
				.catch(function (error) {
					console.log(error);
					return false;
				});
		}
	}
}
