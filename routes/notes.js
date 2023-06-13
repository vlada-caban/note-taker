const notes = require("express").Router();
const notesDB = require("../db/db.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//function to get notes from database to render on the page
notes.get("/", (req, res) => res.status(200).json(notesDB));

//function to add a new note
notes.post("/", (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(500).json({ msg: "Error in saving the note" });
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

  notesDB.push(newNote);

  fs.writeFile("./db/db.json", JSON.stringify(notesDB), (err) =>
    err ? console.error(err) : console.log("New note successfully saved")
  );

  res.status(201).json(response);
});

//function to delete a note
notes.delete("/:id", (req, res) => {
  const id = req.params.id;

  const indexToDelete = notesDB.findIndex((note) => note.id === id);
  if (indexToDelete === -1) {
    return res.status(500).json({ msg: "Note is not found" });
  }
  notesDB.splice(indexToDelete, 1);

  fs.writeFile("./db/db.json", JSON.stringify(notesDB), (err) =>
    err ? console.error(err) : console.log("Note deleted")
  );

  res.status(200).json({ msg: "Successfully deleted" });
});

//function to update a note
notes.put("/:id", (req, res) => {
  const id = req.params.id;

  const indexToUpdate = notesDB.findIndex((note) => note.id === id);
  if (indexToUpdate === -1) {
    return res.status(500).json({ msg: "Note is not found" });
  }
  notesDB[indexToUpdate] = req.body;
  console.log(notesDB);

  fs.writeFile("./db/db.json", JSON.stringify(notesDB), (err) =>
    err ? console.error(err) : console.log("Note updated")
  );

  res.status(200).json({ msg: "Successfully updated" });
});

module.exports = notes;
