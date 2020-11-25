const fs = require('fs');
const jwt = require('jsonwebtoken');

var privateKEY = fs.readFileSync('.backend/jwt/private_jwtRS256.key', 'utf8');
var publicKEY = fs.readFileSync('./src/jwt/public_jwtRS256.key', 'utf8');

module.exports = {
    sign: (payload, $Options) => {

        var signOptions = {
            issuer: $Options.issuer,
            subject: $Options.subject,
            audience: $Options.audience,
            expiresIn: "12h",
            algorithm: "RS256"
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },
    verify: (token, $Option) => {

        var verifyOptions = {
            issuer: $Option.issuer,
            subject: $Option.subject,
            audience: $Option.audience,
            expiresIn: "3h",
            algorithm: ["RS256"]
        };
        try {
            return jwt.verify(token, publicKEY, verifyOptions);
        } catch (err) {
            return false;
        }
    },
    decode: (token) => {
        return jwt.decode(token, { complete: true });
    }
}