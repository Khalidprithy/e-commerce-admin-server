const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) res.status(403).json("Invalid Token");
            req.user = user;
            next();
        })
    } else {
        return res.status(401).json("Invalid Authentication")
    }
}

const verifyAdmin = (req, res, next) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        next()
    } else {
        res.status(403).json("Not Authorized")
    }
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        verifyAdmin(req, res, next);
    });
};

module.exports = { verifyToken, verifyAdmin, verifyTokenAndAdmin };