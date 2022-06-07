
module.exports.isLoggedIn = (req, res, next) => {
    if (req.session.user == null) {
        req.flash('error', 'Chua dang nhap')
        return res.redirect('/login')
    }
    next();
}
