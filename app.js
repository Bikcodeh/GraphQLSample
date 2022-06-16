require('dotenv').config();
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { useServer } = require('graphql-ws/lib/use/ws')
const { createServer } = require('http')
const { WebSocketServer } = require('ws')
const cors = require('cors');
const schema = require('./schema/schema')
const { dbConnection } = require('./config');


const initApollo = async() => {
    const apolloServer = new ApolloServer({ schema });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
}

const app = express();
app.use(cors())

const httpServer = createServer(app);

const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
useServer({ schema }, wsServer);
initApollo()

const PORT = process.env.PORT

dbConnection()

httpServer.listen({ port: PORT || 4000 }, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
