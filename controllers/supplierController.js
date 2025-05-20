const db = require("../models");
const Supplier = db.supplier;
const Product = db.product;

// Obtener todos los proveedores
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll({
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }],
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            count: suppliers.length,
            data: suppliers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error al obtener los proveedores"
        });
    }
};

// Obtener un proveedor por ID
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id, {
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }]
        });

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: `Proveedor con id=${req.params.id} no encontrado`
            });
        }

        res.json({
            success: true,
            data: supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al obtener el proveedor con id=${req.params.id}`
        });
    }
};

// Crear nuevo proveedor
exports.createSupplier = async (req, res) => {
    try {
        // Validación
        if (!req.body.name) {
            return res.status(400).json({
                success: false,
                message: "El nombre del proveedor es requerido"
            });
        }

        // Convertir products a array si es necesario
        const productIds = req.body.products ? 
            (Array.isArray(req.body.products) ? req.body.products : [req.body.products] ): 
            [];

        // Validar productos existentes
        if (productIds.length > 0) {
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
        }

        res.status(201).json({
            success: true,
            message: "Proveedor creado exitosamente",
            data: supplier
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error al crear el proveedor"
        });
    }
};

// Actualizar proveedor
exports.updateSupplier = async (req, res) => {
    try {
        const [updated] = await Supplier.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated) {
            // Si se enviaron productos, actualizar la relación
            if (req.body.products) {
                const supplier = await Supplier.findByPk(req.params.id);
                const productIds = Array.isArray(req.body.products) ? 
                    req.body.products : [req.body.products];
                await supplier.setProducts(productIds);
            }

            const updatedSupplier = await Supplier.findByPk(req.params.id, {
                include: [{
                    model: Product,
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }]
            });

            return res.json({
                success: true,
                message: "Proveedor actualizado exitosamente",
                data: updatedSupplier
            });
        }

        res.status(404).json({
            success: false,
            message: `No se encontró el proveedor con id=${req.params.id}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al actualizar el proveedor con id=${req.params.id}`
        });
    }
};

// Eliminar proveedor
exports.deleteSupplier = async (req, res) => {
    try {
        const deleted = await Supplier.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            return res.json({
                success: true,
                message: "Proveedor eliminado exitosamente"
            });
        }

        res.status(404).json({
            success: false,
            message: `No se encontró el proveedor con id=${req.params.id}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al eliminar el proveedor con id=${req.params.id}`
        });
    }
};

// Actualización parcial para coordinadores
exports.partialUpdateSupplier = async (req, res) => {
    try {
        const allowedFields = ['contact', 'email', 'phone', 'address'];
        const updateData = {};
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const [updated] = await Supplier.update(updateData, {
            where: { id: req.params.id }
        });

        if (updated) {
            const updatedSupplier = await Supplier.findByPk(req.params.id);
            return res.json({
                success: true,
                message: "Proveedor actualizado parcialmente",
                data: updatedSupplier
            });
        }

        res.status(404).json({
            success: false,
            message: `No se encontró el proveedor con id=${req.params.id}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al actualizar el proveedor con id=${req.params.id}`
        });
    }
};