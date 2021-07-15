const {prepareResponse} = require('../controllers/basic');

const schedule = (req, res, next) => {

    let sql = `INSERT INTO to_do_item(task_id, due_date)
               VALUES (?, ?)`;

    req.app.db.run(sql, [req.body.id, new Date()], (err) => {
        return prepareResponse(res, err)
    });
};

const changeStatus = (req, res, next) => {
    const value = req.body.value ? 1 : 0;

    let sql = `update to_do_item
               set is_done = ?
               where id = ?`;

    req.app.db.run(sql, [value, req.body.id], (err) => {
        return prepareResponse(res, err)
    })
};

module.exports = {schedule, changeStatus};