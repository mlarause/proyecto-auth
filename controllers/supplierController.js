const db = require("../models");
const Supplier = db.supplier;
const Product = db.product;
// Eliminamos la dependencia de Op ya que no es estrictamente necesaria

// Crear y guardar un nuevo proveedor
exports.create = async (req, res) => {
    try {
        // Validación como en productos
        if (!req.body.name) {
            return res.status(400).json({
                success: false,
                message: "El nombre es requerido"
            });
        }

        // Convertir products a array si es necesario (como en productos)
        const productIds = req.body.products ? 
            (Array.isArray(req.body.products) ? req.body.products : [req.body.products]) : 
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

        // Crear proveedor (igual estructura que productos)
        const supplier = await Supplier.create({
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        });

        // Asociar productos (como se hace con subcategorías en productos)
        if (productIds.length > 0) {
            await supplier.setProducts(productIds);
        }

        // Respuesta consistente con productos
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
        res.status(500).json({
            success: false,
            message: error.message || "Error al crear el proveedor"
        });
    }
};

// Resto de los métodos se mantienen igual que antes (findOne, update, delete, etc.)
// ...

exports.findOne = (req, res) => {
    const id = req.params.id;

    Supplier.findByPk(id)
        .then(data => {
            if (data) {
                res.send({
                    success: true,
                    data: data
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: `No se encontró el proveedor con id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: "Error al recuperar el proveedor con id=" + id
            });
        });
};

exports.partialUpdate = (req, res) => {
  const id = req.params.id;

  Supplier.findByPk(id)
    .then(supplier => {
      if (!supplier) {
        return res.status(404).send({
          success: false,
          message: `No se encontró el proveedor con id=${id}`
        });
      }

      // Campos permitidos para actualización parcial
      const allowedFields = ['contact', 'email', 'phone', 'address'];
      const updates = {};
      
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      // Actualizar solo los campos permitidos
      Supplier.update(updates, {
        where: { id: id }
      })
      .then(num => {
        if (num == 1) {
          res.send({
            success: true,
            message: "Proveedor actualizado parcialmente"
          });
        } else {
          res.status(500).send({
            success: false,
            message: `No se pudo actualizar el proveedor con id=${id}`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          success: false,
          message: `Error al actualizar el proveedor con id=${id}`
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        success: false,
        message: `Error al buscar el proveedor con id=${id}`
      });
    });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Supplier.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
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
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: "Error al actualizar el proveedor con id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Supplier.destroy({
        where: { id: id }
    })
        .then(num => {
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
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: "No se pudo eliminar el proveedor con id=" + id
            });
        });
};