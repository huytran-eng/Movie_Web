const express = require('express')
const router = express.Router({ mergeParams: true })
const user = require('../functions/users')
const catchAsync = require('../error_handling/catchAsync')
const { isLoggedIn } = require('../middleware')



router.get('/user/:id', catchAsync(user.userInfo))
router.get('/register', user.renderRegister)
router.post('/register', catchAsync(user.register2))
router.get('/login', user.renderLogin)
router.post('/login', catchAsync(user.login))
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/movies')
})
module.exports = router