const mongoose = require("mongoose")

const LikeModule = require("../model/LikeModule")
const PostModule = require("../model/postModule")

const LikePost = async function (req, res) {
    try {

        let PostId = req.query.PostId

        if (!PostId) return res.status(400).send({ status: false, message: 'please enter  the PostId' })
        if (!mongoose.Types.ObjectId.isValid(PostId)) return res.status(400).send({ status: false, message: 'please enter valid the PostId' });

        let FindPost = await PostModule.findOne({ _id: PostId })//...........................
        if (!FindPost) return res.status(400).send({ status: false, message: 'there are no such' })

        let IsLiked = await LikeModule.findOne({ PostId: PostId, LikedBy: req.UserId, IsLike: true })//..................
        if (IsLiked) return res.status(400).send({ status: false, message: 'you are liked this post already,you cant like this post again' });

        let obj = {
            PostId: PostId,
            LikedBy: req.UserId,
            IsLike: true
        }

        FindPost.like = (FindPost.like + 1)
        await FindPost.save()

        let SavedData = await LikeModule.create(obj)
        let data = await LikeModule.findById(SavedData._id)

        let { _id, title, body, like } = FindPost
        let responce = { post: { title, body, like }, LikedData: SavedData }

        res.status(201).send({ status: true, message: 'You successfully likked this post', data: responce })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}

module.exports.LikePost = LikePost
