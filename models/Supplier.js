const mongoose = require('mongoose');
const { Schema } = mongoose;

const supplierSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Supplier name is required'],
        trim: true,
        minlength: [2, 'Supplier name must be at least 2 characters'],
        maxlength: [100, 'Supplier name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        street: {
            type: String,
            trim: true,
            maxlength: [100, 'Street address cannot exceed 100 characters']
        },
        city: {
            type: String,
            trim: true,
            maxlength: [50, 'City name cannot exceed 50 characters']
        },
        state: {
            type: String,
            trim: true,
            maxlength: [50, 'State name cannot exceed 50 characters']
        },
        zipCode: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^\d{5}(?:[-\s]\d{4})?$/.test(v);
                },
                message: props => `${props.value} is not a valid ZIP code!`
            }
        },
        country: {
            type: String,
            trim: true,
            default: 'United States',
            maxlength: [50, 'Country name cannot exceed 50 characters']
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

// Custom validation to ensure at least one contact method
supplierSchema.pre('validate', function(next) {
    if (!this.email && !this.phone) {
        this.invalidate('contact', 'At least email or phone must be provided', this.contact);
    }
    next();
});

// Single index definition to avoid duplicate warning
supplierSchema.index({ email: 1 }, { unique: true });
supplierSchema.index({ name: 1 }); // For faster searching by name

// Middleware to update the updatedAt field
supplierSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Static method to find active suppliers
supplierSchema.statics.findActive = function() {
    return this.find({ isActive: true });
};

// Instance method to get supplier info
supplierSchema.methods.getInfo = function() {
    return `${this.name} - ${this.email} (${this.phone})`;
};

module.exports = mongoose.model('Supplier', supplierSchema);