const express = require('express');

const router = express.Router();

const users = require('./userDb')
const posts = require("../posts/postDb");

router.post("/", validateUser, (req, res) => {
  users.insert(req.body)
    .then((user) => {
      res.status(201).json(user)
    })
    .catch((err) => {
      next(err)
    })
})

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  posts.insert({
      text: req.body.text,
      user_id: req.params.id,
    })
    .then((post) => {
      res.status(201).json(post)
    })
    .catch((err) => {
      next(err)
    })
})

router.get("/", (req, res) => {
  users.get()
    .then((users) => {
      res.status(200).json(users)
    })
    .catch((err) => {
      next(err)
    })
})

router.get("/:id", validateUserId, (req, res) => {
  res.json(req.user)
});

router.get("/:id/posts", validateUserId, (req, res) => {
  users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts)
    })
    .catch((err) => {
      next(err)
    })
})

router.delete("/:id", validateUserId, (req, res) => {
  users.remove(req.params.id)
    .then((user) => {
      res.status(200).json({
        message: "User successfully deleted.",
      })
    })
    .catch((err) => {
      next(err)
    })
})

router.put("/:id", validateUserId, (req, res) => {
  users.update(req.params.id, req.body)
    .then((user) => {
      console.log(user)
      res.status(200).json({
        id: req.params.id,
        name: req.body.name,
      })
    })
    .catch((err) => {
      next(err)
    })
})

// Middleware

function validateUserId(req, res, next) {
  users.getById(req.params.id)
    .then((user) => {
      if (user) {
        req.user = user
        next()
      } else {
        res.status(404).json({
          message: "User not found",
        })
      }
    })
    .catch((err) => {
      next(err)
    })
}

function validateUser(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({
      message: "Missing required name field.",
    })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if (!req.body.text) {
    return res.status(400).json({
      message: "Text is required.",
    })
  } else {
    next()
  }
}

module.exports = router
