const DEFAULTS = {
  HTTP_RESPONSE_FILTERS: [],
  WHITELISTED_PATHS: ['/'],
  APP_LOG: './logs/dashboard.log',
  ACCESS_LOG: './logs/dashboard-access.log',
  PRODUCTION_LABEL: 'production',
};

module.exports = function config(env) {
  return {
    BITTREX_KEY: env.BITTREX_KEY,
    BINANCE_KEY: {
      API_KEY: env.BINANCE_KEY,
      SECRET_KEY: env.BINANCE_SECRET,
    },
    API_TIMEOUT: parseInt(env.API_TIMEOUT_DURATION, 10),
    API_CLIENT_ID: env.API_CLIENT_ID,
    API_CLIENT_SECRET: env.API_CLIENT_SECRET,
    API_BASE_URL: env.API_BASE_URL,
    MEMCACHED_SERVERS: env.MEMCACHED_SERVERS,
    USER_SOURCE_SYSTEM: env.USER_SOURCE_SYSTEM,
    USER_COOKIE: {
      name: env.USER_COOKIE_NAME,
      duration: parseInt(env.USER_COOKIE_DURATION, 10),
      domain: env.USER_COOKIE_DOMAIN,
    },
    USER_TOKEN_GRANT_TYPE: env.USER_TOKEN_GRANT_TYPE,
    secrets: {
      session: env.SESSION_SECRET,
    },
    sessionOptions: {
      cookie: {
        httpOnly: (env.SESSION_COOKIE_HTTPONLY == 'TRUE'),
        sameSite: (env.SESSION_COOKIE_SAMESITE == 'TRUE'),
        secure: (env.SESSION_COOKIE_SECURE == 'TRUE'),
        maxAge: parseInt(env.SESSION_COOKIE_MAXAGE, 10),
      },
      name: env.SESSION_NAME,
      proxy: true,
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    },
    LOGGER_CONFIG: {
      APP_LOG: (env.NODE_ENV === DEFAULTS.PRODUCTION_LABEL) ? env.APP_LOG : DEFAULTS.APP_LOG,
      ACCESS_LOG: (env.NODE_ENV === DEFAULTS.PRODUCTION_LABEL) ? env.ACCESS_LOG : DEFAULTS.ACCESS_LOG,
      overrideDefaultConsole: true, // Flag to override default console statements
      console: true, // Flag to write to console or not
      file: true, // Flag to write to files
      HTTP_RESPONSE_FILTERS: DEFAULTS.HTTP_RESPONSE_FILTERS, //data to filter out if sensisitve for logging
    },
  };
};
/* eslint-enable eqeqeq */
