var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'drink water',
    completed: false
},{
    id: 2,
    description: 'Finish course',
    completed: false
}, {
    id: 3,
    description: 'Finish lecture',
    completed: true
}]

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
    var matchedTodo;
    // res.send(typeof todos[0].id);
    
    for (i = 0; i < todos.length; i++){
        if (todoid === todos[i].id){
            matchedTodo = todos[i]
        }
    }

    if (matchedTodo){
        res.json(matchedTodo);
    } else{
        res.status(404).send(); //Send 404 - Page not found message to user if ID is incorrect.
    } 

    // res.send("Asking for todo with id: " + req.params.id); // Use res.send to display message on screen
})

app.listen(PORT, function(){
    console.log('Express listening on port: ' + PORT + '!!');
})