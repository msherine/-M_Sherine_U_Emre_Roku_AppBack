// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./index');
// var usersRouter = require('./users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;



const express = require('express');
const router = express.Router();
const sql = require('mysql');
const creds = require('../config/user');

// create the sql connection pool
var pool = sql.createPool(creds);

router.get('/', (req, res) => {
  res.json({ message: 'hit the main ums route' });
})

// try our login route - set it up and send back the message
router.post('/login', (req, res) => {
  console.log('Hit the login route.');
  console.log(req.body);

  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    // Use the connection to validate that this user exists in the database
    connection.query(`SELECT username, password FROM users WHERE username="${req.body.username}"`, function (error, results) {
      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) throw error;
      console.log('the user data:', results, results.length);

      if (results.length == 0) {
        // user does not exist
        res.json({ message: 'no user' });
      } else if (results[0].password !== req.body.password) {
        res.json({ message: 'wrong password' });
      } else {
        res.json({ message: 'success', user: results[0] });
      }

      // // Don't use the connection here, it has been returned to the pool.
      // res.json(results);
    });
  });

  // res.json({message: 'hit the login route.'});

})

router.get('/users', (req, res) => {
  // try to query the database and get all of the users
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    // Use the connection
    connection.query('SELECT * FROM users', function (error, results) {
      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) throw error;

      results.forEach(user => {
        delete user.fname;
        delete user.lname;
        delete user.password;

        if (user.avatar == "default") {
          user.avatar = 'temp_avatar.jpg'
        }
      })

      // Don't use the connection here, it has been returned to the pool.
      res.json(results);
    });
  });
  // end pool query
})

// get one user with this route
router.get('/users/:user', (req, res) => {
  // try to query the database and get all of the users
  // this is the user ID:
  console.log(req.params.user);

  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    // Use the connection
    connection.query(`SELECT * FROM users WHERE id=${req.params.user}`, function (error, results) {
      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) throw error;
      //console.log(results);

      results.forEach(user => {
        delete user.fname;
        delete user.lname;
        delete user.password;
      });


      // Don't use the connection here, it has been returned to the pool.
      res.json(results);
    });
  });
  // end pool query
})


// router.get('/users/:user', (req, res) => {
//     res.json({message: 'hit single users route'});
// })

module.exports = router;
