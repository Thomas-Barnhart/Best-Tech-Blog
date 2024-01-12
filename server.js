// Imports
const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Sets session cookie properties
const sess = {
  secret: "Super secret secret", // Secret used to sign the session ID cookie
  cookie: {
    maxAge: 1200000, // Maximum age of the session cookie (in milliseconds)
    httpOnly: true, // Restricts access to the session cookie to HTTP only
    secure: false, // Secure flag set to false, typically set to true in a production environment with HTTPS
    sameSite: "strict", // Sets the SameSite attribute to "strict" for better security
  },
  resave: false, // Disables the session being saved back to the store on every request
  saveUninitialized: true, // Allows a new session to be saved, even if it's not modified
  store: new SequelizeStore({
    db: sequelize, // Configures session storage using Sequelize with the specified database connection
  }),
};

app.use(session(sess)); // Set up Express.js to use sessions with the defined session properties

// Inform Express.js on which template engine to use
app.engine("handlebars", hbs.engine); // Configure Express to use Handlebars as the template engine
app.set("view engine", "handlebars"); // Set the view engine to Handlebars

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory

app.use(routes); // Use the defined routes for the application

// Syncs sequelize with the database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening")); // Start the Express.js server and listen on the specified port
});