/**
 * Attaches common HTTP headers to all the backend API calls
 *
 */
/* eslint-disable no-param-reassign */

/* TODO: Some of the headers used below are only for demonstration purpose of auth. 
 * Will undergo modifications in the future.
 */
module.exports = {
  /**
   * Attaches common HTTP headers
   */
  generateHTTPHeaders(config) {
    return function generateHTTPHeaders(req, res, next) {
      const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      req.httpHeaders = {
        Accept: 'application/json',
        client_ip: clientIP,
        session_id: req.session.id,
        'User-Source-System': config.USER_SOURCE_SYSTEM,
        'Content-Type': 'application/json',
        'X-Correlation-Id': req.id,
      };

      req.httpTimeout = config.API_TIMEOUT;
      res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      next();
    };
  },
  /**
   * Attaches client token to HTTP header
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Next middleware in the chain
   */
  attachClientTokenToHTTPHeaders: (req, res, next) => {
    if (typeof req.session.clientToken !== 'undefined') {
      req.httpHeaders.Authorization = `bearer ${req.session.clientToken.token.access_token}`;
    }
    next();
  },
};
/* eslint-enable no-param-reassign */
