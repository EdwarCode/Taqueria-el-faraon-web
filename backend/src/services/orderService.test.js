const Order = require('../models/Order');
const { buildOrderPayload, createOrder } = require('./orderService');

jest.mock('../models/Order');

describe('orderService', () => {
  it('builds order payload with totals', () => {
    const payload = buildOrderPayload({
      customerName: 'Carlos',
      phone: '5512345678',
      items: [
        { name: 'Anafre', price: 320, type: 'anafre', quantity: 1 },
        { name: 'Bistec', price: 25, type: 'taco', quantity: 2 }
      ]
    });

    expect(payload.subtotal).toBe(370);
    expect(payload.discount).toBe(32);
    expect(payload.total).toBe(338);
  });

  it('creates an order', async () => {
    const mockOrder = { id: '1', customerName: 'Ana' };
    Order.create.mockResolvedValue(mockOrder);

    const order = await createOrder({
      customerName: 'Ana',
      phone: '5511122233',
      items: [{ name: 'Tacos al pastor', price: 22, type: 'taco', quantity: 2 }]
    });

    expect(Order.create).toHaveBeenCalledTimes(1);
    expect(order).toEqual(mockOrder);
  });
});
