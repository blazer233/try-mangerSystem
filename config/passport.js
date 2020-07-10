const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const User = require("../models/Users")
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'art';

module.exports = passport => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        let result = await User.findOne({
            _id: jwt_payload.id
        })
        return result ? done(null, result) : done(null, false)
    }));
}
