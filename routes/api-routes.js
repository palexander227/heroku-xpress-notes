// import statements
const router = require('express').Router();
const util = require('util');
const fs = require('fs');
const {v4: uuidv4} = require('uuid'); //- uuid has many features; don't look at everything, look at the v4

// function definitions
//- Note: readFile and writeFile use 'promisify' to prevent 'deep nesting' by
//- changing call-backs to promises. 
const readFile = util.promisify(fs.readFile); //- any cb can be converted into a promise, util.promisify does the work for us
const writeFile = util.promisify(fs.writeFile);

const read = () => {
    return readFile('db/db.json', 'utf8');
};

const write = (note) => {
    return writeFile('db/db.json', JSON.stringify(note));
};



// reads notes from db, returns resulting array of objects ... 'notes'
// a mapping on arrays of note objects
const listNotes = () => {
    //- By returning read() instead of the result of read, we continue the promise chain.
    return read().then((n)=>{
        let notes = [];
        try{
            const stnt = JSON.parse(n);
            notes = [...stnt];            
        }
        catch(err){return []}
        return notes
    });
};



//addNote turns the incoming data into a form which can be merged with the database
// addNote is a mapping from JSON objects to itself
const addNote = note =>{    
    // if(!title || !text){throw new Error("You must enter a title AND text!")} // user validation at interface
    // using id here is useful for the delete function if we get to that   
    let newNote = {id:uuidv4(), title: note.title, text: note.text}
    return listNotes()
           .then(allNotes => [...allNotes, newNote])
           .then(newNotes => write(newNotes))
           .then(() => newNote);
};



// delete a note matching the given id number
const deleteNote = uuidFromRoute => {
    if(!uuidFromRoute){throw new Error('No ID passed.')}
    return listNotes()
           .then(notes => notes.filter(note => note.id !== uuidFromRoute))
           .then(newNotes => write(newNotes));
        //    .then((n) => n);
}        



//- nested routes '/api/notes' and returns list of stored notes
//- i.e., 'current' notes
router.get('/notes', (req, res) =>{
   listNotes()
        .then((n)=>{return res.json(n)})
        .catch((err) =>{res.status(500).json(err)})
});


//- adds individual 'note' object to stored note database
router.post('/notes', (req, res) =>{
    
   addNote(req.body)
        .then((n)=>{return res.json(n)})
        .catch((err) =>{res.status(500).json(err)})
});


//- deletes a note 'object' from the notes database
router.delete('/notes/:id', (req, res) => {
    deleteNote(req.params.id)
    .then(n=> res.status(200).json(n))
    .catch((err) =>{res.status(500).json(err)})
})





module.exports = router