var express = require('express');
var bodyParser = require('body-parser');    
var _ = require("underscore");
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var nextTodoID = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('Todo API Root');
});

//Get all tasks
app.get('/todos', function(req, res){
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty("completed") && query.completed === "true"){
        where.completed = true;
    } else if (query.hasOwnProperty("completed") && query.completed === "false"){
        where.completed = false;
    } 

    if (query.hasOwnProperty("q") && query.q.trim().length > 0){
        where.description = {
            $like : '%' + query.q + '%' 
        };
    }

    db.todo.findAll({where: where}).then(function(todos){
        res.json(todos);
    }, function(e){
        res.status(500).send();
    });
})

//Get individual task
app.get('/todos/:id', function(req, res){
    var todoid = Number(req.params.id);

    //Find the todo item
    db.todo.findById(todoid).then(function(todo){
       if(!!todo){
        res.json(todo.toJSON());
       }else {
        res.status(404).send();
       }   
   }, function(e){
       res.status(500).send();
   })

})

app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }).catch(function(e){
        res.status(400).json(e);
    })
})

app.delete('/todos/:id', function(req, res){
    var todoid = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoid
        }
    }).then(function(rowsDeleted){
        if (rowsDeleted === 0){
                res.status(404).json({
                    "error": "Unable to find task with ID"
                });
        } else {
            res.status(204).send();
        }
    }, function(e){
        res.status(500).send();
    });

})

app.put('/todos/:id', function(req, res){
    var todoid = parseInt(req.params.id, 10);
    
    var body = _.pick(req.body, 'description', 'completed');

    var attritubes = {};

    if (body.hasOwnProperty('completed')){
        attritubes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')){
        attritubes.description = body.description;
    }

    db.todo.findById(todoid).then(function(todo){
        if (todo){
            return todo.update(attritubes).then(function(todo){
            res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e);
    })
        } else {
            res.status(404).json({
                    "error": "Unable to find task with ID"
                });
        }
    }, function(){
        res.status(500).send()
    })
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

