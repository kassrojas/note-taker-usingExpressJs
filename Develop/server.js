const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const dbJ = require('./db/db.json')

const PORT = 3001;

const app = express();

// set up middleware as to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve static files from the '/public' folder || Allows us to reference files by their relative path
app.use(express.static('public'));

// HTML routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

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
        }
        
        // so new note does not overwrite file, just adds new note to existing
        const readNote = fs.readFileSync('./db/db.json', 'utf8');
        const parsedNote = JSON.parse(readNote);
        parsedNote.push(newNote);
        
        //convert data to string so we can save it
        const noteString = JSON.stringify(newNote, null, 2);
        
        const filename = newNote.title.toLowerCase().replaceAll(' ', '-');
        
        fs.writeFile('./db/db.json', noteString, (err) => {
            if (err){
                console.log(err);
            } else {
                console.log(`Note for ${newNote.title} has been written to JSON file`)
            }
        });
        
        const response = {
            status: 'Success!',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});


app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
})