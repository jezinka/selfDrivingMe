const app = require('../src/server') // Link to your server file
const supertest = require('supertest');
const sqlite3 = require("sqlite3");
const request = supertest(app)

it('gets all tasks', async () => {

    for (let i of ['medytacja', 'podlać kwiatki']) {
        app.db.run(`INSERT INTO task(name)
                    VALUES (?)`, [i], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    const response = await request.get('/task/all')

    expect(response.body.items.length === 2)

    app.db.run("delete from task where 1=1")
})