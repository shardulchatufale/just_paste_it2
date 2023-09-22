const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    PostId: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'PostId is  Required',
        ref: 'post',
        trim:true
    },
    CommentedBy: {
        type: String,
        default: 'Guest',
        trim:true
    },
    rating: {
        type: Number,
        minlength: 1,
        maxlength: 5,
        required: 'Rating is Required'
    },
    comment: {
        type: String,
        trim:true
    }
})

module.exports = mongoose.model('comment', reviewSchema)