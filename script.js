// Multi-user system
let users = JSON.parse(localStorage.getItem('budgetUsers')) || [];
let currentUser = localStorage.getItem('currentUser') || null;

// Budget data storage
let incomes = [];
let expenses = [];
let goals = [];
let currentView = 'monthly'; // 'monthly' or 'yearly'

// Initialize app
window.addEventListener('DOMContentLoaded', function() {
    if (!currentUser || !users.find(u => u.id === currentUser)) {
        showUserModal();
    } else {
        loadUserData();
        hideUserModal();
    }
});

// ==================== User Management Functions ====================

function showUserModal() {
    document.getElementById('user-modal').classList.add('active');
    renderUserList();
}

function hideUserModal() {
    document.getElementById('user-modal').classList.remove('active');
}

function renderUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    if (users.length === 0) {
        userList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6c757d;">No users yet. Create your first user below!</p>';
        return;
    }

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <button class="delete-user" onclick="deleteUser('${user.id}', event)">×</button>
            <div class="user-icon">👤</div>
            <div class="user-name">${user.name}</div>
        `;
        userCard.addEventListener('click', () => selectUser(user.id));
        userList.appendChild(userCard);
    });
}

function createUser() {
    const userName = document.getElementById('new-user-name').value.trim();
    
    if (!userName) {
        alert('Please enter a name!');
        return;
    }

    const newUser = {
        id: 'user_' + Date.now(),
        name: userName,
        incomes: [],
        expenses: [],
        taxRate: 20,
        taxType: 'gross'
    };

    users.push(newUser);
    localStorage.setItem('budgetUsers', JSON.stringify(users));
    document.getElementById('new-user-name').value = '';
    
    selectUser(newUser.id);
}

function selectUser(userId) {
    currentUser = userId;
    localStorage.setItem('currentUser', userId);
    loadUserData();
    hideUserModal();
}

function deleteUser(userId, event) {
    event.stopPropagation();
    
    const user = users.find(u => u.id === userId);
    if (confirm(`Are you sure you want to delete ${user.name}'s budget? This cannot be undone.`)) {
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('budgetUsers', JSON.stringify(users));
        
        if (currentUser === userId) {
            currentUser = null;
            localStorage.removeItem('currentUser');
            showUserModal();
        } else {
            renderUserList();
        }
    }
}

function loadUserData() {
    const user = users.find(u => u.id === currentUser);
    if (!user) return;

    // Load user's budget data
    incomes = user.incomes || [];
    expenses = user.expenses || [];
    goals = user.goals || [];
    
    // Update UI
    document.getElementById('current-user-name').textContent = user.name;
    document.getElementById('tax-rate').value = user.taxRate || 20;
    document.getElementById('tax-type').value = user.taxType || 'gross';
    
    renderIncomes();
    renderExpenses();
    renderGoals();
    calculateBudget();
}

function saveUserData() {
    const user = users.find(u => u.id === currentUser);
    if (!user) return;

    user.incomes = incomes;
    user.expenses = expenses;
    user.goals = goals;
    user.taxRate = parseFloat(document.getElementById('tax-rate').value) || 20;
    user.taxType = document.getElementById('tax-type').value;

    localStorage.setItem('budgetUsers', JSON.stringify(users));
}

// ==================== Event Listeners ====================

// User management events
document.getElementById('create-user-btn').addEventListener('click', createUser);
document.getElementById('new-user-name').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') createUser();
});
document.getElementById('switch-user-btn').addEventListener('click', showUserModal);

// View toggle functionality
document.getElementById('monthly-btn').addEventListener('click', function() {
    currentView = 'monthly';
    this.classList.add('active');
    document.getElementById('yearly-btn').classList.remove('active');
    calculateBudget();
});

document.getElementById('yearly-btn').addEventListener('click', function() {
    currentView = 'yearly';
    this.classList.add('active');
    document.getElementById('monthly-btn').classList.remove('active');
    calculateBudget();
});

// Income events
document.getElementById('add-income-btn').addEventListener('click', addIncome);
document.getElementById('income-amount').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addIncome();
});

// Expense events
document.getElementById('add-expense-btn').addEventListener('click', addExpense);
document.getElementById('expense-amount').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addExpense();
});

// Goals events
document.getElementById('add-goal-btn').addEventListener('click', addGoal);
document.getElementById('goal-target').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addGoal();
});

// Calculate button
document.getElementById('calculate-btn').addEventListener('click', calculateBudget);

// Auto-save tax settings when changed
document.getElementById('tax-rate').addEventListener('change', saveUserData);
document.getElementById('tax-type').addEventListener('change', saveUserData);

// ==================== Income Functions ====================

function addIncome() {
    const name = document.getElementById('income-name').value;
    const amount = parseFloat(document.getElementById('income-amount').value);

    if (name && amount > 0) {
        incomes.push({ name, amount });
        document.getElementById('income-name').value = '';
        document.getElementById('income-amount').value = '';
        renderIncomes();
        saveUserData();
    }
}

