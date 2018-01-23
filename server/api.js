const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

// var id = setInterval(function () {
//   util.puts('Count is ' + count + '. Incrementing now.');
//   count++;
// }, 1000);

// router.use('/auth', authHelper.localAuthenticationRouter);

// Logging out the user using req.logOut API from Passport and clear's the user cookie
// router.get('/logout', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.clearCookie(req.app.locals.config.USER_COOKIE.name);
//     req.logout();
//   }
//   // TODO: send a better message here
//   res.status(200).send({ message: 'logged out successfully' });
// });

module.exports = router;
