const moment = require("moment");
const today = (req, res, next) => {

    let sql = `SELECT id, name, is_done isDone
               FROM todo_list
               where date(datetime(due_date / 1000, 'unixepoch')) = date('now')`;

    req.app.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        res.send({items: rows})
    });
};

const week = (req, res, next) => {

    let startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD')
    let endOfWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');

    let sql = `SELECT id, name, is_done isDone, date(datetime(due_date / 1000, 'unixepoch')) dueDate
               FROM todo_list
               where date(datetime(due_date / 1000, 'unixepoch')) between '${startOfWeek}' and '${endOfWeek}'`;

    req.app.db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        res.send({items: rows})
    });
};

module.exports = {today, week};