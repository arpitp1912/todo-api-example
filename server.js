var express = require('express');
var bodyParser = require('body-parser');    
var _ = require("underscore");
var db = require('./db.js');

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
    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty("completed") && queryParams.completed === "true"){
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty("completed") && queryParams.completed === "false"){
        filteredTodos = _.where(filteredTodos, {completed: false});
    }

    if (queryParams.hasOwnProperty("q") && _.isString(queryParams.q)){
        filteredTodos = _.filter(filteredTodos, function(filteredTodo){
            // var todoDescription = filteredTodo.description;
            return filteredTodo.description.toLowercase.indexOf(queryParams.q.toLowercase) > -1;
        })
    }
    res.json(filteredTodos);
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

    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }).catch(function(e){
        res.status(400).json(e);
    })

    // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    //     return res.status(400).send();
    // }

    // body.description = body.description.trim();

    // body.id = nextTodoID++; //Set incremented Todo ID and update value of Todo ID.

    // todos.push(body)

    // console.log("Task added: " + body.description);

    // res.json(todos);
})

app.delete('/todos/:id', function(req, res){
    var todoid = parseInt(req.params.id, 10);
    
    var matchedTodo = _.findWhere(todos, {id: todoid});

    if(!matchedTodo) {
        return res.status(404).json({"error":"No task found with given id"});
    }

    console.log("Removing Task: " + matchedTodo.description)

    todos = _.without(todos, matchedTodo);

    console.log("Removed Task: " + matchedTodo.description);

    res.json(todos);

})

app.put('/todos/:id', function(req, res){
    var todoid = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoid});

    if(!matchedTodo) {
        return res.status(404).json({"error":"No task found with given id"});
    }
    
    var body = _.pick(req.body, 'description', 'completed');

    var validAttritubes = {};

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttritubes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')){
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        body.description = body.description.trim();
        validAttritubes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchedTodo, body);

    res.json(todos)

})


// app.put('/todos/:id', function(req, res){
//     var todoid = parseInt(req.params.id, 10);
    
//     var body = _.pick(req.body, 'description', 'completed');
//     var validAttritubes = {};

//     if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
//         validAttritubes.completed = body.completed;
//     } else if (body.hasOwnProperty('completed')){
//         return res.status(400).send();
//     }

//     if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
//         validAttritubes.description = body.description;
//     } else if (body.hasOwnProperty('description')) {
//         return res.status(400).send();
//     }

//     res.json(body);

// })

db.sequelize.sync().then (function(){
    app.listen(PORT, function(){
        console.log('Express listening on port: ' + PORT + '!!');
    })
})

