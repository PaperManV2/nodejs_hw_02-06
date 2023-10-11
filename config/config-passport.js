const userSchema = require("../services/schemas/users");
const passport = require("passport");
const passportJWT = require("passport-jwt");
require("dotenv").config();
const secret = process.env.SECRET_KEY;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};
passport.use(
  "jwt",
  new Strategy(params, function (payload, done) {
    userSchema
      .find({ _id: payload.id })
      .then(([user]) => {
        if (!user) {
          return done(new Error("User not found"));
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: {
          user,
          err,
        },
      });
    }
    req.user = user;

    next();
  })(req, res, next);
};

module.exports = auth;
