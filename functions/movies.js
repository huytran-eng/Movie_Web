const express = require('express')
const router = express.Router({ mergeParams: true })
const axios = require('axios')
const con = require('../mysql_con')
const e = require('connect-flash')

module.exports.home = async (req, res) => {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`
    const response = await axios.get(url)
    const movies = response.data.results
    res.render('movie/home', { movies })
}
module.exports.find = async (req, res) => {
    const query = req.query.result
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=` + query
    const response = await axios.get(url)
    const movies = response.data.results
    res.render('movie/result', { movies })
}
module.exports.findOne = async (req, res) => {
    req.session.returnTo = req.originalUrl
    const id = req.params.id
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.API_KEY}`;
    const response = await axios.get(url)
    const movie = response.data
    const query = 'SELECT c.text,u.username,c.user_id,c.comment_id FROM comments c JOIN users u ON u.user_id = c.user_id WHERE c.movie_id = ? '
    con.query(query, [id],
        (error, results, fields) => {
            res.render('movie/show', { movie, results })
        });
}

module.exports.watched = (req, res) => {
    const user_id = req.session.user.user_id
    const movie_id = req.params.id
    con.query('SELECT * FROM user_and_movies WHERE user_id= ? AND movie_id = ? ', [user_id, movie_id],
        (error, results, fields) => {
            if (error) throw (error)
            if (results && results.length && results[0].status == 'favorite') {
                req.flash('error', 'Phim nam trong muc yeu thich')
                res.redirect(`/movies/${movie_id}`)
            }
            else {
                con.query('INSERT INTO user_and_movies(user_id,movie_id,status) VALUES("' + user_id + '", "' + movie_id + '", "watched")',
                    (error, results, fields) => {
                        req.flash('success', 'Them vao da xem')
                        res.redirect(`/movies/${movie_id}`)
                    }
                )
            }
        }
    )
}
module.exports.favorite = (req, res) => {
    const user_id = req.session.user.user_id
    const movie_id = req.params.id
    con.query('INSERT INTO user_and_movies(user_id,movie_id,status) VALUES("' + user_id + '", "' + movie_id + '", "favorite")  ON DUPLICATE KEY UPDATE status="favorite"',
        (error, results, fields) => {
            req.flash('success', 'Them vao yeu thich')
            res.redirect(`/movies/${movie_id}`)
        }
    )
}
module.exports.deleteFav = (req, res) => {
    const user_id = req.session.user.user_id
    const movie_id = req.params.id
    con.query('UPDATE user_and_movies SET status="watched" WHERE user_id= ? AND movie_id=?', [user_id, movie_id],
        (error, results, fields) => {
            req.flash('error', 'Xoa khoi yeu thich')
            res.redirect(`/user/${user_id}`)
        }
    )
}

module.exports.comment = (req, res) => {
    const user_id = req.session.user.user_id
    const movie_id = req.params.id
    const comment = req.body.comments
    con.query('INSERT INTO comments(user_id,movie_id,text) VALUES("' + user_id + '", "' + movie_id + '", "' + comment + '")',
        (error, results, fields) => {
            req.flash('success', 'Da them binh luan')
            res.redirect(`/movies/${movie_id}`)
        }
    );
}
module.exports.delComment = (req, res) => {
    movie_id = req.params.id
    comment_id = req.params.cId
    const sql = "DELETE FROM comments WHERE comment_id = ? AND user_id=?";
    con.query(sql, [comment_id, req.session.user.user_id],
        (error, result, fields) => {
            if (error) throw error;
            if (!result.affectedRows) req.flash('error', 'Khong the xoa')
            else req.flash('success', 'Da xoa binh luan')
            res.redirect(`/movies/${movie_id}`)
        })
}
