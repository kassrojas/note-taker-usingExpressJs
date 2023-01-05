const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const dbJ = require('./db/db.json');


const PORT = 3001;

const app = express();

// const notesArray = [];

// set up middleware as to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve static files from the '/public' folder || Allows us to reference files by their relative path
app.use(express.static('public'));


// GET Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

// GET Route for homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// API GET resquest for notes
app.get('/api/notes', (req, res) => {
    res.json(dbJ);
    // send message to client
    res.json(`${req.method} request received to get notes`);
    // log request to terminal
    console.info(`${req.method} request received`);
})

// API POST request to add a note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);

    // destructuring note for items in req.body
    const { title, text } = req.body;

    // if all required properties exist
    if (title && text){
        // instantiate variable for saved object
        const newNote = {
            title, 
            text,
            noteId: uuid(),
        };

        readAndAppend(newNote, './db/db.json');

        

        
        // // so new note is appended to last notes
        const readNote = fs.readFileSync('./db/db.json', 'utf8');
        const parsedNote = JSON.parse(readNote);
        console.log(`PARSED NOTE: ${parsedNote}`); //object
        parsedNote.push(newNote);

        // notesArray.push(newNote);
        // console.log('notes array: ', notesArray); // note coming back as an array of objects
        
        //convert data to string so we can save it
        const noteString = JSON.stringify(newNote, null, 2);
        
        
        fs.writeFile(`./db/db.json`, noteString, (err) => {
            if (err){
                console.err(err);
            } else {
                console.log(`Note for ${newNote.title} has been written to JSON file`)
            }
        });
        
        const response = {
            status: 'Success!',
            body: newNote,
        };

        console.log(response);
        res.json(response);

    } else {
        res.json('Error in posting note');
    }
});


app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
})