function renderIncomes() {
    const list = document.getElementById('income-list');
    list.innerHTML = '';
    incomes.forEach((income, index) => {
        const div = document.createElement('div');
        div.className = 'income-item';
        div.innerHTML = `
            <span><strong>${income.name}</strong>: $${income.amount.toFixed(2)}</span>
            <button class="btn btn-remove" onclick="removeIncome(${index})">Remove</button>
        `;
        list.appendChild(div);
    });
}

function removeIncome(index) {
    incomes.splice(index, 1);
    renderIncomes();
    saveUserData();
    calculateBudget();
}

// ==================== Expense Functions ====================

function addExpense() {
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);

    if (name && amount > 0) {
        expenses.push({ name, amount });
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';
        renderExpenses();
        saveUserData();
    }
}

function renderExpenses() {
    const list = document.getElementById('expense-list');
    list.innerHTML = '';
    expenses.forEach((expense, index) => {
        const div = document.createElement('div');
        div.className = 'expense-item';
        div.innerHTML = `
            <span><strong>${expense.name}</strong>: $${expense.amount.toFixed(2)}</span>
            <button class="btn btn-remove" onclick="removeExpense(${index})">Remove</button>
        `;
        list.appendChild(div);
    });
}

function removeExpense(index) {
    expenses.splice(index, 1);
    renderExpenses();
    saveUserData();
    calculateBudget();
}

// ==================== Savings Goals Functions ====================

function addGoal() {
    const name = document.getElementById('goal-name').value;
    const target = parseFloat(document.getElementById('goal-target').value);
    const current = parseFloat(document.getElementById('goal-current').value) || 0;

    if (name && target > 0) {
        goals.push({ 
            id: 'goal_' + Date.now(),
            name, 
            target, 
            current,
            createdAt: new Date().toISOString()
        });
        document.getElementById('goal-name').value = '';
        document.getElementById('goal-target').value = '';
        document.getElementById('goal-current').value = '0';
        renderGoals();
        saveUserData();
        calculateBudget();
    }
}

function renderGoals() {
    const list = document.getElementById('goals-list');
    list.innerHTML = '';
    
    if (goals.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">No savings goals yet. Add your first goal above!</p>';
        return;
    }

    goals.forEach((goal, index) => {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        const remaining = Math.max(goal.target - goal.current, 0);
        const isAchieved = goal.current >= goal.target;

        const div = document.createElement('div');
        div.className = 'goal-item';
        div.innerHTML = `
            <div class="goal-header">
                <div class="goal-title">${goal.name}</div>
                <div class="goal-status">
                    <span class="status-badge ${isAchieved ? 'achieved' : 'in-progress'}">
                        ${isAchieved ? '✓ Achieved' : 'In Progress'}
                    </span>
                    <button class="btn btn-remove" onclick="removeGoal(${index})">Remove</button>
                </div>
            </div>
            
            <div class="goal-amounts">
                <span>
                    <span class="label">Current</span>
                    <span class="value">$${goal.current.toFixed(2)}</span>
                </span>
                <span>
                    <span class="label">Target</span>
                    <span class="value">$${goal.target.toFixed(2)}</span>
                </span>
                <span>
                    <span class="label">Remaining</span>
                    <span class="value">$${remaining.toFixed(2)}</span>
                </span>
            </div>
            
            <div class="progress-bar-container">
                <div class="progress-bar ${isAchieved ? 'completed' : ''}" style="width: ${progress}%">
                    ${progress.toFixed(1)}%
                </div>
            </div>
            
            <div class="goal-actions">
                <input type="number" 
                       id="update-amount-${index}" 
                       placeholder="Add to savings" 
                       step="0.01"
                       onkeypress="if(event.key === 'Enter') updateGoalProgress(${index})">
                <button class="btn btn-update-goal" onclick="updateGoalProgress(${index})">
                    Add Amount
                </button>
            </div>
            
            <div class="goal-timeline">
                <div class="timeline-item">
                    <span class="timeline-icon">📅</span>
                    <span>Created: ${new Date(goal.createdAt).toLocaleDateString()}</span>
                </div>
                ${!isAchieved ? getTimelineEstimate(remaining, index) : 
                  '<div class="timeline-item"><span class="timeline-icon">🎉</span><span>Goal Achieved!</span></div>'}
            </div>
        `;
        list.appendChild(div);
    });
}

function updateGoalProgress(index) {
    const input = document.getElementById(`update-amount-${index}`);
    const amount = parseFloat(input.value);
    
    if (amount && amount > 0) {
        goals[index].current += amount;
        input.value = '';
        renderGoals();
        saveUserData();
        calculateBudget();
    }
}

function removeGoal(index) {
    if (confirm(`Are you sure you want to remove this goal?`)) {
        goals.splice(index, 1);
        renderGoals();
        saveUserData();
        calculateBudget();
    }
}

