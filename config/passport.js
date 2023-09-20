const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const modelUsers = require('../models/modelUsers');

passport.serializeUser((user, done) => {
  console.log("serializeUser에서의 user 객체: ", user);
  done(null, { id: user._id, username: user.username });
});


passport.deserializeUser(async (sessionUser, done) => {
  try {
      const user = await modelUsers.findOne({ _id: sessionUser.id }).select({ username: 1, password: 1 });
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
      const oUser = await modelUsers.findOne({username:username}).select('+password +username');
      console.log("LocalStrategy에서 찾은 사용자: ", oUser);
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
