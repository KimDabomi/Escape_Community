const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const modelUsers = require('../models/modelUsers');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await modelUsers.findOne({ _id: id });
      done(null, user);
  } catch (err) {
      done(err);
  }
});


// local strategy
passport.use('local-login',
  new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    async function(req, username, password, done) {
      const oUser = await modelUsers.findOne({username:username}).select({password:1});
      if (oUser && oUser.authenticate(password)){
        return done(null, oUser);
      }
      else {
        req.flash('username', username);
        req.flash('errors', {login:'The username or password is incorrect.'});
        return done(null, false);
      }
    }
  )
);

module.exports = passport;
