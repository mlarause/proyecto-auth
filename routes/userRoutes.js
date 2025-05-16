const express = require('express');
const router = express.Router();
const { authJwt } = require('../middlewares');  // Cambia esta línea
const userController = require('../controllers/userController');

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Rutas POST (autenticación)
router.post('/register', userController.register); // ← Asegúrate de que 'register' exista en userController
router.post('/login', userController.login);      // ← Igual para 'login'
router.get('/all', userController.allAccess);
router.get('/user', [authJwt.verifyToken], userController.userBoard);
router.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);
router.get('/coordinador', [authJwt.verifyToken, authJwt.isCoordinador], userController.coordinadorBoard);
router.get('/auxiliar', [authJwt.verifyToken, authJwt.isAuxiliar], userController.auxiliarBoard);
// Rutas GET/PUT/DELETE (si las necesitas)
router.get('/', userController.getUsers);         // ← Ejemplo de ruta GET
router.get('/:id', userController.getUser);      // ← Ruta con parámetro
router.put('/:id', userController.updateUser);   // ← Ruta PUT
router.delete('/:id', userController.deleteUser);// ← Ruta DELETE


module.exports = router;