const express = require('express');
const router = express.Router();

const MiddleWare=require("../auth/auth")
const UserController=require("../controller/userController")
const PostController=require("../controller/postController")

router.post('/UserRegistration',UserController.UserRegistration)
router.post('/login',UserController.login)
router.post('/ForgotPass',UserController.ForgotPass)
router.post('/resetpass',UserController.resetPss)

router.post('/CreatePost',MiddleWare.authenticate,PostController.CreatePost)

module.exports = router;