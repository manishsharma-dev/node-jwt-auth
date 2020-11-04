const router = require('express').Router();
const verify = require('./verify');
router.get('/',verify, (req, res) => {
    res.json({
        posts: {title:'my first post', desc: 'Access denied'}
    })
})

module.exports = router;
