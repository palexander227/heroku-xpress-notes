const path = require('path');

//- Router is a method of 'express' which is used to define subroutes 
const router = require('express').Router();

//- listen for 'get' requests at '/notes' endpoint
router.get('/notes', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/notes.html'))
} );

// catch for any thing missed above, no 404 error, just return to home page
router.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/index.html'));
} );

module.exports = router