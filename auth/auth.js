const jwt = require('jsonwebtoken');

const { default: mongoose } = require('mongoose')


const postModule = require('../model/postModule');
const userModule = require('../model/userModule');

//------------------------------------------------------------------------------------------//

const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-Api-key"];
    if (!token) token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, message: "token must be present", });

    //-----(Decoding Token)
    jwt.verify(token, "just_paste_it", (error, decoded) => {
        if (error) {
            return res.status(401).send({ status: false, message: error.message })
        } 
        else {
            req["UserId"] = decoded.UserId;
            next()
        }
    })
    
} catch (err) {
    res.status(500).send({ status: false, message: err.message });
}
};
//......................................................................................................//


// const authorise = async function (req, res, next) {
//     try {
//       console.log("........33");
//       token = req.headers['x-api-key'];
  
//       let decodedToken = jwt.verify(token, 'just_paste_it');
  
//       let UserId = decodedToken.UserId;

//       let findBlog = await userModule.findOne({ UserId: UserId });


//       if (!findBlog)
//         return res.status(403).send({ 
//           status: false,
//           msg: 'Unauthorized User',
//         });
//   console.log(".........49");
//       next();
//     } catch (err) {
//       res.status(401).send({ Status: false, msg: err.message });
//     }
//   };
  
  module.exports={authenticate}