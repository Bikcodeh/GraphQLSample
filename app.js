const express = require('express')
const schema = require('./schema/schema')
const { graphqlHTTP } = require('express-graphql')
const { dbConnection } = require('./config');
require('dotenv').config();

const app = express()


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}))

const connectDB = async() => {
    await dbConnection()
}

connectDB()


app.listen(4000, () => {
    console.log(`Server running at port 4000`)
})
