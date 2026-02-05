const ANAFRE_DISCOUNT_RATE = 0.1;

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = items.reduce((sum, item) => {
    if (item.type === 'anafre') {
      return sum + item.price * item.quantity * ANAFRE_DISCOUNT_RATE;
    }
    return sum;
  }, 0);
  const total = subtotal - discount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};

module.exports = { calculateTotals, ANAFRE_DISCOUNT_RATE };
