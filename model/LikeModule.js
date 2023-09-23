const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    PostId: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'PostId is  Required',
        ref: 'post',
        trim:true
    },
    LikedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'UserId is  Required',
        ref: 'user'
    },
    IsLike:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('like', reviewSchema)