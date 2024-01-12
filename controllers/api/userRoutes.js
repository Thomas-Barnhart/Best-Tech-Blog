// Imports
const router = require("express").Router();
const { User } = require("../../models");

// Route to create a new user by posting email, username, and password to the database
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body); // Create a new user in the database using the provided data

    req.session.save(() => {
      req.session.user_id = userData.id; // Store the user's ID in the session
      req.session.logged_in = true; // Mark the user as logged in

      res.status(200).json(userData); // Respond with a success status and user data
    });
  } catch (err) {
    res.status(400).json(err); // Respond with a status of 400 (Bad Request) and any error that occurred
  }
});

// Route to log in an existing user by validating their credentials
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } }); // Find a user in the database based on their email

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" }); // Respond with a message if no user with the provided email is found
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password); // Check if the provided password matches the user's stored password

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" }); // Respond with a message if the password is incorrect
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id; // Store the user's ID in the session
      req.session.logged_in = true; // Mark the user as logged in

      res.json({ user: userData, message: "You are now logged in!" }); // Respond with the user data and a success message
    });
  } catch (err) {
    res.status(400).json(err); // Respond with a status of 400 (Bad Request) and any error that occurred
  }
});

// Route to log out a user by ending the session
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end(); // If the user is logged in, end their session and respond with a status of 204 (No Content)
    });
  } else {
    res.status(404).end(); // If the user is not logged in, respond with a status of 404 (Not Found)
  }
});

// Exports
module.exports = router;