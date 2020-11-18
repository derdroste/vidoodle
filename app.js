const mongoose = require('mongoose');
const startupDebug = require('debug')('app:startup');
const dbDebug = require('debug')('app:db');
const config = require('config');
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const helmet = require('helmet');
const morgan = require('morgan');
const genres = require('./routes/genres');
const views = require('./routes/views');
const customers = require('./routes/customers');

mongoose.connect('mongodb://localhost/vidoodle')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB!'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/', views);
app.use('/api/genres', genres);
app.use('/api/customers', customers);

// Configuration
console.log('Mail Password: ' + JSON.stringify(config.get('mail')));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebug('Morgan enabled');
}

// DB work
dbDebug('Connected to the database...');

app.use(logger);

// Start App
const port = process.env.PORT || 3000;
app.listen(port, () =>  console.log(`App listening on port ${port}...`));
