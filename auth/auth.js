const jwt = require('jsonwebtoken');

const { default: mongoose } = require('mongoose')


const postModule = require('../model/postModule');
const userModule = require('../model/userModule');

//------------------------------------------------------------------------------------------//

const authenticate = function (req, res, next) {
  try {
    console.log("..............jwt 9");
    let token = req.headers['x-api-key'];
    if (!token)return res
        .status(400)
        .send({ status: false, msg: 'token must be present' });
    let decodedToken = jwt.verify(token, 'just_paste_it');
    
    if (!decodedToken)
  
      return res.status(401).send({ status: false, msg: 'token is not valid' });
  console.log("...........jwt 18");
    next();
  } catch (err) {
    res.status(500).send({ Status: false, msg: err.message });
  }
};
//......................................................................................................//


const authorise = async function (req, res, next) {
    try {
      console.log("........33");
      token = req.headers['x-api-key'];
  
    //   let PostId = req.query.PostId;
    //   if(!PostId) return res.status(400).send({ status: false, message: 'Please provide post id' })
    //   if (!mongoose.Types.ObjectId.isValid(PostId)) return res.status(400).send({ status: false, message: 'Invalid postId Format' })


      let decodedToken = jwt.verify(token, 'just_paste_it');
  
      let UserId = decodedToken.UserId;

      let findBlog = await userModule.findOne({ UserId: UserId });


      if (!findBlog)
        return res.status(403).send({ 
          status: false,
          msg: 'Unauthorized User',
        });
  
      next();
    } catch (err) {
      res.status(401).send({ Status: false, msg: err.message });
    }
  };
  
  module.exports={authenticate,authorise}