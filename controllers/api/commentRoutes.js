// Imports
const router = require("express").Router();
const { BlogPost, Comment, User } = require("../../models");

// CREATE Comment
router.post("/", async (req, res) => {
  try {
    console.log("we made it"); // Log a message to indicate the beginning of the route handler
    const comment = await Comment.create({
      comment_body: req.body.comment_body, // Create a new comment with the provided comment body
      blogPost_id: req.body.blogPost_id, // Associate the comment with a specific blog post
      user_id: req.session.user_id || req.body.user_id, // Associate the comment with the logged-in user (if available) or the provided user ID
    });

    res.status(200).json(comment); // Respond with a status of 200 (OK) and the created comment
  } catch (err) {
    console.error(err);
    res.status(500).json(err); // Respond with a status of 500 (Internal Server Error) and any error that occurred
  }
});

// READ all Comments
router.get("/", async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: BlogPost,
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(commentData); // Respond with a status of 200 (OK) and the retrieved comment data
  } catch (err) {
    res.status(500).json(err); // Respond with a status of 500 (Internal Server Error) and any error that occurred
  }
});

// UPDATE Comment
router.put("/:id", async (req, res) => {
  try {
    const updatedComment = await Comment.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedComment[0]) {
      res.status(400).json({ message: "No comment found with that id!" }); // Respond with a status of 400 (Bad Request) and a message if no comment with the provided ID is found
      return;
    }

    console.log("Comment updated!"); // Log a message to indicate that the comment has been updated
    res.status(200).json(updatedComment); // Respond with a status of 200 (OK) and the updated comment data
  } catch (err) {
    console.error(err);
    res.status(500).json(err); // Respond with a status of 500 (Internal Server Error) and any error that occurred
  }
});

// DELETE Comment
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!comment) {
      res.status(404).json({ message: "No comment found with that id!" }); // Respond with a status of 404 (Not Found) and a message if no comment with the provided ID is found
      return;
    }
    res.status(200).json(comment); // Respond with a status of 200 (OK) and the deleted comment data
  } catch (err) {
    res.status(500).json(err); // Respond with a status of 500 (Internal Server Error) and any error that occurred
  }
});

// Exports
module.exports = router;