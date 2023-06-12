const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
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

    //Serialize data so that the template can read it

    const posts = postData.map((post) => post.get({ plain: true }));
    //res.status(200).json(posts);
    // Pass serialized data and session flag into template
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
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
    const post = postData.get({ plain: true });
    console.log(post);
    res.render("single-post", { post, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

module.exports = router;
