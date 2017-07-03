var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect' : 'sqlite',
    'storage' : __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validare: {
            len: [1,256]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false
    }
});

sequelize.sync().then(function(){
    console.log('Everything is synced!');

//    Todo.findById(10).then(function(todo){
//        if(todo){
//         console.log(todo.toJSON());
//        }else {
//         console.log("Task not found!");
//        }
       
//    })

    Todo.findAll({
        where: {
            description: {
                $like : '%caasdas%'
            }
        }
    }).then(function(todos){
        // if (todos){
        //     todos.forEach(function(todo) {
        //     console.log(todo.toJSON());
        // })   
        // } else {
        //     console.log("Task not found!");
        // }
        if (todos) {
            todos.forEach(function(todo){
                console.log(todo.toJSON());
            })
        } else {
            console.log("Todo not found");
        }
    })

    // Todo.create({
    //     description: 'Go for movie',
    //     // completed: false
    // }).then(function(todo){
    //     console.log("Finished adding task");
    //     console.log(todo)
    // }).catch(function(e){
    //     console.log(e);
    // })
});