let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let connectionString = 'mongodb://mongodb0.example.com:27017'
const MongoClient = require('mongodb').MongoClient
const mongoConnectionString = "mongodb://localhost:27017"
let Pool = require('pg').Pool;
const pool = new Pool({
  user: 'todolist',
  host: 'localhost',
  database: 'todolist',
  password: 'Aa123456',
  port: 5432,
})
let app = express();
app.use(cors());
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(jsonParser);
app.use(urlencodedParser);
let global_counter;

app.get('/tasks', function (req, res) {
      pool.query('SELECT * FROM public.todolist', (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      })
})

app.post('/newTask', function(req, res) {
   let task = req.body.task
   pool.query('INSERT INTO public.todolist (task, isdone) VALUES ($1, $2)', [task, false], (error, results) => {
      if (error) {
         throw error
      }
      res.status(201).send(`Task added`)
   })
   MongoClient.connect("mongodb://localhost:27017", function (err, client) {
      let db = client.db('todolist');
      console.log("connection successful")
      db.collection('counters').findOneAndUpdate({'_id':'productid'},
         {$inc: {'sequence_value': 1}}).then(result => {
            db.collection('todolist').insertOne({   
            "id" : result.value.sequence_value, 
            "task" : req.body.task, 
            "isdone" : false })
          });
      });
   });

app.put('/markDone', function (req, res) {
   let isdone = !req.body.isdone
   let id = req.body.id
   pool.query('UPDATE public.todolist SET isdone = $1 WHERE id = $2', [isdone,id], (error, results) => {
      if (error) {
         throw error
      }
      res.status(201).send(`Task done`)
   })
   console.log("here")
   MongoClient.connect("mongodb://localhost:27017", function (err, client) {
      let db = client.db('todolist');
      console.log("connection successful")
      db.collection('todolist').findOneAndUpdate({'id':req.body.id},
         {$set: {'isdone': true}})
          });
      });

 app.delete('/deleteTask', function (req, res) {
   let id = req.body.id
   pool.query('DELETE FROM public.todolist WHERE id = $1', [id], (error, results) => {
      if (error) {
         throw error
      }
      res.status(201).send(`Task deleted`)
   })
   MongoClient.connect("mongodb://localhost:27017", function (err, client) {
      let db = client.db('todolist');
      console.log("connection successful")
      db.collection('todolist').findOneAndDelete({'id':req.body.id})
          });
      });

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})