const mongoose=require("mongoose")
const PostModule=require("../model/postModule")
const CommentModule=require("../model/commetModue")


const CreateComment=async function(req,res){
    try {
        let data = req.body;
        let PostId = req.query.PostId;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'please eneter data to create comment' })
        if(!PostId) return res.status(400).send({ status: false, message: 'please enter  the PostId' })
        if (!mongoose.Types.ObjectId.isValid(PostId)) return res.status(400).send({ status: false, message: 'please enter valid the PostId' });

        //-------(Find Book)

        let FindPost = await PostModule.findOne({ _id: PostId });
        if (!FindPost) return res.status(404).send({ status: false, message: 'PostId does not exists' })

        //-------(Destructuring)

        let { rating, comment, CommentedBy } = data;

        //----(Rating)

        if (!rating) return res.status(400).send({ status: false, message: 'ratings required and value should not be zero' })
        if (typeof rating != 'number') return res.status(400).send({ status: false, message: 'please enter a number' })
        if (!(rating <= 5)) return res.status(400).send({ status: false, message: 'please enter valid rating which less than or equal to 5' });

        
        let filter = {
            PostId: PostId,
            CommentedBy: CommentedBy,
            rating: rating,
            comment: comment
        };
        
        let saveData = await CommentModule.create(filter);
        let response = await CommentModule.findById(saveData._id)

        let { _id, title,body } = FindPost
        let PostData = { post:{_id, title, body},CommentedData:response }

        //---------(Response)
        
        res.status(201).send({ status: true, message: 'success', data: PostData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.CreateComment=CreateComment