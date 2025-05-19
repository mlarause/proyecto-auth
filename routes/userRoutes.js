const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authJwt');
const userController = require('../controllers/userController');

router.get('/', [verifyToken, isAdmin], userController.getAll);
router.get('/:id', verifyToken, userController.getById);
router.put('/:id', verifyToken, userController.update);
router.delete('/:id', [verifyToken, isAdmin], userController.delete);
router.get('/', [verificarToken, esAdmin], listarUsuarios);

module.exports = router;