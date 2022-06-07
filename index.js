const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const axios = require('axios')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const movieRoute = require('./routes/movies')
const userRoute = require('./routes/users')
const flash = require('connect-flash')
const ExpressError = require('./error_handling/expressErrors')
require('dotenv').config()

const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    res.locals.currentUser = req.session.user
    next();
})
app.use('/', userRoute)
app.use('/movies', movieRoute)
app.get('/', (req, res) => {
    res.render('home')
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Khong Tim Thay', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Oh No, Something Went Wrong!' } = err;
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Tai port 3000')
})