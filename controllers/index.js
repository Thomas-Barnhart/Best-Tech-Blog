// Imports
const router = require("express").Router();
const apiRoutes = require("./api"); // Import API-specific routes
const homeRoutes = require("./homeRoutes"); // Import home-related routes

// Middleware: Routing setup

// Use the homeRoutes middleware for routes under the root ("/") path
router.use("/", homeRoutes);

// Use the apiRoutes middleware for routes under the "/api" path
router.use("/api", apiRoutes);

// Exports: Export the configured router
module.exports = router;