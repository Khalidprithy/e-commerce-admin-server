const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (!authHeader) {
        return res.status(401).send({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    // console.log(token)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).send({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    next();
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        verifyAdmin(req, res, next);
    });
};

module.exports = { verifyToken, verifyAdmin, verifyTokenAndAdmin };
