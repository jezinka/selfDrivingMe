const express = require('express')
const app = express()
const port = 3000
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors()) // Use this after the variable declaration

let db = new sqlite3.Database('./db/selfDrivingMe.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the selfDrivingMe database.');
})

app.get('/today', (req, res) => {

    let sql = `SELECT id, name, is_done isDone
               FROM task`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        res.send({
            items: rows
        })
    });
})

app.post('/task/add', (req, res) => {
    console.log(req.body);


    db.run(`INSERT INTO task(name, due_date)
            VALUES (?, date (?))`, [req.body.name, req.body.dueDate], (err) => {return prepareResponse(res, err)});
})

app.post('/task/update', (req, res) => {

    db.run(`update task
            set due_date = ?
            where id = ?`, [req.body.dueDate, req.body.id], (err) => {return prepareResponse(res, err)})
})

app.post('/task/changeStatus', (req, res) => {

    const value = req.body.value ? 1 : 0;

    db.run(`update task
            set is_done = ?
            where id = ?`, [value, req.body.id], (err) => {return prepareResponse(res, err)})
})

function prepareResponse(res, err) {
    if (err) {
        return res.send({status: 'ERROR'})
    }
    return res.send({status: 'OK'})
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})