const mongoose = require('mongoose')
const User = require('./User');

const MSchema = mongoose.Schema;

const postSchema = new MSchema({
    id: {
        type: String
    },
    comment: {
        type: String
    },
    userId: {
        type: MSchema.Types.ObjectId,
        ref: 'user'
    }
})

const Post = mongoose.model('post', postSchema)
module.exports = Post;