const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Dummy user data (replace with PostgreSQL later)
const users = [];

// Define User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

// Root Mutation: Signup and Login
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Signup Mutation
    signup: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args, context) {
        const userExists = users.find(user => user.email === args.email);
        if (userExists) {
          throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(args.password, 10);
        const newUser = {
          id: String(users.length + 1),
          name: args.name,
          email: args.email,
          password: hashedPassword,
        };
        users.push(newUser);

        // Generate JWT Token
        const token = jwt.sign({ userId: newUser.id }, 'your_secret_key', { expiresIn: '1h' });

        // Set cookie with HttpOnly and Secure flags
        context.res.cookie('token', token, {
          httpOnly: true, // Prevent JavaScript access
          secure: process.env.NODE_ENV === 'production', // Only use Secure flag in production (HTTPS)
          maxAge: 3600000, // Token expires in 1 hour
        });

        return newUser;
      }
    },

    // Login Mutation
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args, context) {
        const user = users.find(user => user.email === args.email);
        if (!user) {
          throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(args.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

        // Set cookie with HttpOnly and Secure flags
        context.res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000, // 1 hour
        });

        return user;
      }
    }
  }
});


// Define Root Query: For testing purposes, let's query all users
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // List users (for testing purposes)
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return users;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
