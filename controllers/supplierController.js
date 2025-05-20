const db = require("../models");
const Supplier = db.supplier;
const Product = db.product;
// Eliminamos la dependencia de Op ya que no es estrictamente necesaria

// Crear y guardar un nuevo proveedor
exports.create = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      success: false,
      message: "El nombre no puede estar vacío"
    });
  }

  Supplier.create({
    name: req.body.name,
    contact: req.body.contact,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address
  })
  .then(supplier => {
    if (req.body.products) {
      Product.findAll({
        where: {
          id: req.body.products
        }
      }).then(products => {
        supplier.setProducts(products).then(() => {
          res.send({
            success: true,
            message: "Proveedor creado exitosamente",
            data: supplier
          });
        });
      });
    } else {
      res.send({
        success: true,
        message: "Proveedor creado exitosamente",
        data: supplier
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      success: false,
      message: err.message || "Error al crear el proveedor"
    });
  });
};

exports.findAll = (req, res) => {
  Supplier.findAll({
    include: [{
      model: Product,
      attributes: ['id', 'name']
    }]
  })
  .then(suppliers => {
    res.send({
      success: true,
      data: suppliers
    });
  })
  .catch(err => {
    res.status(500).send({
      success: false,
      message: err.message || "Error al obtener los proveedores"
    });
  });
};
// Obtener todos los proveedores (versión simplificada sin búsqueda)
exports.findAll = (req, res) => {
    Supplier.findAll()
        .then(data => {
            res.send({
                success: true,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Ocurrió un error al recuperar los proveedores"
            });
        });
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