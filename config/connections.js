// Dotenv import: Loads environment variables from a .env file into the process.env object
require("dotenv").config();

// Sequelize import: Import the Sequelize library for working with the database
const Sequelize = require("sequelize");

// Allows for environmental variables to be used for database configuration

// Check if a JAWSDB_URL environment variable is provided, which is commonly used for Heroku deployments
// If JAWSDB_URL is present, create a Sequelize connection using the provided URL
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  // If JAWSDB_URL is not present, use the environmental variables (DB_NAME, DB_USER, DB_PW) to configure the connection
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: "localhost", // Database host
      dialect: "mysql", // Database dialect (MySQL in this case)
      dialectOptions: {
        decimalNumbers: true, // Use decimal numbers for data types that support them
      },
    });

// Sequelize export: Export the configured Sequelize instance for use in other parts of the application
module.exports = sequelize;