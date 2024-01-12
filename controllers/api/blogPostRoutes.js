// Imports
const router = require("express").Router();
const { BlogPost } = require("../../models");
const withAuth = require("../../utils/auth");

// Route to create a new blog post
router.post("/", withAuth, async (req, res) => {
  console.log(req.body);
  try {
    const newBlogPost = await BlogPost.create({
      ...req.body, // Create a new blog post with the provided data in the request body
      user_id: req.session.user_id, // Associate the blog post with the logged-in user
    });

    res.status(200).json(newBlogPost); // Respond with a status of 200 (OK) and the newly created blog post
  } catch (err) {
    console.log(err)
    res.status(400).json(err); // Respond with a status of 400 (Bad Request) and any error that occurred
  }
});

// Route to edit an existing blog post
router.put("/:id", withAuth, async (req, res) => {
  console.log(req.body);
  try {
    const blogPostData = await BlogPost.update(req.body, {
      where: {
        id: req.params.id, // Update the blog post with the provided ID
      },
    });

    if (!blogPostData) {
      res.status(404).json({ message: "No blog post found with this id!" }); // Respond with a status of 404 (Not Found) and a message if no blog post with the provided ID is found
      return;
    }

    res.status(200).json(blogPostData); // Respond with a status of 200 (OK) and the updated blog post data
  } catch (err) {
    res.status(500).json(err); // Respond with a status of 500 (Internal Server Error) and any error that occurred
  }
});

// Route to delete an existing blog post
router.delete("/:id", withAuth, async (req, res) => {
  console.log(req.params.id);
  try {
    const blogPostData = await BlogPost.destroy({
      where: {
        id: req.params.id, // Delete the blog post with the provided ID
      },
    });

    if (!blogPostData) {
      res.status(404).json({ message: "No blog post found with this id!" }); // Respond with a status of 404 (Not Found) and a message if no blog post with the provided ID is found
      return;
    }

    res.status(200).json(blogPostData); // Respond with a status of 200 (OK) and the result of the deletion
  } catch (err) {
    res.status(500).json(err); // Respond with a status of 500 (Internal Server Error) and any error that occurred
  }
});

// Exports
module.exports = router;