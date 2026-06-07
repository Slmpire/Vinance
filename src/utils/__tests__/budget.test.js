const { calculateTotals, monthsNeeded, formatEstimateMonths } = require('../budget');

describe('calculateTotals', () => {
    test('monthly gross tax calculation', () => {
        const res = calculateTotals({
            incomes: [{ name: 'Salary', amount: 1000 }],
            expenses: [{ name: 'Rent', amount: 300 }],
            taxRate: 10,
            taxType: 'gross',
            view: 'monthly'
        });
        expect(res.totalIncome).toBe(1000);
        expect(res.totalExpenses).toBe(300);
        expect(res.taxAmount).toBeCloseTo(100);
        expect(res.netBalance).toBeCloseTo(600);
    });

    test('yearly net tax calculation', () => {
        const res = calculateTotals({
            incomes: [{ name: 'Salary', amount: 2000 }],
            expenses: [{ name: 'Other', amount: 500 }],
            taxRate: 5,
            taxType: 'net',
            view: 'yearly'
        });
        expect(res.totalIncome).toBe(2000 * 12);
        expect(res.totalExpenses).toBe(500 * 12);
        expect(res.taxAmount).toBeCloseTo(((2000-500)*12)*0.05);
    });

    test('graceful with empty arrays', () => {
        const res = calculateTotals({});
        expect(res.totalIncome).toBe(0);
        expect(res.totalExpenses).toBe(0);
        expect(res.taxAmount).toBe(0);
        expect(res.netBalance).toBe(0);
    });
});

describe('monthsNeeded & formatting', () => {
    test('returns 0 if already met', () => {
        expect(monthsNeeded(0, 100)).toBe(0);
    });

    test('returns Infinity when surplus non-positive', () => {
        expect(monthsNeeded(1000, 0)).toBe(Infinity);
        expect(monthsNeeded(1000, -10)).toBe(Infinity);
    });

    test('rounds up and formats estimate', () => {
        const months = monthsNeeded(250, 100); // 2.5 => 3
        expect(months).toBe(3);
        const formatted = formatEstimateMonths(months);
        expect(formatted.text).toMatch(/3m|0y 3m/);
    });
});