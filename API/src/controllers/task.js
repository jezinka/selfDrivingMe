const {prepareResponse} = require('../controllers/basic');

const add = (req, res, next) => {
    console.log(req.body);

    let sql = `INSERT INTO task(name, is_habit, type)
               VALUES (?, ?, ?)`;

    req.app.db.run(sql, [req.body.name, req.body.isHabit, req.body.type], (err) => {
        return prepareResponse(res, err)
    });
};

const update = (req, res, next) => {

    let sql = `update task
               set name = ?
               where id = ?`;

    req.app.db.run(sql, [req.body.name, req.body.id], (err) => {
        return prepareResponse(res, err)
    })
};

const all = (req, res, next) => {

    let sql = `SELECT id, name, is_habit isHabit, type
               from task`;

    req.app.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        res.send({items: rows})
    });
}

module.exports = {add, update, all};