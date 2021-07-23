const express = require('express');
// getting our html routes
const htmlRoutes = require('./routes/html-routes');
// getting our api
const apiRoutes = require('./routes/api-routes');
const PORT = process.env.PORT || 3001; //- for production setup

const app = express();

// custom configurations of app
app.use(express.json()); //- jasonifies incoming requst objects
app.use(express.urlencoded({extended: true})); //- post requests are allowed to be nested objects 
app.use(express.static('public')); 
app.use('/api', apiRoutes); //- traffic management 
app.use('/', htmlRoutes);



app.listen(PORT, () =>
  console.info(`Heroku Notes listening at http://localhost:${PORT} 🚀`)
);