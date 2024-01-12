// Imports
const router = require("express").Router();
const userRoutes = require("./userRoutes"); // Import user-related routes
const blogPostRoutes = require("./blogPostRoutes"); // Import blog post-related routes
const commentRoutes = require("./commentRoutes"); // Import comment-related routes

// Middleware: Routing setup

// Use the userRoutes middleware for routes under the "/users" path
router.use("/users", userRoutes);

// Use the blogPostRoutes middleware for routes under the "/blogPost" path
router.use("/blogPost", blogPostRoutes);

// Use the commentRoutes middleware for routes under the "/comment" path
router.use("/comment", commentRoutes);

// Exports: Export the configured router
module.exports = router;