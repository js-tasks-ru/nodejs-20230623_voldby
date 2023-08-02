const User = require('../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
  //console.log(strategy, email, displayName);

  if (strategy === 'facebook') {
    done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
    return;
  }

  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  if (!displayName) {
    //Try to get one from the email
    if (email.indexOf('@') > 0) {
        displayName = email.split('@')[0];
    }
    else {
      //There is no valid email
      displayName = 'unknown';
    }
  }

  (async () => {
    try {
      let user = await User.findOne({email: email});

      if (!user) {
          //Create new user
        user = await User.create({
          email: email,
          displayName: displayName
        });
      }

      done(null, user);

    } catch (err) {
      done(err);
    }
  })();
};
