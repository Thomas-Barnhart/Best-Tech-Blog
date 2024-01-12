// Imports
const router = require("express").Router();
const { BlogPost, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// Route for the homepage to display all blog posts
router.get("/", async (req, res) => {
  try {
    // Get all blog posts and join with user data and comment data
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          attributes: ["comment_body"],
        },
      ],
    });

    // Serialize the data to make it readable for the template
    const blogPosts = blogPostData.map((blogPost) =>
      blogPost.get({ plain: true })
    );

    // Pass the serialized data and session flag into the template
    res.render("homepage", {
      blogPosts,
      logged_in: req.session.logged_in, // Indicates if a user is logged in
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Route to find a single blog post and render the blogPost page
router.get("/blogPost/:id", withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const blogPost = blogPostData.get({ plain: true });

    // Render the blogPost page with data and session information
    res.render("blogPost", {
      ...blogPost,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
    res.redirect("/login");
  }
});

// Route to allow a logged-in user to access the dashboard page
// Uses withAuth middleware to prevent access to the route for unauthorized users
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged-in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: BlogPost,
          include: [User],
        },
        {
          model: Comment,
        },
      ],
    });

    const user = userData.get({ plain: true });

    // Render the dashboard page with user data and session information
    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to render the "create" page for new blog posts
router.get("/create", async (req, res) => {
  try {
    if (req.session.logged_in) {
      // If the user is logged in, render the "create" page with user data and session information
      res.render("create", {
        logged_in: req.session.logged_in,
        userId: req.session.user_id,
      });
      return;
    } else {
      // If the user is not logged in, redirect to the login page
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Route to edit an existing blog post
router.get("/create/:id", async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const blogPost = blogPostData.get({ plain: true });

    if (req.session.logged_in) {
      // If the user is logged in, render the "edit" page with blog post data, user data, and session information
      res.render("edit", {
        ...blogPost,
        logged_in: req.session.logged_in,
        userId: req.session.user_id,
      });
      return;
    } else {
      // If the user is not logged in, redirect to the login page
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Route for the login page
router.all("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route (dashboard)
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

// Export the router
module.exports = router;