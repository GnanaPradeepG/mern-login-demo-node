let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('./models/user');

let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

let config = require('./config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 36000 });
};

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = function (req , res , next) {
    if (req.user.isAdmin) {
        next();
    }
    else{
        let err = new Error('You are not authorized to perform this operation contact admin !');
        err.status = 403;
        return next(err);
    }
}

exports.verifySuperAdmin = function (req , res , next) {
    if (req.user.isSuperAdmin) {
        next();
    }
    else{
        let err = new Error('You are not authorized to perform this operation contact super Admin !');
        err.status = 403;
        return next(err);
    }
}

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());