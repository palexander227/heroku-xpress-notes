// import statements
const router = require('express').Router();
const util = require('util');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

// function definitions
//- Note: readFile and writeFile use 'promisify' to prevent 'deep nesting' by
//- changing call-backs to promises. 
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const read = () => {
    return readFile('db/db.json', 'utf8');
};

const write = (note) => {
    return writeFile('db/db.json', JSON.stringify(note));
};

const listNotes = () => {
    //- By returning read() instead of the result of read, we continue the promise chain.
    return read().then((n)=>{
        let notes
        try{
            notes = [].concat(JSON.parse(n))
        }
        catch(err){notes = []}
        return notes
    });
};


//addNote turns the incoming data into a form which can be merged with the database
const addNote = note =>{
    let {title, text} = note
    // if(!title || !text){throw new Error("You must enter a title AND text!")} // user validation at interface
    // using id here is useful for the delete function if we get to that   
    let newNote = {id:uuidv4(), title, text}
    return listNotes()
           .then(allNotes => [...allNotes, newNote])
           .then(newNotes => write(newNotes))
           .then(() => newNote);
};


//- nested routes '/api/notes'
router.get('/notes', (req, res) =>{
   listNotes()
        .then((n)=>{return res.json(n)})
        .catch((err) =>{res.status(500).json(err)})
});

router.post('/notes', (req, res) =>{
    
   addNote(req.body)
        .then((n)=>{return res.json(n)})
        .catch((err) =>{res.status(500).json(err)})

});



// router.delete('/notes/:id', (req, res) => {


// }


// )





module.exports = router