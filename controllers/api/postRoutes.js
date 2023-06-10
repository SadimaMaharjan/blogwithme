const router = require("express").Router();
const { User, Post } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });

    const allPosts = posts.map((post) => post.get({ plain: true }));

    res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["username"] }],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const individualPost = post.map((post) => post.get({ plain: true }));

    res.status(200).json(individualPost);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
