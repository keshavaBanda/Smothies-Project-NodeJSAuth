const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { routeAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser())

app.use((req, res, next) => {
  // console.log(req.url, req.method)
  next()
})

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/smothies-data';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log("ERROR ",err));

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', routeAuth, (req, res) => res.render('smoothies'));
app.use(authRoute)

// //cookies

// app.get('/set-cookies', (req, res) => {
//   // res.setHeader('set-cookie','newUser=true');
//   res.cookie('newUser', 'false');
//   res.cookie('isEmployee', 'true', { maxAge: 1000 * 60 * 60 * 24 , httpOnly: true})
//   res.send('set-cookies')
// })

// app.get('/get-cookies',(req, res)=>{
//   const cookies = req.cookies
//   console.log(cookies);
//   res.json(cookies)
// })
