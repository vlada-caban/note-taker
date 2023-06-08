const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => res.status(200).json(notes));

app.post("/api/notes", (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    const response = {
      status: "success",
      body: newNote,
    };

    let savedNotes = notes;
    // console.log(savedNotes);
    savedNotes.push(newNote);
    // console.log(savedNotes);

    fs.writeFile(`./db/db.json`, JSON.stringify(savedNotes), (err) =>
      err
        ? console.error(err)
        : console.log(
            `New note successfully saved`
          )
    );

    // const noteString = JSON.stringify(newNote);
    // console.log(noteString);
    // let existingNotes = JSON.stringify(notes);
    // let arrayOfNotes = eval(existingNotes)
    // console.log(existingNotes);
    // console.log(arrayOfNotes);

    // arrayOfNotes.push(noteString);
    // console.log(arrayOfNotes);

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in saving the note");
  }
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
