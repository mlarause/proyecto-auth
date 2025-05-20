const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const authJwt = require("../middlewares/authJwt");

// Ruta para crear proveedor (solo admin)
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], supplierController.create);

// Ruta para obtener todos los proveedores (requiere autenticación)
router.get("/", authJwt.verifyToken, supplierController.findAll);

// Ruta para obtener un proveedor por ID (requiere autenticación)
router.get("/:id", authJwt.verifyToken, supplierController.findOne);

// Ruta para actualizar proveedor (solo admin)
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], supplierController.update);

// Ruta para eliminar proveedor (solo admin)
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], supplierController.delete);

module.exports = router;