//setting up express server
const express = require('express');

// inbuilt module in node to makes views folder
const path = require('path');
const port = 8000;
const app=express();

// connecting to the DB
const db=require('./config/mongoose');
const Todo = require('./models/todo');


//setting up template engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//adding static files
app.use(express.urlencoded());
app.use(express.static('assets'));

//rendering our page

app.get('/', function(req,res){
    Todo.find({}, function(err, todos){
        if(err){
            console.log('Error in fetching todos from DB');
            return ;
        }

        return res.render('home',{
            title:'My Contact List',
            todo_list:todos
        });

    });
});

//posting an object (a task) to the data base
app.post('/create_todo', function(req,res){


    Todo.create({
        description : req.body.description,
        category: req.body.category,
        date: req.body.date
    }, function(err, newTodo){
        if(err){
            console.log('Error in creating Todo!');
            return ;
        }
        console.log('*********', newTodo);

        return res.redirect('back');


    });


} );



//deleting the checked tasks from the DB
app.get('/delete-todo/', function(req, res) {

    // get the todo id from the request query
    let id=req.query;
   
    //count of all the task checked
    let total_todos_to_delete = Object.keys(id).length;

    for (let i = 0; i < total_todos_to_delete; i++) {
        //Deleting the task from the database by using their individual ids
        Todo.findByIdAndDelete(Object.keys(id)[i], function(err) {
            if (err) {
                console.log("Error in deleting the task from DB");
            }
        });
        console.log("Task-Deleted");
    }
    return res.redirect('back');
});


//checking server is running or not
app.listen(port, function(err){
    if(err){
        console.log('Error in running the server : ',err);
    }

    console.log('Server is running successfully on port :',port);

});