const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "/public/index.html"));
// });

//function to navigate user to notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//function to get notes from database to render on the page
app.get("/api/notes", (req, res) => res.status(200).json(notes));

//function to add a new note
app.post("/api/notes", (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(500).json({msg: "Error in saving the note"});
  }
  const newNote = {
    title,
    text,
    id: uuidv4(),
  };

  const response = {
    status: "success",
    body: newNote,
  };

  notes.push(newNote);

  fs.writeFile("./db/db.json", JSON.stringify(notes), (err) =>
    err ? console.error(err) : console.log("New note successfully saved")
  );

  res.status(201).json(response);

  //old code
  // Checking if all the required properties are present
  // if (title && text) {
  //   const newNote = {
  //     title,
  //     text,
  //     id: uuidv4(),
  //   };

  //   const response = {
  //     status: "success",
  //     body: newNote,
  //   };

  //   notes.push(newNote);

  //   fs.writeFile("./db/db.json", JSON.stringify(notes), (err) =>
  //     err ? console.error(err) : console.log("New note successfully saved")
  //   );

  //   console.log(response);
  //   res.status(201).json(response);
  // } else {
  //   res.status(500).json("Error in saving the note");
  // }
});

//function to delete a note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;

  const indexToDelete = notes.findIndex((note) => note.id === id);
  if (indexToDelete === -1) {
    return res.status(500).json({msg: "Note is not found"});
  }
  notes.splice(indexToDelete, 1);
  console.log(notes);

  fs.writeFile("./db/db.json", JSON.stringify(notes), (err) =>
    err ? console.error(err) : console.log("Note deleted")
  );

  res.status(200).json({ msg: "Successfully deleted" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
