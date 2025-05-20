const db = require("../models");
const Supplier = db.supplier;
const Product = db.product;

// Crear y guardar un nuevo proveedor
exports.create = async (req, res) => {
    try {
        // Validación idéntica a productos
        if (!req.body.name) {
            return res.status(400).send({
                success: false,
                message: "El nombre del proveedor no puede estar vacío"
            });
        }

        // Convertir products a array (igual que productos con subcategorías)
        const productIds = req.body.products ? 
            (Array.isArray(req.body.products) ? req.body.products : [req.body.products]) : 
            [];

        // Validar productos (igual que productos valida subcategorías)
        if (productIds.length > 0) {
            const productsCount = await Product.count({
                where: { id: productIds }
            });
            
            if (productsCount !== productIds.length) {
                return res.status(400).send({
                    success: false,
                    message: "Algunos productos no existen"
                });
            }
        }

        // Crear proveedor (misma estructura que productos)
        const supplier = await Supplier.create({
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            status: req.body.status !== undefined ? req.body.status : true
        });

        // Establecer relación con productos (igual que productos-subcategorías)
        if (productIds.length > 0) {
            await supplier.setProducts(productIds);
        }

        // Obtener datos completos (igual que productos)
        const result = await Supplier.findByPk(supplier.id, {
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }]
        });

        res.status(201).send({
            success: true,
            message: "Proveedor creado exitosamente",
            data: result
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message || "Error al crear el proveedor"
        });
    }
};

// Obtener todos los proveedores (igual estructura que productos)
exports.findAll = async (req, res) => {
    try {
        const { name, status } = req.query;
        let condition = {};

        if (name) condition.name = { [db.Sequelize.Op.like]: `%${name}%` };
        if (status !== undefined) condition.status = status === 'true';

        const data = await Supplier.findAll({
            where: condition,
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }],
            order: [['name', 'ASC']]
        });

        res.send({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message || "Error al obtener los proveedores"
        });
    }
};

// Obtener un proveedor por id (igual que productos)
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Supplier.findByPk(id, {
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }]
        });

        if (!data) {
            return res.status(404).send({
                success: false,
                message: `Proveedor con id=${id} no encontrado`
            });
        }

        res.send({
            success: true,
            data: data
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Error al obtener el proveedor con id=${id}`
        });
    }
};

// Actualizar un proveedor (igual estructura que productos)
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        // Validar productos si se proporcionan (igual que productos con subcategorías)
        if (req.body.products) {
            const productIds = Array.isArray(req.body.products) ? 
                req.body.products : 
                [req.body.products];
                
            const productsCount = await Product.count({
                where: { id: productIds }
            });
            
            if (productsCount !== productIds.length) {
                return res.status(400).send({
                    success: false,
                    message: "Algunos productos no existen"
                });
            }
        }

        const [num] = await Supplier.update(req.body, {
            where: { id: id }
        });

        if (num == 1) {
            // Actualizar relación con productos si se especificó (igual que productos)
            if (req.body.products) {
                const supplier = await Supplier.findByPk(id);
                const productIds = Array.isArray(req.body.products) ? 
                    req.body.products : 
                    [req.body.products];
                await supplier.setProducts(productIds);
            }

            res.send({
                success: true,
                message: "Proveedor actualizado exitosamente"
            });
        } else {
            res.status(404).send({
                success: false,
                message: `No se pudo actualizar el proveedor con id=${id}`
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Error al actualizar el proveedor con id=${id}`
        });
    }
};

// Eliminar un proveedor (igual que productos)
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Supplier.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                success: true,
                message: "Proveedor eliminado exitosamente"
            });
        } else {
            res.status(404).send({
                success: false,
                message: `No se pudo eliminar el proveedor con id=${id}`
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Error al eliminar el proveedor con id=${id}`
        });
    }
};

// Actualización parcial para coordinadores (nueva funcionalidad)
exports.partialUpdate = async (req, res) => {
    const id = req.params.id;

    try {
        // Campos permitidos para coordinadores
        const allowedFields = ['contact', 'email', 'phone', 'address'];
        const updateData = {};
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const [num] = await Supplier.update(updateData, {
            where: { id: id }
        });

        if (num == 1) {
            res.send({
                success: true,
                message: "Proveedor actualizado parcialmente"
            });
        } else {
            res.status(404).send({
                success: false,
                message: `No se pudo actualizar el proveedor con id=${id}`
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Error al actualizar el proveedor con id=${id}`
        });
    }
};