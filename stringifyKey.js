const fs = require("fs");

// Read the service account JSON
const serviceAccount = require("./serviceAccountKey.json");

// Convert it to a single-line string
const stringified = JSON.stringify(serviceAccount);

// Output it to console
console.log(stringified);