function getTimelineEstimate(remaining, index) {
    // This will be updated when budget is calculated
    return `<div class="timeline-item" id="timeline-${index}">
        <span class="timeline-icon">⏱️</span>
        <span>Calculate budget to see timeline</span>
    </div>`;
}

function updateGoalTimelines(monthlySurplus) {
    goals.forEach((goal, index) => {
        const remaining = Math.max(goal.target - goal.current, 0);
        const timelineEl = document.getElementById(`timeline-${index}`);
        
        if (timelineEl && remaining > 0) {
            if (monthlySurplus > 0) {
                const monthsNeeded = Math.ceil(remaining / monthlySurplus);
                const years = Math.floor(monthsNeeded / 12);
                const months = monthsNeeded % 12;
                
                let timeText = '';
                if (years > 0) {
                    timeText = `${years} year${years > 1 ? 's' : ''} ${months > 0 ? months + ' month' + (months > 1 ? 's' : '') : ''}`;
                } else {
                    timeText = `${months} month${months > 1 ? 's' : ''}`;
                }
                
                timelineEl.innerHTML = `
                    <span class="timeline-icon">⏱️</span>
                    <span>Estimated: ${timeText}</span>
                `;
            } else {
                timelineEl.innerHTML = `
                    <span class="timeline-icon">⚠️</span>
                    <span>Need positive balance to reach goal</span>
                `;
            }
        }
    });
}

function generateSavingsRecommendation(netBalance) {
    const recommendationEl = document.getElementById('recommendation-message');
    const multiplier = currentView === 'yearly' ? 1 : 12; // Convert to yearly
    const yearlyBalance = netBalance * multiplier;
    
    if (netBalance > 0) {
        const monthlyView = currentView === 'monthly';
        const savingsAmount = monthlyView ? netBalance : netBalance / 12;
        const period = monthlyView ? 'month' : 'year';
        
        const emergencyFund = savingsAmount * 6; // 6 months emergency fund
        const retirementSuggestion = savingsAmount * 0.15; // 15% for retirement
        
        recommendationEl.innerHTML = `
            Great job! You have $${savingsAmount.toFixed(2)} surplus per ${period}. Here's what you can do:
            <br><br>
            <strong>💰 Emergency Fund:</strong> Save $${emergencyFund.toFixed(2)} (6 months of surplus)
            <br>
            <strong>🏦 Retirement:</strong> Consider investing $${retirementSuggestion.toFixed(2)}/month (15% of surplus)
            <br>
            <strong>🎯 Goals:</strong> ${goals.length > 0 ? 'Allocate towards your savings goals above!' : 'Set a savings goal to track your progress!'}
        `;
    } else if (netBalance === 0) {
        recommendationEl.innerHTML = `
            You're breaking even! To start building savings:
            <br>
            • Review your expenses and find areas to reduce
            <br>
            • Look for ways to increase income (side hustle, raise, etc.)
            <br>
            • Set a goal to save at least 10% of your income
        `;
    } else {
        recommendationEl.innerHTML = `
            ⚠️ You're spending more than you earn ($${Math.abs(netBalance).toFixed(2)} deficit per ${currentView === 'monthly' ? 'month' : 'year'}).
            <br><br>
            <strong>Action Items:</strong>
            <br>
            • Identify and reduce non-essential expenses
            <br>
            • Consider increasing income sources
            <br>
            • Create a plan to eliminate debt
            <br>
            • Seek financial counseling if needed
        `;
    }
}

// ==================== Budget Calculation ====================

function calculateBudget() {
    const multiplier = currentView === 'yearly' ? 12 : 1;
    
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0) * multiplier;
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0) * multiplier;
    const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
    const taxType = document.getElementById('tax-type').value;

    let taxAmount = 0;
    if (taxType === 'gross') {
        taxAmount = (totalIncome * taxRate) / 100;
    } else {
        const netBeforeTax = totalIncome - totalExpenses;
        taxAmount = netBeforeTax > 0 ? (netBeforeTax * taxRate) / 100 : 0;
    }

    const netBalance = totalIncome - totalExpenses - taxAmount;

    // Update display
    document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('tax-amount').textContent = `$${taxAmount.toFixed(2)}`;
    document.getElementById('net-balance').textContent = `$${netBalance.toFixed(2)}`;

    // Color code net balance
    const netBalanceEl = document.getElementById('net-balance');
    if (netBalance >= 0) {
        netBalanceEl.style.color = '#28a745';
    } else {
        netBalanceEl.style.color = '#dc3545';
    }

    // Update savings recommendations and goal timelines
    generateSavingsRecommendation(netBalance);
    
    // Calculate monthly surplus for timeline estimates
    const monthlySurplus = currentView === 'yearly' ? netBalance / 12 : netBalance;
    updateGoalTimelines(monthlySurplus);
}