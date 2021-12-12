const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        password: String
        bookCount: Int
        savedBooks: [Book]
        
    }

    type Book {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    input BookInfo {
        authors: [String]
        description: String
        title: String
        bookId: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }
   

    type Query {
        me: User
        users: [User]
        user(username: String!): User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(bookInfo: BookInfo!): User
        removeBook(bookInfo: BookInfo!): User
    }
`;

module.exports = typeDefs;