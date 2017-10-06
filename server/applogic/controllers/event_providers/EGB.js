"use strict";
let axios = require('axios')

module.exports = {
	settings: {
		name: "EGB",
		url: "https://egb.com/bets?st=0&ut=0&f="
	},
	methods: {
		receive() {
			console.log(this);
			axios.get(this.url, {})
				.then(function (response) {
					return response;
				})
				.catch(function (error) {
					console.log(error);
				});
		}
	}
}
