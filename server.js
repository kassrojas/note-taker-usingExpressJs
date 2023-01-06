const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();


// set up middleware as to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve static files from the '/public' folder || Allows us to reference files by their relative path
app.use(express.static('public'));


// GET Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});



// API GET resquest for notes
app.get('/api/notes', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json(data);
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

        
        // // so new note is appended to last notes
        const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        console.log('data', data); 
        data.push(newNote);

        //convert data to string so we can save it
        const noteString = JSON.stringify(data, null, 2);
        
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

// GET Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
})