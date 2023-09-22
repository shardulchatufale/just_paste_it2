const express = require('express');
const router = express.Router();

const MiddleWare=require("../auth/auth")
const UserController=require("../controller/userController")
const PostController=require("../controller/postController")
const CommentController=require("../controller/CommentController")

//...............................TASK ONE........................................................

router.post('/UserRegistration',UserController.UserRegistration)
router.post('/login',UserController.login)
router.post('/ForgotPass',UserController.ForgotPass)
router.post('/resetpass',UserController.resetPss)

//////////////////////////////////TASK TWO //////////////////////////////////////////////////////
router.post('/CreatePost',MiddleWare.authenticate,PostController.CreatePost)
router.get('/GetPost',MiddleWare.authenticate,PostController.GetPost)
router.put('/UpdatePost',MiddleWare.authenticate,PostController.UpdatePost)
router.delete('/deleteByQuery',MiddleWare.authenticate,PostController.deletedByQuery)

router.post('/CreateComment',MiddleWare.authenticate, CommentController.CreateComment)


module.exports = router;