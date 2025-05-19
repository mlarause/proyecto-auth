const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authJwt');
const userController = require('../controllers/userController');

router.get('/', [verifyToken, isAdmin], userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', [verifyToken, isAdmin], userController.deleteUser);

module.exports = router;