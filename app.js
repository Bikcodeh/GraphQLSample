const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const schemaTest = require('./schema/types_schema')

const app = express()

app.use('/graphql',graphqlHTTP({
    graphiql: true,
    schema: schemaTest
}))

app.listen(4000, () => {
    console.log(`Server running at port 4000`)
})
