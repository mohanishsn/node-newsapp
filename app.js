const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const pgp = require('pg-promise')()
const session = require('express-session')
const path = require('path')
const checkAutorization = require('./utils/authorization')

const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')

const PORT = process.env.PORT || 8080
// const CONNECTION_STRING = "postgres://localhost:5432/newsdb"
const CONNECTION_STRING = "postgres://newsdb_uaw4_user:FnY2bbvAd4ocbdazajoOnejkdLs3WCwz@dpg-chografdvk4goeofm7ig-a.oregon-postgres.render.com/newsdb_uaw4"
const VIEWS_PATH = path.join(__dirname, '/views')

// configure your view engine
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))

app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')

// using middlewares
app.use(session({
  secret: 'random',
  resave: false,
  saveUninitialized: false
}))

app.use((req, res, next) => {
  res.locals.authenticated = req.session.user ? true : false
  next()
})

app.use(bodyParser.urlencoded({extended: false}))
app.use('/css', express.static('css'))

app.use('/', indexRoutes)
app.use('/users', checkAutorization, userRoutes)

db = pgp(CONNECTION_STRING)

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`)
})
