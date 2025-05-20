const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authJwt = require("../middlewares/authJwt");

router.get("/", [authJwt.verifyToken, authJwt.isAdmin], userController.findAll);
router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.findOne);
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.update);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.delete);

module.exports = router;