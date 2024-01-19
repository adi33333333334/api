const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON in the request body with an increased payload size limit (e.g., 10MB)
app.use(bodyParser.json({ limit: '1000mb' }));

// Decoding function for the Lua 'enc' encoding
function customBase64Decode(encodedData) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

    return encodedData.replace(/....../g, function(x) {
        let value = 0;
        for (let i = 0; i < x.length; i++) {
            value += (x[i] === '1' ? 1 : 0) * Math.pow(2, 5 - i);
        }
        return charset[value];
    });
}

// Variable to store the decoded data
let decodedData = "No Data";

// Endpoint for both GET and POST requests
app.all('/api/data', (req, res) => {
    // If it's a POST request, update the decoded data
    if (req.method === 'POST') {
        const requestData = req.body;

        // Ensure that the received data is a string
        if (typeof requestData.encryptedData === 'string') {
            // Decode the data using the 'customBase64Decode' function
            decodedData = customBase64Decode(requestData.encryptedData);
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
