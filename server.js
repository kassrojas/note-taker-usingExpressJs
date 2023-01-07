const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// set up middleware as to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// GET Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

// API GET resquest for notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);

    const parsedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(parsedNotes);
})

// API POST request to add a note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        // // so new note is appended to last notes
        const readNotes = fs.readFileSync('./db/db.json', 'utf8');
        const parsedNotes = JSON.parse(readNotes);
        parsedNotes.push(newNote);

        //convert data to string so we can save it
        const noteString = JSON.stringify(parsedNotes, null, 2);

        fs.writeFile(`./db/db.json`, noteString, (err) => {
            if (err) {
                console.err(err);
            } else {
                console.log(`Note for " ${newNote.title}" has been written to JSON file`)
            }
        });

        const response = {
            status: 'Success!',
            body: newNote,
        };

        res.json(response);

    } else {
        res.json('Error in posting note');
    }
});

app.delete(`/api/notes/:id`, (req, res) => {
    const { id } = req.params;
    
    const savedNotes = fs.readFileSync('./db/db.json', 'utf-8');
    const parsedNotes = JSON.parse(savedNotes);

    const deleteNote = parsedNotes.filter((note) => {
        
       if (note.id == id) {
        res.send();
        
       } else {
        console.log('error deleting note');
       };
    });
    
    
    const noteList = JSON.stringify(deleteNote, null, 2);
    fs.writeFile(`./db/db.json`, noteList, (err) => err ? console.error(err) : console.log('Deleted note'));
    
    res.send();
});


app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
})