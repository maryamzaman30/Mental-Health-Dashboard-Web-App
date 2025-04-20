//Original code written by me
// Import necessary modules
const express = require('express'); // Express framework to handle routing & HTTP requests
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const app = express(); // Create an Express app instance

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (e.g., form data)
app.use(express.static('public')); // Serve static files (CSS, JS, images) from public directory
app.set('view engine', 'ejs'); // Set the views folder where EJS files are stored

// Routes
const indexRoutes = require('./routes/index'); // Import the index routes from the routes folder (index.js)
app.use('/', indexRoutes); // Register the indexRoutes to handle any requests to the root URL ('/')
const apiRoutes = require('./routes/api'); // Import the api routes from the routes folder (api.js)
app.use('/api', apiRoutes); // Register the apiRoutes to handle any requests to the /api URL path

// Server
const PORT = 3000; // Set the port default to 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`); // Log a message to the console to start the server
});