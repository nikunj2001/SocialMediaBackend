const express = require('express');
const { register,login, followUser, logout, updatePassword, updateProfile, updateCaption, deleteUser, myProfile, getUserPfile, getAllUser } = require('../controllers/user');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/follow/:id").get(isAuthenticated,followUser)
router.route("/logout").get(logout);
router.route("/update/password").put(isAuthenticated,updatePassword);
router.route("/update/profile").put(isAuthenticated,updateProfile);
router.route("/delete/me").delete(isAuthenticated,deleteUser);
router.route("/me").get(isAuthenticated,myProfile);
router.route("/user/:id").get(isAuthenticated,getUserPfile);
router.route("/users").get(isAuthenticated,getAllUser);
module.exports=router;