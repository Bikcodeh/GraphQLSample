const { default: mongoose } = require('mongoose')
const mooongose = require('mongoose');
const User = require('./User');

const MSchema = mongoose.Schema;

const postSchema = new MSchema({
    id: String,
    comment: String,
    user: User
})

module.exports = mooongose.model('Post', postSchema)