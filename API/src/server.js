const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors')
const taskRoutes = require('./routes/task');
const toDoItemRoutes = require('./routes/toDoItem');
const toDoListRoutes = require('./routes/toDoList');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors()) // Use this after the variable declaration

let databaseName = process.env.NODE_ENV === 'test' ? './db/test.db' : './db/selfDrivingMe.db'

app.db = new sqlite3.Database(databaseName, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log(`Connected to the ${databaseName} database.`);
    }
})

app.use('/', toDoListRoutes)
app.use('/task', taskRoutes);
app.use('/toDoItem', toDoItemRoutes);

module.exports = app