const Category = require('../models/Category');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Nombre de categoría es requerido'
            });
        }

        const newCategory = await Category.create({
            name,
            description,
            createdBy: req.userId
        });

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: newCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear categoría',
            error: error.message
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías',
            error: error.message
        });
    }
};

exports.getById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de categoría no válido'
            });
        }

        const category = await Category.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categoría',
            error: error.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de categoría no válido'
            });
        }

        // Verificar si la categoría existe
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        // Verificar si el nuevo nombre ya existe (excluyendo la categoría actual)
        if (name && name !== category.name) {
            const nameExists = await Category.findOne({ name });
            if (nameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de categoría ya está en uso'
                });
            }
        }

        // Actualizar categoría
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                name: name || category.name,
                description: description || category.description
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: updatedCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar categoría',
            error: error.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de categoría no válido'
            });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoría eliminada exitosamente',
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar categoría',
            error: error.message
        });
    }
};