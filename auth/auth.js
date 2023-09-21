const jwt = require('jsonwebtoken');

const postModule = require('../model/postModule');

//------------------------------------------------------------------------------------------//

const authenticate = function (req, res, next) {
  try {
    let token = req.headers['x-api-key'];
    if (!token)return res
        .status(400)
        .send({ status: false, msg: 'token must be present' });

    let decodedToken = jwt.verify(token, 'just_paste_it');
    
    if (!decodedToken)
      return res.status(401).send({ status: false, msg: 'token is not valid' });

    next();
  } catch (err) {
    res.status(500).send({ Status: false, msg: err.message });
  }
};
//......................................................................................................//


const authorise = async function (req, res, next) {
    try {
      token = req.headers['x-api-key'];
  
      let PostId = req.query.postId;
  
      let decodedToken = jwt.verify(token, 'just_paste_it');
  
      let UserId = decodedToken.userId;

      let findBlog = await postModule.findOne({ UserId: UserId, _id: PostId });
  
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