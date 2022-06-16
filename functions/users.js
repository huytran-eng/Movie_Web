const express = require('express')
const router = express.Router({ mergeParams: true })
const bcrypt = require('bcrypt')
const con = require('../mysql_con')
const axios = require('axios')



module.exports.userInfo = async (req, res) => {
    const user_id = req.params.id;
    const [result] = await con.promise().query('SELECT u.user_id,u.username,um.status,um.movie_id FROM users u LEFT JOIN user_and_movies um ON u.user_id=um.user_id WHERE u.user_id=?',
        [user_id])
    console.log(result)
    const isEmpty = Object.keys(result[0]).length === 0;
    if (isEmpty) {
        req.flash('error', "khong tim thay nguoi dung")
        res.redirect('/movies')
        return
    }
    const username = result[0].username
    const fav = []
    const watched = []
    for (l of result) {
        if (l.movie_id) {
            const url = `https://api.themoviedb.org/3/movie/${l.movie_id}?api_key=${process.env.API_KEY}`;
            const response = await axios.get(url)
            const movie = response.data
            if (l.status == 'watched') watched.push(movie);
            else if (l.status == 'favorite') fav.push(movie);
        }
    }
    res.render('user/user', { fav, watched, username, user_id })
}

module.exports.renderRegister = (req, res) => {
    res.render('user/register')
}


module.exports.register = async (req, res) => {
    const { email, username, password } = req.body
    if (!email || !username || !password) {
        req.flash('error', "vui long dien day du thong tin")
        res.redirect('/register');
        return;
    }
    const [result] = await con.promise().query('SELECT * FROM users WHERE email = ? OR username = ? ', [email, username])
    const isEmpty = Object.keys(result[0]).length === 0;
    if (!isEmpty) {
        req.flash('error', "email hoac ten dang nhap da ton tai")
        res.redirect('/register');
        return
    }
    const hash = await bcrypt.hash(password, 12)
    await con.promise().query('INSERT INTO users(email,username, password) VALUES("' + email + '", "' + username + '", "' + hash + '")');
    req.flash('success', "tao tai khoan thanh cong")
    res.redirect('/login')

}
module.exports.renderLogin = (req, res) => {
    res.render('user/login')
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        req.flash('error', "vui long dien day du thong tin")
        res.redirect("/login")
        return;
    }
    const [result] = await con.promise().query('SELECT * FROM users WHERE email = ?', [email])
    console.log(result[0])
    const isEmpty = Object.keys(result[0]).length === 0;
    if (isEmpty) {
        req.flash("error", "sai tai khoan hoac mat khau")
        res.redirect("/login")
        return
    }
    const validPass = await bcrypt.compare(password, result[0].password)
    if (validPass) {
        req.session.user = result[0]
        req.flash('success', "dang nhap thanh cong")
        const sendTo = req.session.returnTo || '/movies'
        delete req.session.returnTo
        res.redirect(sendTo)
        return
    }
    req.flash("error", "sai tai khoan hoac mat khau")
    res.redirect("/login")
    return

}