const express = require('express');
const { createPost, likeAndUnlikePost, deletePost, getPostOffFollowing,updateCaption } = require('../controllers/post');
const router = express.Router();
const {isAuthenticated} =require("../middleware/auth")

router.route("/post/upload").post(isAuthenticated,createPost);
router.route("/post/:id")
.get(isAuthenticated,likeAndUnlikePost)
.delete(isAuthenticated,deletePost)
router.route("/post/:id").put(isAuthenticated,updateCaption)
module.exports =router;