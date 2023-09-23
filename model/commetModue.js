const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    PostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        trim:true
    },
    CommentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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