const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('../schema/schema')
const { dbConnection } = require('../config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4000;

        this.connectDB();

        this.app.use('/graphql', graphqlHTTP({
            graphiql: true,
            schema
        }))
    }

    async connectDB() {
        await dbConnection();
    }

    connectGraphQL() {
        this.app.use('/graphql', graphqlHTTP({
            graphiql: true,
            schema
        }))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor running at port', this.port);
        });
    }
}

module.exports = Server;