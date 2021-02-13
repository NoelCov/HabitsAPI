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
  date: [],
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
      date: [req.body.date],
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
  })


app.route('/habits/:habit')
  .get(function(req, res){
    Habit.findOne({habit: req.params.habit}, function(err, result){
      if (!err){
        res.send(result);
      } else {
        res.send(err + "Habit not found!");
      }
    })
  })
  .put(function(req, res){
    Habit.updateOne(
      {habit: req.params.habit},
      {
        habit: req.body.habit,
        date: req.body.date,
      },
      {overwrite: true},
      function(err){
        if (!err){
          res.send("Successfully updated entry for habit.")
        }
      }
    )
  })
  .patch(function(req, res){
    Habit.updateOne(
      {habit: req.params.habit},
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
  .delete(function(req, res){
    Habit.deleteOne(
      {habit: req.params.habit},
      function(err){
        if (!err){
          res.send("Habit sucessfully deleted from db");
        } else {
          res.send(err);
        }
      }
    )
  })

app.listen(5000, function(){
  console.log("Server running on port 5000");
});


