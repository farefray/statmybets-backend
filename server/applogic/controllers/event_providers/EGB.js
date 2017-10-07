"use strict";
let axios = require('axios')

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
						//TODO parse bets
						return response.data.bets;
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
