const PostModule = require('../model/postModule');
const jwt = require('jsonwebtoken');

const CreatePost = async function (req, res) {
    try {
      let data = req.body;
      let token = req.headers['x-api-key'];
  
      if (!data.UserId)
        return res.status(400).send({ status: false, msg: 'author id required' });
  
      if (!data.title)
        return res.status(400).send({ status: false, msg: 'title required' });
  
      if (!data.body)
        return res.status(400).send({ status: false, msg: 'body required' });
  
   
      let decodedToken = jwt.verify(token, 'just_paste_it');
      if (decodedToken.authorId != data.authorId)
        return res.status(403).send({ status: false, msg: 'Unauthorized' });

      const FindUser=await PostModule.find({UserId:data.UserId})  
      for(let i=0;i<FindUser.length;i++){
        if(FindUser[i].title==data.title){
            return res.status(400).send({ status: false, msg: 'You already have same name post' });
        }
      }
  
      const CreatePost = await PostModule.create(data);
  
      res.status(201).send({ status: true, msg: CreatePost });
    }catch (err) { res.status(500).send({ status: false, msg: err.message, }) }
  };


  const GetPost=async function (req,res){

  }

  module.exports.CreatePost=CreatePost