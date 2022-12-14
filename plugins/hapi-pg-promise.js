'use strict';

/* this is original source
const Hoek = require('hoek');
const PgPromise = require('pg-promise');
*/

const Hoek = require('@hapi/hoek');
const PgPromise = require('pg-promise');
const pkg = require('../package.json');

const DEFAULTS = {
    init: {},
    cn: undefined
};

module.exports = {
  pkg,
  register: async function (server, options) {

      const opts = Hoek.applyToDefaults(DEFAULTS, options);

      const pgp = PgPromise(opts.init);
      const db = pgp(opts.cn);
      server.ext('onPreHandler', (request, h) => {
          request.pgp = pgp
          request.db = db;
          return h.continue;
      });

      server.expose('db', db);

      server.events.on('stop', pgp.end);
  }
};