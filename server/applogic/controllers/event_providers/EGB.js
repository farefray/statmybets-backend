"use strict";
let axios = require('axios')
let _ = require("lodash");
let C = require("../../../core/constants");

module.exports = {
	settings: {
		name: "EGB",
		url: "https://egb.com/bets?st=0&ut=0&f="
	},
	methods: {
		receive(context) {
			console.log(context.service.url);
			return axios.get(context.service.url,
			{
				headers: {
					'cookie': '__cfduid=d2885472421988b4ead0ee433aaacaf491518266727; lang=en; is_first_time=1; referer=; __utmc=173397943; __utmz=173397943.1518266728.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ym_uid=151826672967524582; _ym_isad=1; __zlcmid=kuh6zbsmXTQkIx; currentEvents=[]; onlyAdvantage=false; onlyFutureMatches=false; filters=[]; __utma=173397943.1982640252.1518266728.1518266728.1518293196.2; __utmt=1; __utmb=173397943.1.10.1518293196; cloudflare_uid=K2S8_VdsvzXqZSYvGXAVfnTPSyAu5AUB6qWa4y6c;_egb_session=SEJ3dFVsUUVyR0EvbnBidkIza1ppOGkySTR6eTB5N0NSVDZ4Ui9BaFAvK2ljSFVKbWhyaldBRnIzSWN6TjN2dWhDK1lGekpham5UVFdWUGxPcTVXZ2NLTUZxYkphcnFUQmF3anBTNnAxQU52NDMzQkhLNUFSYlowRnNXMjBLOE5CS25WV3kvUno3MnZuWGFEd3d4MlhxaXJiMTkvQWNDbmlSbTRuaFFuTStRZGZzR1RXVVdseGQ2MXAyOEpxYXUvLS1NU3pKbUh6SFB4UHVWU2ltVkljd3hRPT0%3D--6c415f49546b2e57dd0210a8ba9223a449a7a431',
					'x-newrelic-id':'VQ4FV19XCRAJUlVVAQAEVw==',
					'accept-language':'en-US,en;q=0.9,ru;q=0.8,uk;q=0.7',
					'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36',
					'accept': 'application/json, text/javascript, */*; q=0.01',
					'cache-control':'no-cache',
					'authority':'egb.com',
					'x-requested-with':'XMLHttpRequest',
					'referer': 'https://egb.com/'
				},
			})
				.then(function (response) {
					if (response && response.data && response.data.bets) {
						let events = [];

						_.forIn(response.data.bets, (bet) => {

							let event = {
								date: parseInt(+bet.date * 1000),
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

							if (event.team_A.name.indexOf("(") < 0 && (bet.live === false || bet.live === 'false')) {
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
