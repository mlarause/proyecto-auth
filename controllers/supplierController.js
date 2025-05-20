const db = require("../models");
const Supplier = db.supplier;
const Product = db.product;
const { Op } = require("sequelize");

// Crear y guardar un nuevo proveedor (solo admin)
exports.create = async (req, res) => {
    // Validar solicitud
    if (!req.body.name) {
        return res.status(400).json({
            success: false,
            message: "El nombre del proveedor es requerido"
        });
    }

    try {
        // Crear objeto proveedor
        const supplier = {
            name: req.body.name,
            contact: req.body.contact || null,
            email: req.body.email || null,
            phone: req.body.phone || null,
            address: req.body.address || null,
            status: req.body.status !== undefined ? req.body.status : true
        };

        // Crear proveedor en la base de datos
        const createdSupplier = await Supplier.create(supplier);

        // Asociar productos si se proporcionaron
        if (req.body.products && Array.isArray(req.body.products)) {
            const products = await Product.findAll({
                where: {
                    id: {
                        [Op.in]: req.body.products
                    }
                }
            });
            
            await createdSupplier.setProducts(products);
        }

        res.status(201).json({
            success: true,
            message: "Proveedor creado exitosamente",
            data: createdSupplier
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error al crear el proveedor"
        });
    }
};

// Obtener todos los proveedores
exports.findAll = async (req, res) => {
    try {
        const { name, status } = req.query;
        let condition = {};

        if (name) {
            condition.name = { [Op.like]: `%${name}%` };
        }

        if (status !== undefined) {
            condition.status = status === 'true';
        }

        const suppliers = await Supplier.findAll({
            where: condition,
            include: [{
                model: Product,
                attributes: ['id', 'name']
            }]
        });

        res.json({
            success: true,
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
exports.findOne = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findByPk(id, {
            include: [{
                model: Product,
                attributes: ['id', 'name']
            }]
        });

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: `Proveedor con id=${id} no encontrado`
            });
        }

        res.json({
            success: true,
            data: supplier
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al obtener el proveedor con id=${id}`
        });
    }
};

// Actualizar un proveedor por ID (solo admin)
exports.update = async (req, res) => {
    const { id } = req.params;

    try {
        const [num] = await Supplier.update(req.body, {
            where: { id }
        });

        if (num === 1) {
            // Si se proporcionaron productos, actualizar la relación
            if (req.body.products && Array.isArray(req.body.products)) {
                const supplier = await Supplier.findByPk(id);
                const products = await Product.findAll({
                    where: {
                        id: {
                            [Op.in]: req.body.products
                        }
                    }
                });
                
                await supplier.setProducts(products);
            }

            res.json({
                success: true,
                message: "Proveedor actualizado exitosamente"
            });
        } else {
            res.status(404).json({
                success: false,
                message: `No se pudo actualizar el proveedor con id=${id}. Puede que no exista`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al actualizar el proveedor con id=${id}`
        });
    }
};

// Eliminar un proveedor por ID (solo admin)
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const num = await Supplier.destroy({
            where: { id }
        });

        if (num === 1) {
            res.json({
                success: true,
                message: "Proveedor eliminado exitosamente"
            });
        } else {
            res.status(404).json({
                success: false,
                message: `No se pudo eliminar el proveedor con id=${id}. Puede que no exista`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || `Error al eliminar el proveedor con id=${id}`
        });
    }
};

// Eliminar todos los proveedores (solo admin)
exports.deleteAll = async (req, res) => {
    try {
        const num = await Supplier.destroy({
            where: {},
            truncate: false
        });

        res.json({
            success: true,
            message: `${num} proveedores eliminados exitosamente`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error al eliminar todos los proveedores"
        });
    }
};

// Obtener todos los proveedores activos
exports.findAllActive = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll({
            where: { status: true },
            include: [{
                model: Product,
                attributes: ['id', 'name']
            }]
        });

        res.json({
            success: true,
            data: suppliers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error al obtener los proveedores activos"
        });
    }
};