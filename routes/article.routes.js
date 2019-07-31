const express = require('express');
const router = express.Router();

const controller = require('../controllers/article');

router.get('/', controller.getAll);
router.post('/', controller.createOne);
router.put('/:id', controller.updateOne);
router.delete('/:id', controller.deleteOne);


module.exports = router;