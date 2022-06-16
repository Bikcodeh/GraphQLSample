const graphql = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const _ = require('lodash')
const User = require('../model/User')
const Post = require('../model/Post')
const Hobby = require('../model/Hobby')

const pubSub = new PubSub();

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
            async resolve(parent, args) {
                return await Post.find({ userId: parent.id })
            }
        },
        hoobies: {
            type: new GraphQLList(HoobyType),
            async resolve(parent, args) {
                return await Hobby.find({ userId: parent.id })
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
            async resolve(parent, args) {
                return await User.findById(parent.userId)
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
            async resolve(parent, args) {
                return await User.findById(parent.userId)
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
            async resolve(parent, args) {
                //We resolve with data
                //get and return data from datasource
                return await User.findById(args.id);
            }
        },
        hooby: {
            type: HoobyType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return  await Hobby.findById(args.id);
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Post.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args) {
                return await User.find({}).exec()
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            async resolve(parent, args) {
                return await Post.find({}).exec()
            }
        },
        hobbies: {
            type: new GraphQLList(HoobyType),
            async resolve(parent, args) {
                return await Hobby.find({}).exec()
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
            async resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                let userSaved = await user.save()
                pubSub.publish('READ_USERS', { readUsers: userSaved });
                return userSaved
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
            async resolve(parent, args) {
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
            async resolve(parent, args) {
                let removedUser = await User.findByIdAndRemove(args.id).exec();
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
            async resolve(parent, args) {
                let post = new Post({
                    comment: args.comment,
                    userId: args.userId
                })
                return await post.save();
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: { type: GraphQLID },
                comment: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                return await Post.findByIdAndUpdate(
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
            async resolve(parent, args) {
                let removedPost = await Post.findByIdAndRemove(args.id).exec();
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
            async resolve(parent, args) {
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                return await hobby.save();
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
            async resolve(parent, args) {
                return await Hobby.findByIdAndUpdate(
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
            async resolve(parent, args) {
                let removedHobby = await Hobby.findByIdAndRemove(args.id).exec();
                if(!removedHobby) {
                    throw new("Error deleting hobby")
                }
                return removedHobby;
            }
        },
    }
});


const Subscription = new GraphQLObjectType({
    name: 'Subscription',
    fields: {
        readUsers : {
            type: UserType,
            subscribe: () => pubSub.asyncIterator(['READ_USERS'])
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
    subscription: Subscription
})