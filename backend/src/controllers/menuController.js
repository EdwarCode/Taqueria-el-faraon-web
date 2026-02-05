const Product = require('../models/Product');

const getMenu = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Error al cargar el menú' });
  }
};

module.exports = { getMenu };
