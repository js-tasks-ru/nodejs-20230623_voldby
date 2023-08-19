const GoogleStrategy = require('passport-google-oauth2');
const config = require('../../config');
const authenticate = require('./authenticate');

module.exports = new GoogleStrategy({
  clientID: config.providers.google.app_id,
  clientSecret: config.providers.google.app_secret,
  callbackURL: config.providers.google.callback_uri,
  scope: ['email', 'profile'],
  /*
  Experiments.
  Every passport-google-oauth_XXX module works but does not provide expected user profile data (displayName etc.).
  We have only access token and email here.
   */
  /*profileFields:['email', 'name'],
  session: false,
  enableProof: true
  passReqToCallback: true,*/
}, function(/*req, */accessToken, refreshToken, profile, done) {

  /*console.log(req);
  console.log('---------------------');
  console.log(accessToken);
  console.log('---------------------');
  console.log(refreshToken);
  console.log('---------------------');
  console.log(profile);*/

  authenticate('google', profile.email, profile.displayName, done);
});
