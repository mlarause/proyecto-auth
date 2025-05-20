const db = require("../models");
const Supplier = db.supplier;
const Product = db.product;
const { Op } = require("sequelize");

// Crear y guardar un nuevo proveedor (solo admin)
exports.create = async (req, res) => {
    try {
        // Validación de campos requeridos
        if (!req.body.name) {
            return res.status(400).json({
                success: false,
                message: "El nombre del proveedor es obligatorio"
            });
        }

        // Validar productos asociados si existen
        if (req.body.products && req.body.products.length > 0) {
            const productsExist = await Product.findAll({
                where: { id: { [Op.in]: req.body.products } }
            });
            
            if (productsExist.length !== req.body.products.length) {
                return res.status(400).json({
                    success: false,
                    message: "Algunos productos no existen en la base de datos"
                });
            }
        }

        // Crear el proveedor
        const newSupplier = await Supplier.create({
            name: req.body.name,
            contact: req.body.contact || null,
            email: req.body.email || null,
            phone: req.body.phone || null,
            address: req.body.address || null,
            status: req.body.status !== undefined ? req.body.status : true
        });

        // Asociar productos si se proporcionaron
        if (req.body.products && req.body.products.length > 0) {
            await newSupplier.setProducts(req.body.products);
        }

        // Obtener el proveedor con sus productos para la respuesta
        const supplierWithProducts = await Supplier.findByPk(newSupplier.id, {
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }]
        });

        res.status(201).json({
            success: true,
            message: "Proveedor creado exitosamente",
            data: supplierWithProducts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error al crear el proveedor"
        });
    }
};

// Obtener todos los proveedores (público o autenticado según requerimiento)
exports.findAll = async (req, res) => {
    try {
        const { name, status } = req.query;
        let whereCondition = {};

        // Filtros opcionales
        if (name) {
            whereCondition.name = { [Op.like]: `%${name}%` };
        }
        if (status !== undefined) {
            whereCondition.status = status === 'true';
        }

        const suppliers = await Supplier.findAll({
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
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const supplier = await Supplier.findByPk(id, {
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
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
            message: `Error al obtener el proveedor con id=${id}`
        });
    }
};

// Actualizar un proveedor (solo admin)
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        // Verificar si el proveedor existe
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: `Proveedor con id=${id} no encontrado`
            });
        }

        // Validar productos si se van a actualizar
        if (req.body.products && req.body.products.length > 0) {
            const productsExist = await Product.count({
                where: { id: { [Op.in]: req.body.products } }
            });
            
            if (productsExist !== req.body.products.length) {
                return res.status(400).json({
                    success: false,
                    message: "Algunos productos no existen"
                });
            }
        }

        // Actualizar datos del proveedor
        const [numUpdated] = await Supplier.update(req.body, {
            where: { id: id }
        });

        // Actualizar relaciones con productos si se especificaron
        if (req.body.products) {
            await supplier.setProducts(req.body.products);
        }

        // Obtener el proveedor actualizado con sus productos
        const updatedSupplier = await Supplier.findByPk(id, {
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
            message: `Error al actualizar el proveedor con id=${id}`
        });
    }
};

// Actualización parcial (para coordinadores)
exports.partialUpdate = async (req, res) => {
    const id = req.params.id;

    try {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: `Proveedor con id=${id} no encontrado`
            });
        }

        // Campos permitidos para actualización por coordinadores
        const allowedFields = ['contact', 'email', 'phone'];
        const updateData = {};
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        await Supplier.update(updateData, { where: { id: id } });
        const updatedSupplier = await Supplier.findByPk(id);

        res.json({
            success: true,
            message: "Proveedor actualizado exitosamente",
            data: updatedSupplier
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error al actualizar el proveedor con id=${id}`
        });
    }
};

// Eliminar un proveedor (solo admin)
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const numDeleted = await Supplier.destroy({
            where: { id: id }
        });

        if (numDeleted === 1) {
            res.json({
                success: true,
                message: "Proveedor eliminado exitosamente"
            });
        } else {
            res.status(404).json({
                success: false,
                message: `No se encontró el proveedor con id=${id}`
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error al eliminar el proveedor con id=${id}`
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
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }]
        });

        res.json({
            success: true,
            count: suppliers.length,
            data: suppliers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error al obtener los proveedores activos"
        });
    }
};