/* eslint consistent-return:0 */

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const MemcachedStore = require('connect-memcached')(session);
const argv = require('minimist')(process.argv.slice(2));
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const dotenv = require('dotenv').config();

// app dependencies
const api = require('./api');
const httpHeaders = require('./headers');
const logger = require('./logger');
const reactenv = require('./env');

// const binance = require('./binance_official');
const indicators = require('./indicators');
// const setup = require('./middlewares/frontendMiddleware');

const app = express();

// Retrieve formatted server config object with merged defaults and environment specific process.env variables
const config = require('./config')(process.env);
// PLEASE NOTE: Cloning the local config object into app.locals.config for accessing them from within our private NODE APIs
// For now, we are using them in pspr-web-auth and pspr-web-tokens
app.locals.config = Object.assign({}, config);

/* Returns middleware that only parses json. */
app.use(bodyParser.json());

/* Returns middleware that only parses urlencoded bodies. */
app.use(bodyParser.urlencoded({
  extended: false,
}));

// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
app.use(methodOverride());

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser(config.secrets.session));

// Attaches common HTTP headers for any backend API calls
app.use(httpHeaders.generateHTTPHeaders(config));

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use('/api', api);
// reactenv(app, {
//   BASE_URL: process.env.BASE_URL,
//   AGENT_PORTAL: process.env.AGENT_PORTAL,
//   STORY_BOOK: process.env.STORY_BOOK,
// });

// In production we need to pass these values in instead of relying on webpack
// setup(app, {
//   outputPath: resolve(process.cwd(), 'build'),
//   publicPath: '/',
// });

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// const port = argv.port || process.env.PORT || 3002;
//
// // Start your app.
// app.listen(port, host, (err) => {
//   if (err) {
//     return logger.error(err.message);
//   }
//
//   // Connect to ngrok in dev mode
//   if (ngrok) {
//     ngrok.connect(port, (innerErr, url) => {
//       if (innerErr) {
//         return logger.error(innerErr);
//       }
//
//       logger.appStarted(port, prettyHost, url);
//     });
//   } else {
//     logger.appStarted(port, prettyHost);
//   }
// });
