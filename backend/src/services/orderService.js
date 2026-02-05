const Order = require('../models/Order');
const { calculateTotals } = require('../utils/pricing');

const buildOrderPayload = ({ customerName, phone, items }) => {
  const { subtotal, discount, total } = calculateTotals(items);

  return {
    customerName,
    phone,
    items,
    subtotal,
    discount,
    total
  };
};

const createOrder = async ({ customerName, phone, items }) => {
  const orderPayload = buildOrderPayload({ customerName, phone, items });
  const order = await Order.create(orderPayload);
  return order;
};

module.exports = { createOrder, buildOrderPayload };
