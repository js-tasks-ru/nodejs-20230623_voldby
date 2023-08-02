const VkontakteStrategy = require('passport-vkontakte').Strategy;
const config = require('../../config');
const authenticate = require('./authenticate');

module.exports = new VkontakteStrategy({
  clientID: config.providers.vkontakte.app_id,
  clientSecret: config.providers.vkontakte.app_secret,
  callbackURL: config.providers.vkontakte.callback_uri,
  apiVersion: '5.131',
  scope: ['email'],
  response_type: "code",
  session: false,
}, function(accessToken, refreshToken, params, profile, done) {
  //console.log(accessToken, refreshToken, params, profile);

  authenticate('vkontakte', params.email, profile.displayName, done);
});
