---
title: Getting Started with FinDoc
description: Quick guide to track your finances in Obsidian
---

# Getting Started

Track your income, expenses, and portfolio directly in Obsidian with simple CSV files and charts.

## Create Your First Financial File

**Two ways to create a CSV file:**

1. **Ribbon icon:** Click the FinDoc icon in the left sidebar (creates file in vault root)
2. **File menu:** Right-click a folder → FinDoc: Create new CSV file (creates file in selected folder)

Name your file (e.g., `finances.csv`). The file opens with these columns:
- Category
- Subcategory
- Value
- TimeStamp
- Extra

## Add Your Data

Click in any cell to type. Here's an example:

| Category  | Subcategory | Value | TimeStamp  | Extra      |
| --------- | ----------- | ----- | ---------- | ---------- |
| Income    | Salary      | 5000  | 2025-01-15 | January    |
| Expenses  | Groceries   | 450   | 2025-01-16 |            |
| Expenses  | Gas         | 80    | 2025-01-18 |            |
| Portfolio | AAPL        | 15000 | 2025-01-01 | 100 shares |

**Tips:**

- Category dropdown helps you pick standard categories
- Subcategory autocompletes from your previous entries
- Value accepts math: `100 + 50` becomes `150`
- Date format: `YYYY-MM-DD`

## Show a Chart

In any note, add this code block:

````markdown
```findoc
filename: finances.csv
model: expenses
view: chart
title: My Monthly Expenses
```
````

Your expenses appear as a line chart.

## Common Charts

**Track monthly income vs expenses:**

````markdown
```findoc
filename: finances.csv
model: incomeVsExpenses
view: chart
```
````

**Portfolio value over time:**

````markdown
```findoc
filename: finances.csv
model: portfolio
view: chart
```
````

**Expense breakdown (pie chart):**

````markdown
```findoc
filename: finances.csv
model: expensesByCategory
view: pie
```
````

## Show a Summary Report

Get totals and stats in table format:

````markdown
```findoc
filename: finances.csv
model: portfolioReport
view: table
```
````

Or text format:

````markdown
```findoc
filename: finances.csv
model: expensesReport
view: report
```
````

## Organize Your Data

**Sort by date:** Click "Sort by Date" button

**Add row:** Click "Add New Row" button (copies your last row as template)

**Remove row:** Click trash icon on any row

**Move rows:** Use up/down arrows

**Undo changes:** Click "Restore Backup"

## Multiple Files

Create separate CSV files for different purposes:

- `portfolio.csv` - investments
- `expenses.csv` - monthly spending
- `income.csv` - salary and side income
- `mortgage.csv` - loan tracking

**Reference a single file:**

````markdown
```findoc
filename: portfolio.csv
model: portfolio
view: chart
```
````

**Combine multiple files in one chart:**

````markdown
```findoc
filename: expenses.csv, income.csv, mortgage.csv
model: incomeVsExpenses
view: chart
```
````

Files are merged before processing. Data is concatenated and sorted by timestamp.

## Categories

Default categories you can use:

- Portfolio
- Income
- Expenses
- Mortgage
- Dividend
- Debt
- Loan

Add your own in Settings → FinDoc → Categories.
