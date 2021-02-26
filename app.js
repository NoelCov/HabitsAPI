const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const { response } = require("express");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/habitsDB', {useNewUrlParser: true, useUnifiedTopology: true});

const habitsSchema = new mongoose.Schema({
  habit: String,
  date: String,
  email: String
})

const Habit = mongoose.model("Habit", habitsSchema);

app.route('/habits')
  // Find all habits in DB.
  .get(function(req, res){
    Habit.find({}, function(err, results){
      if (!err){
        res.send(results);
      } else {
        res.send(err);
      }
    })
  })
  // Add habit to DB.
  .post(function(req, res){
    const entry = new Habit({
      habit: req.body.habit,
      date: req.body.date,
      email: req.body.email
    })
    entry.save((err) => {
    if (!err){
      res.send("Successfully added new habit.")
    } else {
      res.send(err);
    }
  })
  })
  // Delete all habits
  .delete(function(req, res){
    Habit.deleteMany((err) => {
      if (!err){
        res.send("Successfully deleted all habits!");
      } else {
        res.send(err);
      }
    })
  });


// Route to find all the habits with the same email!
app.get('/habits/email/:email', function(req, res){
  Habit.find({email: req.params.email}, function(err, result){
    if (!err){
      res.send(result);
    } else {
      res.send(err + "User with email" + req.params.email + "not found!");
    }
  })
});

// Route to delete and update single habits.
app.route('/habits/habit/:habitName')
  .get((req, res) => {
    Habit.findOne({habit: req.params.habitName}, (err, result) =>{
      if (!err){
        res.send(result);
      } else {
        res.send(err + "Habit does not exist");
      }
    })
  })
  .delete((req, res) => {
    Habit.deleteOne(
      {habit: req.params.habitName},
      function(err){
        if (!err){
          res.send("Habit sucessfully deleted from db");
        } else {
          res.send(err);
        }
      }
    )
  })
  .patch(function(req, res){
    Habit.updateOne(
      {habit: req.params.habitName},
      {$set: req.body},
      function(err){
        if (!err){
          res.send("Successfully updated habit.")
        } else {
          res.send(err);
        }
      }
    )
  })
  .put(function(req, res){
    Habit.updateOne(
      {habit: req.params.habitName},
      {
        habit: req.body.habitName,
        date: req.body.date,
        email: req.body.email
      },
      {overwrite: true},
      function(err){
        if (!err){
          res.send("Successfully updated entry for habit.")
        }
      }
    )
  });


app.listen(5000, function(){
  console.log("Server running on port 5000");
});


