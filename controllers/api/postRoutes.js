const router = require("express").Router();
const { User, Post } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title", "content", "created_at"],
      order: [["created_at", "DESC"]],
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "created_on",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });

    const allPosts = posts.map((post) => post.get({ plain: true }));

    res.status(200).json(allPosts.reverse());
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      attributes: ["id", "title", "content"],
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "created_on",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
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

router.put("/:id", withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.session.user_id;
    const postData = await Post.findOne({
      where: {
        id: id,
        user_id: userId, // Ensure that only the owner of the post can update it
      },
    });
    const post = postData.get({ plain: true });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // Update the post with the new values
    post.title = title;
    post.content = content;

    await Post.update(post, { where: { id: req.params.id } });
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user_id;

    const post = await Post.destroy({
      where: {
        id: id,
        user_id: userId,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    //console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
