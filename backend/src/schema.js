const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');

// Dummy user data for testing
const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

// Define a UserType for the GraphQL schema
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

// Define RootQuery for users
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return users; // Dummy data returned
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});

