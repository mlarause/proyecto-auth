const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

// Create a new supplier (Admin only)
exports.createSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        
        // Check if supplier exists
        const existingSupplier = await Supplier.findOne({ email });
        if (existingSupplier) {
            return res.status(400).json({ success: false, message: 'Supplier already exists' });
        }

        const supplier = new Supplier({ name, email, phone, address });
        await supplier.save();

        res.status(201).json({ success: true, data: supplier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all suppliers (Admin, Coordinator, Assistant)
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json({ success: true, data: suppliers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get supplier by ID (Admin, Coordinator, Assistant)
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.status(200).json({ success: true, data: supplier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update supplier (Admin, Coordinator)
exports.updateSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address },
            { new: true, runValidators: true }
        );

        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }

        res.status(200).json({ success: true, data: supplier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete supplier (Admin only)
exports.deleteSupplier = async (req, res) => {
    try {
        // Check if supplier has associated products
        const products = await Product.find({ supplier: req.params.id });
        if (products.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete supplier with associated products' 
            });
        }

        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }

        res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate supplier token
exports.generateSupplierToken = async (req, res) => {
    try {
        const { email } = req.body;
        const supplier = await Supplier.findOne({ email });
        
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }

        const token = jwt.sign(
            { id: supplier._id, email: supplier.email, role: 'supplier' },
            config.jwtSecret,
            { expiresIn: '24h' } // Increased expiration time
        );

        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};