# Vue, Express, MongoDB

<img src="http://vuejs.org/images/logo.png" height="50"> <img src="https://coligo.io/images/express.svg" height="50"> <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/45/MongoDB-Logo.svg/527px-MongoDB-Logo.svg.png" height="50"> <img src="https://worldvectorlogo.com/logos/nodejs-icon.svg" height="50"> <img src="https://camo.githubusercontent.com/66747a6e05a799aec9c6e04a3e721ca567748e8b/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313336353838312f313931383337332f32653035373166612d376462632d313165332d383436352d3839356632393164343366652e706e67" height="50">

[![Known Vulnerabilities](https://snyk.io/test/github/icebob/vue-express-mongo-boilerplate/badge.svg)](https://snyk.io/test/github/icebob/vue-express-mongo-boilerplate)
![Node 6](https://img.shields.io/badge/node-6.x.x-green.svg)
![VueJS 2](https://img.shields.io/badge/vuejs-2.3.x-green.svg)
![Webpack 2](https://img.shields.io/badge/webpack-2.6.x-green.svg)
[![Trace](https://resources.risingstack.com/Monitored+with+Trace+by+RisingStack.svg)](https://trace.risingstack.com/?utm_source=opensource&utm_medium=Icebob)

* [x] **[Node.JS](https://nodejs.org)** v6.x.x
* [x] **[Express](https://github.com/expressjs/express)**
* [x] [MongoDB](https://www.mongodb.com/) with [Mongoose](https://github.com/Automattic/mongoose)
* [x] [NodeMailer](https://github.com/nodemailer/nodemailer) with SMTP, MailGun or SendGrid
* [x] [Helmet](https://github.com/helmetjs/helmet)
* [x] [Express-validator](https://github.com/ctavan/express-validator)
* [x] [winston](https://github.com/winstonjs/winston) + 6 transports
* [x] **[GraphQL](http://graphql.org/)** with [Apollo stack](http://www.apollostack.com/)
* [x] [i18next](http://i18next.com/) as the internationalization ecosystem
* [x] **[HTTP/2 Server Push](https://en.wikipedia.org/wiki/HTTP/2_Server_Push)** with [netjet](https://github.com/cloudflare/netjet)
* [x] Bundled server-side code with [Webpack 2](https://webpack.github.io/)

**Supported remote logging services**
* [x] [Papertrail](https://papertrailapp.com/)
* [x] [Graylog](https://www.graylog.org/)
* [x] [LogEntries](https://logentries.com/)
* [x] [Loggly](https://www.loggly.com/)
* [x] [Logsene](https://sematext.com/logsene/)
* [x] [Logz.io](http://logz.io/)

Building the images for the first time
```
$ docker-compose build
```

Starting the images
```
$ docker-compose up
```

## Bundled server-side

`npm run build && npm run build:server`
It if was success, run the server: `npm run start:bundle`

If you want to export bundled version copy these folders & files to the new place:

```txt
- server
	- locales
	- public
	- views
	- bundle.js
- package.json
- config.js (optional)
```

Install production dependencies with npm: `npm install --production`

## License

Available under the [MIT license](https://tldrlegal.com/license/mit-license).
