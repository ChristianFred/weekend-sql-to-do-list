const { Router } = require('express');
const express = require('express');
const router = express.Router();
const pg = require('pg');
const pool = require('../modules/pool');

// The command to get todo requests from the database.
router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "todo";';
    pool.query(queryText).then(result => {
        res.send(result.rows);
    }).catch(err => {
        console.log('error getting tasks from database', error);
        res.sendStatus(500);
    });
});

// adding a new task to the todo database.
router.post('/', (req, res) => {
    let newTask = req.body;
    console.log('Adding a new task to the database', newTask);

    let queryText = `INSERT INTO "todo" ("task","completed")
                        VALUES ($1, $2,);`;
    pool.query(queryText, [newTask.task, newTask.completed])
        .then(result => {
            res.sendStatus(201);
        }).catch(error => {
            console.log(`Error adding new task`, error);
            res.sendStatus(500);
        });
});
// Updating A task on the database to read as completed. 
router.put('/:id', (req, res) => {
    console.log('id is', req.params.id);
    console.log('completed status is', req.body.completed);
    const sqlQuery = `
    UPDATE "todo"
    SET "completed" = true
    WHERE "id" = $1;
    `;
    const sqlParams = [
        req.params.id
    ];
    pool.query(sqlQuery, sqlParams)
        .then((dbRes) => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log('UPDATE err', err);
            res.sendStatus(500);
        });
});

// DELETE gets rid of a task regardless of completion status.
router.delete('/:id', (req, res) => {
    const idToDelete = req.params.id
    let sqlQuery = `
    DELETE FROM "todo"
    WHERE id=$1;
    `;
    const sqlParams = [idToDelete];
    pool.query(sqlQuery, sqlParams)
        .then((dbRes) => {
            res.sendStatus(200);
        }).catch((err) => {
            console.log('DELETE err', err);
            res.sendStatus(500);
        });
});
module.exports = router;