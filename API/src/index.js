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

    let sql = `SELECT tdi.id, name, is_done isDone
               FROM to_do_item tdi
                        join task on task.id = tdi.task_id
               where date (datetime(due_date / 1000, 'unixepoch')) = date ('now')`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        res.send({
            items: rows
        })
    });
})
app.get('/task/all', (req, res) => {

    let sql = `SELECT id, name
               from task`;

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


    db.run(`INSERT INTO task(name)
            VALUES (?)`, [req.body.name], (err) => {
        return prepareResponse(res, err)
    });
})

app.post('/task/update', (req, res) => {

    db.run(`update task
            set name = ?
            where id = ?`, [req.body.name, req.body.id], (err) => {
        return prepareResponse(res, err)
    })
})

app.post('/toDoItem/changeStatus', (req, res) => {

    const value = req.body.value ? 1 : 0;

    db.run(`update to_do_item
            set is_done = ?
            where id = ?`, [value, req.body.id], (err) => {
        return prepareResponse(res, err)
    })
})
app.post('/toDoItem/schedule', (req, res) => {

    db.run(`INSERT INTO to_do_item(task_id, due_date)
            VALUES (?, ?)`, [req.body.id, new Date()], (err) => {
        return prepareResponse(res, err)
    });
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