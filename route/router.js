const express = require('express');
const router = express.Router();

const UserController=require("../controller/controller")

router.post('/UserRegistration',UserController.UserRegistration)
router.post('/login',UserController.login)
router.post('/ForgotPass',UserController.ForgotPass)
router.post('/resetpass',UserController.resetPss)


module.exports = router;