const { calculateTotals } = require('./pricing');

describe('calculateTotals', () => {
  it('applies 10% discount to anafre items', () => {
    const items = [
      { name: 'Anafre para 5 personas', price: 320, type: 'anafre', quantity: 1 },
      { name: 'Tacos al pastor', price: 22, type: 'taco', quantity: 2 }
    ];

    const totals = calculateTotals(items);

    expect(totals.subtotal).toBe(364);
    expect(totals.discount).toBe(32);
    expect(totals.total).toBe(332);
  });
});
