const express = require('express')
const schema = require('./schema/schema')
const { graphqlHTTP } = require('express-graphql')
const { dbConnection } = require('./config');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 4000


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}))

const connectDB = async() => {
    await dbConnection()
}

connectDB()


app.listen(port, () => {
    console.log(`Server running`)
})
