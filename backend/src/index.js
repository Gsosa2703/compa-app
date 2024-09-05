const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');//Import the CORS middleware.
const cookieParser = require('cookie-parser');//This middleware helps us easily set and read cookies in Express.
const jwt = require('jsonwebtoken');
const csrf = require('csurf');

const schema = require('./schema');

const app = express();

// Enable CORS with credentials
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true, // Allow cookies to be sent
}));

// Middleware to parse cookies
app.use(cookieParser());

// CSRF middleware setup
const csrfProtection = csrf({ cookie: true });//This sets up CSRF protection and ensures the CSRF token is stored in a cookie.
// Apply CSRF protection to all requests (except GraphQL)
app.use(csrfProtection);

// Middleware to expose CSRF token to frontend
app.use((req, res, next) => {
  const csrfToken = req.csrfToken();
  console.log('Generated CSRF Token:', csrfToken); //Log CSRF token to check if it’s being created

  // Send the CSRF token to the client as a cookie (XSRF-TOKEN)
  res.cookie('XSRF-TOKEN', req.csrfToken(), { 
    httpOnly: false, //Make this cookie accessible to JavaScript
    secure: process.env.NODE_ENV === 'production', //Ensure 'Secure' flag is only set in production
    sameSite: 'Strict', //Optional: Prevent CSRF attacks from other origins
  });
  next();
});
/*req.csrfToken(): This generates a CSRF token for each session. We expose this token as a cookie (XSRF-TOKEN), 
which will be accessible by the frontend and sent with subsequent requests.

The CSRF token will be sent as a separate cookie (XSRF-TOKEN), but unlike the JWT token, it is not HttpOnly, 
so the frontend can read and send it.*/


//Now, every request will check for the token cookie, verify it, and attach the user ID to the request.
app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, 'your_secret_key');
      req.userId = decoded.userId; // Attach user ID to the request object
    } catch (err) {
      res.clearCookie('token'); // If token is invalid, clear the cookie
    }
  }

  next();
});


app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true, // GraphiQL is a tool for running GraphQL queries in the browser
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


