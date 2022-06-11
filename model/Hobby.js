const { default: mongoose } = require('mongoose')
const mooongose = require('mongoose');
const User = require('./User');

const MSchema = mongoose.Schema;

const hobbySchema = new MSchema({
    id: String,
    title: String,
    description: String,
    user: User
})

module.exports = mooongose.model('Hobby', hobbySchema)