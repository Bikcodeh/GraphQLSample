const express = require('express')
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql')
const moongose = require('mongoose')
const schema = require('./schema/schema')
const schemaTest = require('./schema/types_schema')
const { dbConnection } = require('./config');

const app = express()


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schemaTest
}))

const connectDB = async() => {
    await dbConnection()
}

connectDB()


app.listen(4000, () => {
    console.log(`Server running at port 4000`)
})
