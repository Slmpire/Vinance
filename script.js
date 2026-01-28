// Multi-user system
let users = JSON.parse(localStorage.getItem('budgetUsers')) || [];
let currentUser = localStorage.getItem('currentUser') || null;

// Budget data storage
let incomes = [];
let expenses = [];
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
    
    // Update UI
    document.getElementById('current-user-name').textContent = user.name;
    document.getElementById('tax-rate').value = user.taxRate || 20;
    document.getElementById('tax-type').value = user.taxType || 'gross';
    
    renderIncomes();
    renderExpenses();
    calculateBudget();
}

function saveUserData() {
    const user = users.find(u => u.id === currentUser);
    if (!user) return;

    user.incomes = incomes;
    user.expenses = expenses;
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
}
