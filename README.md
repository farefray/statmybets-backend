# Backend

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
