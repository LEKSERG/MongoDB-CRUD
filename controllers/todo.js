const Joi = require('@hapi/joi');
const { Todo } = require('../models') 

// JOI Validator Schema
const idValidator = Joi.object().keys({
    id: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required()
});

function getAllTodos (req, res) {
    
    Todo.find( {}, (err, foundTodos ) =>{
        if (foundTodos.length === 0) {
            res.send(`List is empty 
            POST to /todo`);        
        } else {
            res.send(foundTodos);   
        }
    })
};

function getTodo (req, res) {

    const id = Joi.validate(req.params, idValidator);
    if(id.error) {
        return res.status(400).send("Provide valid id" + "\n" + id.error.details[0].message);
    } else {
        Todo.findById( id.value.id, (err, foundedTodo ) =>{
            if (err) {
                return res.status(404).send("Can't find. Doesn't exist, try another id");
            }
                res.send(foundedTodo);
        });
    }
};

function createTodo ( req, res ) {

    const validator = Joi.object().keys({
        title: Joi.string().required()
    });

    const newTodo = Joi.validate(req.body, validator);
    if(newTodo.error) {
        return res.status(400).send("Enter title of todo" + "\n" + newTodo.error.details[0].message);
    } else {
        Todo.create(newTodo.value, (err, todo) => {
            if (err) {
                res.status(500).send('Database error')
            } 
                res.send(todo);                
        });
    }
};

function deleteTodo ( req, res ) {

    const todo = Joi.validate(req.params, idValidator);
    if(todo.error) {
        return res.status(400).send("Provide valid id" + "\n" + todo.error.details[0].message);
    } else {    
        Todo.findByIdAndRemove({_id: todo.value.id}, (err) => {
            if (err) {
                return res.status(404).send("Can't delete. Doesn't exist, try another id");
            }
                res.send(`Todo with id: ${todo.value.id} deleted successfully`);
        });
    }
}

function updateTodo ( req, res ) {

    const id = Joi.validate(req.params, idValidator);
    if (id.error) {
        return res.status(400).send("Provide valid id" + "\n" + id.error.details[0].message);
    } else {
        const validator = Joi.object().keys({
            completed: Joi.boolean().required()
        }); 
        const body = Joi.validate(req.body, validator);
        
        if (body.error) {
            return res.status(400).send("Provide valid boolean value for completed: true or false" + "\n" + body.error.details[0].message);
        } else {
            Todo.findByIdAndUpdate({_id: id.value.id}, {completed: body.value.completed}, (err) => {
                if (err) {
                    return res.status(404).send("Can't update. Doesn't exist, try another id");
                }
                res.send(`Todo with id: ${id.value.id} successfully updated to: ${body.value.completed}`);
            });
        }
    }    
}
module.exports = { getAllTodos, getTodo, createTodo, deleteTodo, updateTodo }