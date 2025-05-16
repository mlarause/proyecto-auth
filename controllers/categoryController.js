const Category = require('../models/Category');

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const categoria = new Category({ nombre, descripcion });
    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const categorias = await Category.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const categoria = await Category.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const categoria = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const categoria = await Category.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};