const { verifyToken, verifyAdmin } = require('./verifyToken');

const router = require('express').Router();

router.put("/:id", verifyAdmin, (req, res) => {

})

module.exports = router