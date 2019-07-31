const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todo');

router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodo);
router.post('/', todoController.createTodo);
router.delete('/:id', todoController.deleteTodo);
router.put('/:id', todoController.updateTodo);

module.exports = router;