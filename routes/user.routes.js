const express = require('express');
const router = express.Router();

const controller = require('../controllers/user');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.get('/:id/articles', controller.getUserArticles);
router.post('/', controller.createOne);
router.delete('/:id', controller.deleteOne);
router.put('/:id', controller.updateOne);

module.exports = router;