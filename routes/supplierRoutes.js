const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");

// Rutas para Proveedores (consistentes con categorías)
router.post("/", [verifyToken, isAdmin], supplierController.create);
router.get("/", verifyToken, supplierController.findAll);
router.get("/:id", verifyToken, supplierController.findOne);
router.put("/:id", [verifyToken, isAdmin], supplierController.update);
router.delete("/:id", [verifyToken, isAdmin], supplierController.delete);

module.exports = router;