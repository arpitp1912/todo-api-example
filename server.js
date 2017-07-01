var express = require('express');
var bodyParser = require('body-parser');    
var _ = require("underscore");

var app = express();
var PORT = process.env.PORT || 3000;
var todos = []
var nextTodoID = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('Todo API Root');
});

//Get all tasks
app.get('/todos', function(req, res){
    res.json(todos);
})

//Get individual task
app.get('/todos/:id', function(req, res){
    var todoid = Number(req.params.id);

    //Find the todo item
    var matchedTodo = _.findWhere(todos, {id: todoid});

    if (matchedTodo){
        res.json(matchedTodo);
    } else{
        res.status(404).send(); //Send 404 - Page not found message to user if ID is incorrect.
    } 

    // res.send("Asking for todo with id: " + req.params.id); // Use res.send to display message on screen
})

app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        res.status(400).send();
    }

    body.description = body.description.trim();

    body.id = nextTodoID++; //Set incremented Todo ID and update value of Todo ID.

    todos.push(body)

    console.log("Task added: " + body.description);

    res.json(todos);
})

app.listen(PORT, function(){
    console.log('Express listening on port: ' + PORT + '!!');
})