const express = require('express');
const router = express.Router();
const Joi = require('joi');

// Example service placeholders (replace with real DB/service calls)
const getUserById = async (id) => { /* ...fetch user... */ };
const saveUserBudget = async (id, budget) => { /* ...save budget... */ };

// Validation schema
const budgetSchema = Joi.object({
    incomes: Joi.array().items(Joi.object({ name: Joi.string().required(), amount: Joi.number().min(0).required() })).required(),
    expenses: Joi.array().items(Joi.object({ name: Joi.string().required(), amount: Joi.number().min(0).required() })).required(),
    goals: Joi.array().items(Joi.object({
        id: Joi.string().optional(),
        name: Joi.string().required(),
        target: Joi.number().min(0).required(),
        current: Joi.number().min(0).required()
    })).optional(),
    taxRate: Joi.number().min(0).max(100).required(),
    taxType: Joi.string().valid('gross', 'net').required()
});

// PUT /api/users/:id/budget
router.put('/users/:id/budget', async (req, res) => {
    try {
        // Validate payload
        const { error, value } = budgetSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) {
            return res.status(400).json({ error: 'Invalid payload', details: error.details.map(d => d.message) });
        }

        const userId = req.params.id;
        if (!userId) return res.status(400).json({ error: 'Missing user id in path' });

        const user = await getUserById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Business rule checks
        const totalIncome = (value.incomes || []).reduce((s, i) => s + (i.amount || 0), 0);
        const totalExpenses = (value.expenses || []).reduce((s, e) => s + (e.amount || 0), 0);

        if (totalIncome === 0 && totalExpenses === 0) {
            return res.status(422).json({ error: 'No income or expense data provided' });
        }

        // Prevent obviously invalid state (negative numbers were prevented by Joi)
        // Save budget
        const saved = await saveUserBudget(userId, value);

        return res.status(200).json({ message: 'Budget updated', data: saved });
    } catch (err) {
        console.error('Failed to update budget:', err);
        // Distinguish validation/service errors vs unexpected
        if (err.isJoi) {
            return res.status(400).json({ error: 'Validation error', details: err.details });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;