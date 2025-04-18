/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require('./routes/accountRoute.js');
const intentionalErrorRoute = require("./routes/intentionalErrorRoute.js");
const utilities = require("./utilities/index.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session")
const pool = require('./database/')
const favicon = require('serve-favicon');
const path = require('path');
const messageRoute = require('./routes/messageRoute.js');


/* ******************************************
 * Handle Deprecation Warnings
 ****************************************** */
process.on('warning', (warning) => {
  console.warn('Deprecation Warning: ', warning.name);
  console.warn(warning.message);
  console.warn(warning.stack);
});

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // for parsing application/x-www-form-urlencoded
  extended: true
}));
/* unit 5, login process activity */
app.use(cookieParser())
/**** ensuring that local account data is available to all */
app.use((req, res, next) => {
  res.locals.accountData = req.session.account || null;
  res.locals.loggedin = req.session.loggedin || false;
  next();
});


// JWT checker
app.use(utilities.checkJWTToken);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/* ***********************
 * Vew Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(express.static("public")) // Static files in public folder
app.use(static);
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Message routes
app.use("/message", messageRoute);

// Account routes
app.use("/account", accountRoute);
// Intentional error route. Used for testing
app.use("/trigger-error", intentionalErrorRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message;
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
