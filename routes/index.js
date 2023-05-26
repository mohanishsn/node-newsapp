const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

// router.get('/', (req, res) => {
//   // returns array of items
//   db.any('SELECT articleid, title, body, datecreated FROM articles')
//   .then((articles) => {
//     res.render('index', {articles: articles})
//   })
// })

// async await func
router.get('/', async (req, res) => {
  // returns array of items
  let articles = await db.any('SELECT articleid, title, body, datecreated FROM articles')
  res.render('index', {articles: articles})
})

router.get('/hello', (req, res) => {
  res.send('Hello')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  let username = req.body.username
  let password = req.body.password

  db.oneOrNone('SELECT userid, username, password FROM users WHERE username = $1', [username]).then((user) => {
    if (user) {
      // check for password
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          // password matches. put username and userid in the session
          if (req.session) {
            req.session.user = {userId: user.userid, username: username}
          }
          res.redirect('users/articles')
        } else {
          // password is invalid
          res.render('login', {message: 'Invalid username or password'})
        }
      })
    } else {
      // username is invalid
      res.render('login', {message: 'User does not exist'})
    }
  })
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  let username = req.body.username
  let password = req.body.password

  db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username]).then((user) => {
    if (user) {
      res.render('register', {message: 'User already exists'})
    } else {
      // insert user into db
      bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
        if (err == null) {
          db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, hash]).then(() => {
            res.send('SUCCESS')
          })
        }
      })
    }
  })
})

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy()
    res.redirect('/login')
  } else {
    res.redirect('/login')
  }
})

module.exports = router