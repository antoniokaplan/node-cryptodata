const express = require('express');
const resolve = require('path').resolve;
const serialize = require('serialize-javascript');

/**
  * Adds process.env or whatever env vars are passed as an object to a js file accessible at /env.js
  * This can be loaded into the React client application and accessed globally via env.VAR_NAME
*/
const addReactEnv = (app, envVars) => {
  app.use(express.static(resolve(process.cwd(), 'build')));
  app.get('/env.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.send(`window._env = ${serialize(envVars)} ;`);
  });
};

module.exports = (app, options) => {
  addReactEnv(app, options);
  return app;
};
