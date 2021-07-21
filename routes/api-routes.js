const path = require('path');
const router = require('express').Router();
const util = require('util');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const read = () => {
    return readFile('./db/db.json', 'utf8')
};

const write = (note) => {
    return writeFile('./db/db.json', JSON.stringify(note))
};

const listNotes = () => {
    return read().then((n)=>{
        let notes = [];
        notes.push(JSON.parse(n))
        return notes
    })
}


//- nested routes '/api/notes'
router.get('/notes', (req, res) =>{
   listNotes().then((n)=>{return res.json(n)})
} );



module.exports = router