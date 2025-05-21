const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Helper function for role verification
const checkAccess = (userRole, requiredRoles) => {
    return requiredRoles.includes(userRole);
};

// Create Supplier (Admin only)
exports.createSupplier = async (req, res) => {
    try {
        if (!checkAccess(req.user.role, ['admin'])) {
            return res.status(403).json({ 
                success: false, 
                message: 'Require Admin Role!' 
            });
        }

        const { name, contact, email, phone, address, products } = req.body;
        
        // Validate product IDs
        if (products) {
            const validProducts = await Product.find({ _id: { $in: products } });
            if (validProducts.length !== products.length) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'One or more products not found' 
                });
            }
        }

        const supplier = new Supplier({ 
            name, 
            contact, 
            email, 
            phone, 
            address, 
            products 
        });
        
        await supplier.save();

        res.status(201).json({ 
            success: true, 
            data: supplier 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Suppliers (Admin, Coordinator, Assistant)
exports.getSuppliers = async (req, res) => {
    try {
        if (!checkAccess(req.user.role, ['admin', 'coordinator', 'assistant'])) {
            return res.status(403).json({ 
                success: false, 
                message: 'Unauthorized access' 
            });
        }

        const suppliers = await Supplier.find({ isActive: true })
            .populate('products', 'name price');
            
        res.status(200).json({ 
            success: true, 
            data: suppliers 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
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