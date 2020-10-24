const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors())
app.use(express.json())

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();

});

//create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo);
  } catch (err) {
    console.error(err.message);
  }
});

//delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1",[id]
    );
    res.json("Todo was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});


// show all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await pool.query(
      "SELECT * FROM todo"
    );


    res.json(todos.rows);
  } catch (err) {
    console.error(err.message);
  }
})

// get a todo
app.get('/todos/:id', async(req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(
      `SELECT * FROM todo WHERE todo_id = ${id}`
    );
    res.json(todo.rows);
    console.log(todo);
  } catch (err) {
    console.error(err.message);
  }
})

//update a todo
app.put('/todos/:id', async(req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      'UPDATE todo SET description = $1 WHERE todo_id = $2', [description, id]
    );
    res.json(updateTodo);
  } catch (err) {
    console.error(err.message);
  }
})


app.listen(5000, () => {
  console.log('server started');
});