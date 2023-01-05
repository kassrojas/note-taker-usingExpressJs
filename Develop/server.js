const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve static files from the '/public' folder
app.use(express.static('public'));

// route that will serve up the `public/notes.html` page
app.get('/notes', (request, response) => {
    response.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
})