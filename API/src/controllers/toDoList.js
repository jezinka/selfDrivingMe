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

module.exports = {today};