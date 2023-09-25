const UserModel = require("../model/userModule")
const bcrypt = require('bcrypt');
const validator = require("../validator/validator")
const crypto = require('crypto');
const jwt= require("jsonwebtoken")
const { log } = require("console");

const UserRegistration = async function (req, res) {
  try {
    let data = req.body
    const { username, email, password ,...rest} = data;
    if(Object.keys(rest).length>0)return res.status(400).send({ status: false, message: `you can't provide ${Object.keys(rest)} key` })
        
    if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })
    if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: 'Password should be between 8 to 15 character[At least One Upper letter, one small letter, one number and one special charater]' })

    if (!email) return res.status(400).send({ status: false, message: 'Please enter email' })
    if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: 'Please enter valid email' })

    if (!username) return res.status(400).send({ status: false, message: 'Please enter email' })
    if (!validator.isValidUserName(username)) return res.status(400).send({ status: false, message: 'Please enter valid username' })

    let existingUser = await UserModel.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const bcryptPassword = await bcrypt.hash(req.body.password, 10)
    req.body.password = bcryptPassword

    const user = await UserModel.create(data)

    return res.status(201).send({ status: true, message: 'User Created Successfully', data: user })


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
//...................................................login api.......................................................
const login = async function (req, res) {
  try {
    const { username, password,...rest } = req.body;
    if(Object.keys(rest).length>0)return res.status(400).send({ status: false, message: `you can't provide ${Object.keys(rest)} key` })

    if (!username) return res.status(400).send({ status: false, message: 'Please enter email' })
    if (!validator.isValidUserName(username)) return res.status(400).send({ status: false, message: 'Please enter valid username' })

    if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })

    const Login = await UserModel.findOne({ username: req.body.username })
    if (!Login) return res.status(400).send({ status: false, message: 'Not a register email Id' })

    const passwordMatch = await bcrypt.compare(password, Login.password);
  

    if (!passwordMatch) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
     let token = jwt.sign(
      {
        UserId: Login._id.toString(),
      },
      'just_paste_it', { expiresIn: '1d' }
    );
    res.setHeader('x-api-key', token);
    res.status(200).send({ status: true,message:" YOU ARE LOG IN SUCCESSFULLY", token: token });

  
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}
//..............................................................................................................

const ForgotPass = async function (req, res) {

  try {
    const { email } = req.body;

    // Find the user by email in the database
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const ResetToken = resetToken;
    const resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

    // Save the user with the reset token

     await UserModel.updateOne({ email }, { $set: { resetToken: ResetToken, resetTokenExpiration: resetTokenExpiration } }, { new: true })


    res.status(200).json({ resetToken });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
//............................................................................................
const resetPss = async function (req, res) {

  try {
    let { token } = req.body;
    let { newPassword } = req.body;

    // Find the user by reset token and check the expiration
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update the user's password and clear the reset token

    let bcryptPassword = await bcrypt.hash(newPassword, 10)
    newPassword = bcryptPassword
    
    user.password = newPassword;
    user.resetToken = undefined
    user.resetTokenExpiration = undefined
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}


module.exports = { UserRegistration, login, ForgotPass, resetPss }