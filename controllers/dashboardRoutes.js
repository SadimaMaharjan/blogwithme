const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "created_at",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });

    const postData = posts.map((post) => post.get({ plain: true }));

    res.render("dashboard", { postData, loggedIn: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get;

router.get("/new", (req, res) => {
  res.render("new-post");
});

module.exports = router;
