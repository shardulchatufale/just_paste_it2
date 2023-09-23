const postModule = require('../model/postModule');
const PostModule = require('../model/postModule');
const CommentModule=require("../model/commetModue")
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
        console.log("..........48");
        let PostId = req.query.PostId
        let UserId = req.query.UserId
        let  titilee= req.query.title
console.log(".........51");
        //---------[Validations]
        
        if (!mongoose.Types.ObjectId.isValid(PostId)) return res.status(400).send({ status: false, message: 'Invalid PosId Format' })

        //---------[Checking Book is Present in Db or not]
        
        let CheckPost = await PostModule.findOne({ _id:PostId })
        if (!CheckPost) return res.status(404).send({ status: false, message: "post Not Found" });
        //---------(Check Reviews)

        let CommentedData = await CommentModule.find({ PostId: PostId }).select({PostId:0})

        //---------[Destructuring]

        let { _id, title ,body } = CheckPost

        //---------[Create response]

        let data = { _id, title, body, CommentedData }

        //---------[Send Response]

        res.status(200).send({ status: true, message: 'Book list', data: data })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
    
}
//..........................................................................................................

const UpdatePost = async function (req, res) {
    try {

        let PostId = req.query.PostId;

        let data = req.body;
        if(!PostId) return res.status(400).send({ status: false, message: "Please Provide postid to update post." })
        if (!mongoose.Types.ObjectId.isValid(PostId)) return res.status(400).send({ status: false, message: "Invalid UserId" })

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please Provide data to Update a book." })

        let post = await PostModule.findOne({ _id:PostId });
        if (!post) return res.status(404).send({ status: false, message: "post Not Found" });

        const token = req.UserId

        if (token !== post.UserId.toString()) return res.status(403).send({ status: false, message: "you cannot update other users post" });

        if (data.title) {            
            let PostName = await PostModule.find({UserId:req.UserId })

            for (let i=0;i<PostName.length; i++) {
                if (PostName[i].title == data.title) {
                    return res.status(400).send({ status: false, msg: 'You already have same name post' });
                }
            }
            post.title=data.title
        }
       
        if (data.body) { 
            if (!validator.isValid(data.body)) return res.status(400).send({ status: false, message: 'Please enter body in right formate' })
            post.body=data.body
         }

        let updateData = await PostModule.findByIdAndUpdate({ _id:PostId }, post,{new:true} );

        res.status(200).send({ status: true, msg: "updated successfully", data: updateData });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};
//.......................................................................................................


const deletedByQuery = async function (req, res) {
    try {
        let PostId = req.query.PostId

        //---------[Validations]

        if (!mongoose.Types.ObjectId.isValid(PostId)) return res.status(400).send({ status: false, message: 'Invalid UserId Format' })

        //---------[Check Book is Present in Db or not]

        let CheckPost = await PostModule.findOne({ _id: PostId});
        if (!CheckPost) return res.status(404).send({ status: false, message: "post Not Found" });

        //---------[Authorisation]

        const token = req.UserId
        if (token !== CheckPost.UserId.toString()) res.status(403).send({ status: false, message: "you cannot delete other users book" });

        //---------[Update Book]

        await PostModule.findOneAndUpdate(
            { _id: CheckPost },
            { new: true }
        );

        //---------[Response send]

        res.status(200).send({ status: true, message: 'This post is deleted successfully' })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
module.exports.CreatePost = CreatePost
module.exports.GetPost = GetPost
module.exports.UpdatePost = UpdatePost
module.exports.deletedByQuery=deletedByQuery

