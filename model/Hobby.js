const mongoose = require('mongoose')
const User = require('./User');

const MSchema = mongoose.Schema;

const hobbySchema = new MSchema({
    id: String,
    title: String,
    description: String,
    userId: {
        type: MSchema.Types.ObjectId,
        ref: 'user'
    }
})

const Hobby =  mongoose.model('hobby', hobbySchema)
module.exports = Hobby;