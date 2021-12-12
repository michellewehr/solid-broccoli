const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const {signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userDate = await User.find({ _id: context.user._id })
                    .select('-__v -password')
                    return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        users: async () => {
            return User.find().select('-__v -password')
        },
        user: async(parent, {username}) => {
            return User.findOne({username}).select('-__v -password')
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },

        login: async (parent, {email, password}) => {
            const user = await user.findOne({email});
            if(!user) {
                throw new AuthenticationError('Incorrect credentials!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return {user, token};
        },

        saveBook: async(parent, {bookInfo}, context) => {
            if(context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $push: {savedBooks: bookInfo.bookId}},
                    {new: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        deleteBook: async(parent, {bookInfo}, context) => {
            if(context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBOoks: bookInfo.bookId}},
                    {new: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
}

module.exports = resolvers;