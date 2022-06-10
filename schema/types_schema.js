const graphql = require('graphql')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat
} = graphql

/*Scalar Types
    String = GraphQLString
    int
    Float
    Boolean
    ID
*/

const Person = new GraphQLObjectType({
    name: "Person",
    description: "Represents a Person Type",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        isMarried: { type: GraphQLBoolean },
        gpa: { type: GraphQLFloat }
    })
})

/* Root query */
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Description",
    fields: {
    }
});