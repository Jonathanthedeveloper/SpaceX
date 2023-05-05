const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');



const rootRoute = require('./routes/rootRoute.route');
const notFoundRoute = require('./routes/notfound.route')


const app = express();



// configurations
app.set("view engine", "ejs");

if (process.env.NODE_ENV === "development") {
  // app.use(morgan("dev"));

  app.set("view cache", false);
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(express.static("public"));

// Express Flash Middleware
app.use("/", function (req, res, next) {
  const message = req.flash();
  res.locals.message = message;
  next()
})


app.use('/', rootRoute);
app.use('*', notFoundRoute)


module.exports = app;




