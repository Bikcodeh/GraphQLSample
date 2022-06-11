const { default: mongoose } = require('mongoose')
const mooongose = require('mongoose')

const MSchema = mongoose.Schema;

const userSchema = new MSchema({
    id: String,
    age: Number,
    profession: String
})

module.exports = mooongose.model('User', userSchema)