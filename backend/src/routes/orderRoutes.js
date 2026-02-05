const express = require('express');
const {
  createOrderHandler,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', createOrderHandler);
router.get('/', authMiddleware, getOrders);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
