const postModule = require('../model/postModule');
const PostModule = require('../model/postModule');
const validator=require("../validator/validator")


const { default: mongoose } = require('mongoose')
const jwt = require('jsonwebtoken');

const CreatePost = async function (req, res) {
    try {

        let data = req.body;
        let token = req.headers['x-api-key'];

        if (!data.UserId)return res.status(400).send({ status: false, msg: 'Userid required' });
        if (!mongoose.Types.ObjectId.isValid(data.UserId)) return res.status(400).send({ status: false, message: "Invalid UserId" })
 
        if (!data.title) return res.status(400).send({ status: false, msg: 'title required' });
        if (!validator.isValid(data.title)) return res.status(400).send({ status: false, message: 'Please enter title name in right formate' })

        if (!data.body)return res.status(400).send({ status: false, msg: 'body required' });
        if (!validator.isValid(data.body)) return res.status(400).send({ status: false, message: 'Please enter title name in right formate' })


        let decodedToken = jwt.verify(token, 'just_paste_it');

        if (decodedToken.UserId !==data.UserId){
            return res.status(403).send({ status: false, msg: 'Unauthorized' })}

        const PostName = await PostModule.find({ UserId: data.UserId })
        for (let i = 0; i < PostName.length; i++) {
            if (PostName[i].title == data.title) {
                return res.status(400).send({ status: false, msg: 'You already have same name post' });
            }
        }

        const CreatePost = await PostModule.create(data);

        res.status(201).send({ status: true, msg: CreatePost });
    } catch (err) { 
        res.status(500).send({ status: false, msg: err.message, }) }
};

//..........................................................................................................
const GetPost = async function (req, res) {
    try {
        console.log("..........47");
        let data = req.body;
        let filter = {};

        if (Object.keys(data).length == 0) {
            let AllPost = await PostModule.find(filter);
            res.status(200).send(AllPost);

        } else {


            filter['$or'] = [
                { UserId: data.UserId },
                { title: data.title },
                { _id: data.PostId }
            ];

            let AllPost = await PostModule.find(filter);

            if (AllPost.length == 0) {
                return res.status(404).send({ status: false, msg: 'Post not found' });
            }

            res.status(200).send(AllPost);
        }
    } catch (err) {
        res.status(500).send({ msg: 'Error', error: err.message });
    }
}
//..........................................................................................................

const UpdatePost = async function (req, res) {
    try {
    
        let PostId = req.query.PostId;
        let UserId=  req.query.UserId

        if (!mongoose.Types.ObjectId.isValid(UserId)) return res.status(400).send({ status: false, message: "Invalid UserId" })
      
        let data = req.body;
    

        let post = await PostModule.findOne({ _id:PostId });
        if (Object.keys(post).length == 0) {return res.status(404).send('No such post found')}

        if (data.title) { 
            let PostName = await PostModule.find({ _id: UserId })

            for (let i = 0; i < PostName.length; i++) {
                if (PostName[i].title == data.title) {
                    return res.status(400).send({ status: false, msg: 'You already have same name post' });
                }
            }
            post.title=data.title
        }

        if (data.body) { 
            if (!validator.isValid(data.body)) return res.status(400).send({ status: false, message: 'Please enter title name in right formate' })
            post.body=data.body
         }



        let updateData = await PostModule.findByIdAndUpdate({ _id:PostId }, post,{new:true} );
        // console.log(updateData);

        res.status(200).send({ status: true, msg: "updated successfully", data: updateData });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};
//.......................................................................................................


const deletedByQuery = async function (req, res) {
    try {
        console.log("........112");
        let data = req.query;
        let token = req.headers['just_paste_it'];

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: 'no query params data' });

        if (!data.UserId)
            return res.status(400).send({ status: false, msg: 'UserId id required' });

        let decodedToken = jwt.verify(token,'just_paste_it');
        if (decodedToken.UserId != data.UserId)
            return res.status(403).send({ status: false, msg: 'Unauthorized' });

            let findBlog = await userModule.findOne({ UserId:data.UserId,_id:data.PostId });
            if(!findBlog){return res.send({message:"data not found"})}
       
        
        const DeletedData = await postModule.deleteOne({_id:data.PostId})

        res.status(200).send({ status: true, data: 'successfully deleted' });

    } catch (err) {
        res.status(500).send({
            status: false, msg: err.message,
        });
    }
};
module.exports.CreatePost = CreatePost
module.exports.GetPost = GetPost
module.exports.UpdatePost = UpdatePost
module.exports.deletedByQuery=deletedByQuery

