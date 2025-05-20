const db = require("../models");
const Supplier = db.supplier;
const Product = db.product;
const { Op } = require("sequelize");

// Crear y guardar un nuevo proveedor
const logOperation = (operation) => {
    console.log(`[SUPPLIER] Operación: ${operation}`);
};

exports.create = async (req, res) => {
    logOperation("CREATE");
    try {
        if (!req.body.name) {
            return res.status(400).json({
                success: false,
                message: "El nombre del proveedor es requerido"
            });
        }

        // Convertir products a array
        const productIds = req.body.products ? 
            (Array.isArray(req.body.products) ? req.body.products : [req.body.products]) : 
            [];

        // Validar productos
        if (productIds.length > 0) {
            const productsExist = await Product.count({
                where: { id: productIds }
            });
            
            if (productsExist !== productIds.length) {
                console.log("[SUPPLIER] Productos no encontrados:", productIds);
                return res.status(400).json({
                    success: false,
                    message: "Algunos productos no existen"
                });
            }
        }

        // Crear proveedor
        const supplier = await Supplier.create({
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        });

        // Asociar productos
        if (productIds.length > 0) {
            await supplier.setProducts(productIds);
            console.log("[SUPPLIER] Productos asociados:", productIds);
        }

        res.status(201).json({
            success: true,
            message: "Proveedor creado exitosamente",
            data: await Supplier.findByPk(supplier.id, {
                include: [{
                    model: Product,
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }]
            })
        });

    } catch (error) {
        console.error("[SUPPLIER] Error en create:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error al crear el proveedor"
        });
    }
};

// Obtener todos los proveedores (igual estructura que productos)
exports.findAll = async (req, res) => {
    try {
        const { name, status } = req.query;
        let whereCondition = {};

        if (name) whereCondition.name = { [Op.like]: `%${name}%` };
        if (status !== undefined) whereCondition.status = status === 'true';

        const data = await Supplier.findAll({
            where: whereCondition,
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }],
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error al obtener los proveedores"
        });
    }
};

// Obtener un proveedor por ID (igual que productos)
exports.findOne = async (req, res) => {
    try {
        const data = await Supplier.findByPk(req.params.id, {
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }]
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: `Proveedor con id=${req.params.id} no encontrado`
            });
        }

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al obtener el proveedor con id=${req.params.id}`
        });
    }
};

// Actualizar un proveedor (igual estructura que productos)
exports.update = async (req, res) => {
    try {
        // Validar productos si se proporcionan
        if (req.body.products) {
            const productIds = Array.isArray(req.body.products) ? 
                req.body.products : 
                [req.body.products];
                
            const productsCount = await Product.count({
                where: { id: productIds }
            });
            
            if (productsCount !== productIds.length) {
                return res.status(400).json({
                    success: false,
                    message: "Algunos productos no existen"
                });
            }
        }

        const [numUpdated] = await Supplier.update(req.body, {
            where: { id: req.params.id }
        });

        if (numUpdated === 0) {
            return res.status(404).json({
                success: false,
                message: `No se encontró el proveedor con id=${req.params.id}`
            });
        }

        // Actualizar relación con productos si se especificó
        if (req.body.products) {
            const supplier = await Supplier.findByPk(req.params.id);
            const productIds = Array.isArray(req.body.products) ? 
                req.body.products : 
                [req.body.products];
            await supplier.setProducts(productIds);
        }

        const updatedSupplier = await Supplier.findByPk(req.params.id, {
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }]
        });

        res.json({
            success: true,
            message: "Proveedor actualizado exitosamente",
            data: updatedSupplier
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al actualizar el proveedor con id=${req.params.id}`
        });
    }
};

// Eliminar un proveedor (igual que productos)
exports.delete = async (req, res) => {
    try {
        const numDeleted = await Supplier.destroy({
            where: { id: req.params.id }
        });

        if (numDeleted === 0) {
            return res.status(404).json({
                success: false,
                message: `No se encontró el proveedor con id=${req.params.id}`
            });
        }

        res.json({
            success: true,
            message: "Proveedor eliminado exitosamente"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al eliminar el proveedor con id=${req.params.id}`
        });
    }
};

// Actualización parcial para coordinadores
exports.partialUpdate = async (req, res) => {
    try {
        // Campos permitidos para coordinadores
        const allowedFields = ['contact', 'email', 'phone', 'address'];
        const updateData = {};
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const [numUpdated] = await Supplier.update(updateData, {
            where: { id: req.params.id }
        });

        if (numUpdated === 0) {
            return res.status(404).json({
                success: false,
                message: `No se encontró el proveedor con id=${req.params.id}`
            });
        }

        const updatedSupplier = await Supplier.findByPk(req.params.id);

        res.json({
            success: true,
            message: "Proveedor actualizado parcialmente",
            data: updatedSupplier
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al actualizar el proveedor con id=${req.params.id}`
        });
    }
};