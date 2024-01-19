// Decoding function for the Lua 'enc' encoding
function dec(encodedData) {
    return encodedData.replace(/....../g, function(x) {
        return String.fromCharCode(parseInt(x, 2));
    });
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON in the request body with an increased payload size limit (e.g., 10MB)
app.use(bodyParser.json({ limit: '1000mb' }));

// Variable to store the decoded data
let decodedData = "No Data";

// Endpoint for both GET and POST requests
app.all('/api/encrypted-data', (req, res) => {
    // If it's a POST request, update the decoded data
    if (req.method === 'POST') {
        const requestData = req.body;

        // Ensure that the received data is a string
        if (typeof requestData.encryptedData === 'string') {
            // Decode the data using the 'dec' function
            decodedData = dec(requestData.encryptedData);
        } else {
            // Invalid data, respond accordingly
            return res.status(400).send('Invalid request data');
        }
    }

    // Set the content type to plain text
    res.set('Content-Type', 'text/plain');

    // Respond with the decoded data for all requests
    res.send(decodedData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
