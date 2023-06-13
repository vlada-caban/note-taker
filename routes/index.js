const express = require("express");

// Import files containing routes
const notesRouter = require("./notes");

// Create and instance of express to apply the middleware and routing
const app = express();

app.use("/notes", notesRouter);

module.exports = app;
