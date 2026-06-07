# 💰 Budget Planner

A modern, multi-user budget planning application that helps you manage your finances monthly or yearly with automatic tax calculations.

![Budget Planner](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Technologies Used](#technologies-used)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## ✨ Features

### 👥 Multi-User Support
- Create multiple user profiles
- Each user has their own separate budget
- Easy switching between users
- Delete users when no longer needed
- Data persistence using browser localStorage

### 💵 Income Management
- Add multiple income sources
- Track salary, freelance, investments, etc.
- View total income at a glance
- Remove income sources easily

### 💳 Expense Tracking
- Add unlimited expense categories
- Track rent, utilities, food, entertainment, etc.
- Categorize and organize expenses
- Quick removal of expenses

### 📊 Tax Calculations
- Flexible tax rate input
- Calculate tax on gross income or net income (after expenses)
- Automatic tax computation
- See tax impact on your budget

### 📈 Financial Summary
- Real-time budget calculations
- View total income, expenses, and taxes
- See net balance (positive or negative)
- Color-coded results for easy understanding

### 🔄 View Toggle
- **Monthly View**: Plan your monthly budget
- **Yearly View**: See annual projections (multiplies monthly values by 12)
- Switch between views instantly

### 💾 Data Persistence
- All data saved automatically to browser localStorage
- Budget data persists between sessions
- No need to manually save

### 📱 Responsive Design
- Works perfectly on desktop, tablet, and mobile
- Beautiful gradient UI
- Smooth animations and transitions

## 🎥 Demo

### Main Interface
The app features a clean, modern interface with:
- User selection modal on first load
- Income and expense sections side by side
- Tax calculation section
- Comprehensive financial summary

### Key Workflows
1. **First Time User**: Create your profile → Add income → Add expenses → Calculate budget
2. **Returning User**: Automatically loads your data → Make updates → Budget recalculates
3. **Multi-User**: Switch between users → Each sees their own data

## 🚀 Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend required!

### Steps

1. **Download the files**
   ```
   Download these 3 files to the same folder:
   - index.html
   - styles.css
   - script.js
   ```

2. **Open the application**
   ```
   Simply double-click on index.html
   OR
   Right-click → Open with → Your Browser
   ```

3. **Start using!**
   - Create your first user
   - Begin tracking your budget

### Alternative: Clone from Repository
```bash
# Clone the repository
git clone https://github.com/yourusername/budget-planner.git

# Navigate to the folder
cd budget-planner

# Open index.html in your browser
```

## 📖 Usage

### Getting Started

1. **Create Your First User**
   - When you first open the app, you'll see a welcome modal
   - Enter your name in the "Create New User" section
   - Click "Create User"

2. **Add Income Sources**
   - Enter the income source name (e.g., "Salary", "Freelance")
   - Enter the monthly amount
   - Click "Add" or press Enter

3. **Add Expenses**
   - Enter the expense name (e.g., "Rent", "Groceries")
   - Enter the monthly amount
   - Click "Add" or press Enter

4. **Configure Tax Settings**
   - Enter your tax rate percentage
   - Choose whether to calculate tax on:
     - **Gross Income**: Tax calculated on total income before expenses
     - **Net Income**: Tax calculated on income after expenses

5. **Calculate Your Budget**
   - Click the "Calculate Budget" button
   - View your financial summary:
     - Total Income (green)
     - Total Expenses (red)
     - Tax Amount (yellow)
     - Net Balance (green if positive, red if negative)

6. **Switch Views**
   - Click "Monthly View" to see monthly budget
   - Click "Yearly View" to see annual projections

### Managing Multiple Users

**Switch User**
- Click the "Switch User" button in the header
- Select a different user from the list
- Or create a new user

**Delete User**
- Click "Switch User"
- Hover over a user card
- Click the "×" button that appears
- Confirm deletion

### Tips for Best Results

- **Be Consistent**: Enter all amounts as monthly values
- **Be Thorough**: Include all income sources and expenses
- **Regular Updates**: Update your budget when your financial situation changes
- **Use Yearly View**: To see long-term projections and annual totals
- **Multiple Users**: Great for families, roommates, or managing multiple businesses

## 📁 File Structure

```
budget-planner/
│
├── index.html          # Main HTML structure
│   ├── User modal
│   ├── Header with user info
│   ├── View toggle buttons
│   ├── Income section
│   ├── Expense section
│   ├── Tax section
│   └── Summary section
│
├── styles.css          # All styling and design
│   ├── Reset styles
│   ├── Layout (Grid/Flexbox)
│   ├── Component styles
│   ├── Animations
│   └── Responsive design
│
├── script.js           # Application logic
│   ├── User management
│   ├── Data persistence (localStorage)
│   ├── Income/Expense CRUD operations
│   ├── Budget calculations
│   └── Event handlers
│
└── README.md           # This file
```

## 🛠 Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
  - Gradients and animations
  - Responsive design
  - Custom properties
- **Vanilla JavaScript (ES6+)**: 
  - No frameworks or libraries needed
  - localStorage API for data persistence
  - DOM manipulation
  - Event handling

## 🔧 How It Works

### Data Storage

The app uses browser localStorage to store data:

```javascript
// Users are stored as an array of objects
{
  id: 'user_timestamp',
  name: 'John Doe',
  incomes: [{name: 'Salary', amount: 5000}],
  expenses: [{name: 'Rent', amount: 1500}],
  taxRate: 20,
  taxType: 'gross'
}
```

### Tax Calculation

Two methods available:

**1. Gross Income Tax**
```javascript
taxAmount = (totalIncome × taxRate) / 100
netBalance = totalIncome - totalExpenses - taxAmount
```

**2. Net Income Tax (After Expenses)**
```javascript
netBeforeTax = totalIncome - totalExpenses
taxAmount = (netBeforeTax × taxRate) / 100 (if netBeforeTax > 0)
netBalance = netBeforeTax - taxAmount
```

### View Toggle

- **Monthly View**: Displays values as entered (multiplier = 1)
- **Yearly View**: Multiplies all values by 12 for annual projections

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Ideas for Contributions

- Add expense categories with icons
- Export budget to PDF or Excel
- Charts and graphs for visualization
- Budget comparison over time
- Currency converter
- Budget templates
- Dark mode toggle
- Email reminders for bills

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 Budget Planner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 💬 Support

### FAQ

**Q: Is my data secure?**
A: Yes! All data is stored locally in your browser. Nothing is sent to any server. However, if you clear your browser data, your budget data will be lost.

**Q: Can I use this on multiple devices?**
A: Each device stores its own data locally. To use on multiple devices, you would need to manually export/import data (future feature).

**Q: What happens if I delete my browser data?**
A: Your budget data will be lost. Consider exporting your data regularly (future feature).

**Q: Can I change the currency?**
A: Currently uses $ symbol, but you can mentally substitute any currency. Future updates may include currency selection.

**Q: Is there a limit to how many users/expenses I can add?**
A: No hard limit, but performance may vary based on browser localStorage limits (usually 5-10MB).

### Troubleshooting

**Problem**: Data not saving
- **Solution**: Check if your browser allows localStorage. Some private/incognito modes block it.

**Problem**: Modal won't close
- **Solution**: Refresh the page. Ensure you've created or selected a user.

**Problem**: Calculations seem wrong
- **Solution**: Click "Calculate Budget" button. Some changes require manual recalculation.

### Contact

For bugs, feature requests, or questions:
- Open an issue on GitHub
- Email: ogunleyepelumi123@gmail.com
- Linkedin : https://www.linkedin.com/in/pelumi-miracle-38b157212/

## 🙏 Acknowledgments

- Inspired by personal finance needs
- Built with ❤️ for anyone wanting to manage their budget
- Thanks to all contributors and users!

---

**Made with 💰 by Budget Planner Team**

**Star ⭐ this repo if you found it helpful!**
