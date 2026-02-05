const Order = require('../models/Order');
const { createOrder } = require('../services/orderService');

const createOrderHandler = async (req, res) => {
  const { customerName, phone, items } = req.body;

  if (!customerName || !phone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Datos de pedido incompletos' });
  }

  try {
    const order = await createOrder({ customerName, phone, items });
    const io = req.app.get('io');
    if (io) {
      io.emit('order:new', order);
    }
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear pedido' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pendiente', 'preparando', 'listo'].includes(status)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('order:update', order);
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar pedido' });
  }
};

module.exports = {
  createOrderHandler,
  getOrders,
  updateOrderStatus
};
