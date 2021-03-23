i've tried to upload the node modules, hopefully it didnt cause any problems
if it did 
npm install express body-parser cors mongodb pg
should solve the dependencies


for the dbs:
on mongo:
in the mongo cli paste this :
  use todolist
  db.createCollection("counters")
  db.counters.insertOne({_id:"productid",sequence_value:1})
  db.createCollection("todolist")
  
if your db is not on default value please paste your connection string into the connection string variable in index.js

on postgres:
use either one of the backups listed, one is sql and the other tar.
please look at the pool variable in index.js and make sure all your details are correct
