const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
  try {
    const commentData = await Comment.findAll();
    const allComment = commentData.map((comment) => post.get({ plain: true }));
    res.status(200).json(allComment);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const individualComment = comment.map((comment) =>
      post.get({ plain: true })
    );

    res.status(200).json(individualComment);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", withAuth, async (req, res) => {
  try {
    const newComment = Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    });
    res.status(200).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
