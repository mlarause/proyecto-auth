const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const authJwt = require("../middlewares/authJwt");

// Admin: CRUD completo
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], supplierController.create);
router.get("/", authJwt.verifyToken, supplierController.findAll);
router.get("/:id", authJwt.verifyToken, supplierController.findOne);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], supplierController.update);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], supplierController.delete);

// Coordinador: Actualización parcial
router.patch("/:id", [authJwt.verifyToken, authJwt.isCoordinator], supplierController.partialUpdate);

module.exports = router;