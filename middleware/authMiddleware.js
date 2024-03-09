const jwt = require('jsonwebtoken');
const User = require('../models/user')

const routeAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // let's verify token existed.
    if (token) {
        //verify token isValid
        jwt.verify(token, 'the net ninja', (err, decodedToken) => {
            if (err) {
                console.log(error);
                res.redirect('/login')
            } else {
                console.log(decodedToken)
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    // let's verify token existed.
    if (token) {
        //verify token isValid
        jwt.verify(token, 'the net ninja', async (err, decodedToken) => {
            if (err) {
                console.log(error);
                res.locals.user = null
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next();
            }
        })
    } else {
       res.locals.user = null
       next();
    }
}
module.exports = { routeAuth, checkUser }