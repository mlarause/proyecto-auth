const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { verifyToken } = require("../middlewares/auth");
const checkRole = require("../middlewares/role");

// Permisos:
// - Admin: CRUD completo
// - Coordinador: Crear, Leer, Actualizar
// - Auxiliar: Solo Leer

router.post(
  "/",
  verifyToken,
  checkRole(["admin", "coordinador"]),
  supplierController.createSupplier
);

router.get("/", verifyToken, supplierController.getAllSuppliers);

router.get("/:id", verifyToken, supplierController.getSupplierById);

router.put(
  "/:id",
  verifyToken,
  checkRole(["admin", "coordinador"]),
  supplierController.updateSupplier
);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  supplierController.deleteSupplier
);

module.exports = router;