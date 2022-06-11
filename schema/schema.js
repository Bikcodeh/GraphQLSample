const graphql = require('graphql')
const _ = require('lodash')
const User = require('../model/User')
const Post = require('../model/Post')
const Hobby = require('../model/Hobby')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql

//Create type
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        /* Profession */
        profession: { type: GraphQLString },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({ userId: parent.id })
            }
        },
        hoobies: {
            type: new GraphQLList(HoobyType),
            resolve(parent, args) {
                return Hobby.find({ userId: parent.id })
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
                return User.findById(parent.userId)
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
                return User.findById(parent.userId)
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
                return User.findById(args.id);
            }
        },
        hooby: {
            type: HoobyType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Hobby.findById(args.id);
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Post.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({}).exec()
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({}).exec()
            }
        },
        hobbies: {
            type: new GraphQLList(HoobyType),
            resolve(parent, args) {
                return Hobby.find({}).exec()
            }
        }
    }
})

/* Mutations */

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                profession: { type: GraphQLString }
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                return user.save()
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLInt },
                profession: { type: GraphQLString }
            },
            resolve(parent, args) {
                return User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    { new: true }
                ).exec()
            }

        },
        removeUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let removedUser = User.findByIdAndRemove(args.id).exec();
                if(!removedUser) {
                    throw new("Error deleting user")
                }
                return removedUser;
            }
        },
        createPost: {
            type: PostType,
            args: {
                //id: { type: GraphQLID },
                comment: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                let post = new Post({
                    comment: args.comment,
                    userId: args.userId
                })
                return post.save();
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: { type: GraphQLID },
                comment: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment,
                            userId: args.userId
                        }
                    },
                    { new: true }
                )
            }
        },
        removePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let removedPost = Post.findByIdAndRemove(args.id).exec();
                if(!removedPost) {
                    throw new("Error deleting post")
                }
                return removedPost;
            }
        },
        createHobby: {
            type: HoobyType,
            args: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                return hobby.save();
            }

        },
        updateHobby: {
            type: HoobyType,
            args: {
                id: { type: GraphQLID },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description,
                            userId: args.userId
                        }
                    },
                    { new: true }
                )
            }
        },
        removeHobby: {
            type: HoobyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let removedHobby = Hobby.findByIdAndRemove(args.id).exec();
                if(!removedHobby) {
                    throw new("Error deleting hobby")
                }
                return removedHobby;
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})