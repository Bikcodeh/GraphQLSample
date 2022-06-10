const graphql = require('graphql')
const _ = require('lodash')

/* Dummy Data */
var usersData = [
    {id: '123',age: 45,name: 'Victor' , profession: 'programmer'},
    {id: '124',age: 46,name: 'Victor2', profession: 'baker'},
    {id: '125',age: 47,name: 'Victor3', profession: 'teacher'},
    {id: '126',age: 48,name: 'Victor4', profession: 'mechanic'},
    {id: '127',age: 49,name: 'Victor5', profession: 'doctor'}
]

var hobbiesData = [
    { id: '1', title: 'data1', description: 'khe1', userId: '123'},
    { id: '2', title: 'data2', description: 'khe2', userId: '124'},
    { id: '3', title: 'data3', description: 'khe3', userId: '125'},
    { id: '4', title: 'data4', description: 'khe4', userId: '126'},
    { id: '5', title: 'data5', description: 'khe5', userId: '127'}
]

var postsData = [
    { id: '1', comment: 'data' , userId: '123'},
    { id: '2', comment: 'data2', userId: '124'},
    { id: '3', comment: 'data3', userId: '125'},
    { id: '4', comment: 'data4', userId: '126'},
    { id: '5', comment: 'data5', userId: '127'},
    { id: '6', comment: 'data5', userId: '123'},
    { id: '7', comment: 'data5', userId: '123'}
]

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql

//Create type
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt},
        /* Profession */
        profession: { type: GraphQLString },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return postsData.filter( (item) => item.userId == parent.id)
            }
        },
        hoobies: {
            type: new GraphQLList(HoobyType),
            resolve(parent, args) {
                return hobbiesData.filter(item => item.userId == parent.id)
            }
        }
    })
});

//Create type
const HoobyType = new GraphQLObjectType({
    name: 'Hooby',
    description: 'Documentation for hobby',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, { id: parent.userId })
            }
        }
    })
});

//Create Post type
const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Documentation for Post',
    fields: () => ({
        id: { type: GraphQLID },
        comment: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, { id: parent.userId })
            }
        }
    })
});

/* Root query */
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Description",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                //We resolve with data
                //get and return data from datasource
                return _.find(usersData, { id: args.id });
            }
        },
        hooby: {
            type: HoobyType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return _.find(hobbiesData, { id: args.id })
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return _.find(postsData, { id: args.id })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})