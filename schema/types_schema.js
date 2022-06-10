const graphql = require('graphql')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLNonNull
} = graphql

/*Scalar Types
    String = GraphQLString
    int
    Float
    Boolean
    ID
*/

const PersonType = new GraphQLObjectType({
    name: "Person",
    description: "Represents a Person Type",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        isMarried: { type: GraphQLBoolean },
        gpa: { type: GraphQLFloat },
        justAType: {
            type: PersonType,
            resolve(parent, args) {
                return parent;
            }
        }
    })
})

/* Root query */
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Description",
    fields: {
        person: {
            type: PersonType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
               let person = {
                   name: null,
                   age: 34,
                   isMarried: true,
                   gpa: 4.0
               }
               return person;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})