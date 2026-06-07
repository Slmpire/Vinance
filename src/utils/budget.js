// Pure helpers for totals, tax and timeline estimation

function calculateTotals({ incomes = [], expenses = [], taxRate = 0, taxType = 'gross', view = 'monthly' } = {}) {
    const multiplier = view === 'yearly' ? 12 : 1;
    const totalIncome = (incomes || []).reduce((s, i) => s + (Number(i.amount) || 0), 0) * multiplier;
    const totalExpenses = (expenses || []).reduce((s, e) => s + (Number(e.amount) || 0), 0) * multiplier;

    let taxAmount = 0;
    const rate = Number(taxRate) || 0;
    if (taxType === 'gross') {
        taxAmount = (totalIncome * rate) / 100;
    } else {
        const netBefore = totalIncome - totalExpenses;
        taxAmount = netBefore > 0 ? (netBefore * rate) / 100 : 0;
    }

    const netBalance = totalIncome - totalExpenses - taxAmount;
    return { totalIncome, totalExpenses, taxAmount, netBalance };
}

function monthsNeeded(remaining, monthlySurplus) {
    remaining = Number(remaining) || 0;
    monthlySurplus = Number(monthlySurplus) || 0;
    if (remaining <= 0) return 0;
    if (monthlySurplus <= 0) return Infinity;
    return Math.ceil(remaining / monthlySurplus);
}

function formatEstimateMonths(months) {
    if (!isFinite(months)) return { text: 'Unreachable with current surplus', months: Infinity };
    if (months === 0) return { text: 'Already achieved', months: 0 };

    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const parts = [];
    if (years) parts.push(`${years}y`);
    if (remMonths) parts.push(`${remMonths}m`);
    return { text: parts.join(' '), months };
}

module.exports = { calculateTotals, monthsNeeded, formatEstimateMonths };