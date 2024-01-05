const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON in request body with an increased payload size limit (e.g., 10MB)
app.use(bodyParser.json({ limit: '50mb' }));

// Variable to store the key
let currentKey = "No Key";

// Endpoint for both GET and POST requests
app.all('/api/data', (req, res) => {
    // If it's a POST request, update the key
    if (req.method === 'POST') {
        const requestData = req.body;
        currentKey = requestData.key;
    }

    // Set the content type to plain text
    res.set('Content-Type', 'text/plain');

    // Respond with the current key for all requests
    res.send(currentKey);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
