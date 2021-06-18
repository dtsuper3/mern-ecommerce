const expressJwt = require("express-jwt");

function authJwt() {
    const secret = process.env.JWT_SECRET;
    const api_url = process.env.API_URL
    return expressJwt({
        secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
            { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
            { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
            `${api_url}/users/login`,
            `${api_url}/users/register`,
        ]
    });
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true)
    }
    done()
}
module.exports = authJwt