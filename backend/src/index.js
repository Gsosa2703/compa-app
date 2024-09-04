const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const cors = require('cors');  // Import the CORS middleware

const app = express();

app.use(cors());  // Enable CORS

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true, // GraphiQL is a tool for running GraphQL queries in the browser
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

