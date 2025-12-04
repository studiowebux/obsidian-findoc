---
title: FinDoc Plugin
description: Financial tracking for Obsidian using CSV and charts
---

# FinDoc Plugin

Track income, expenses, portfolio, and other financial data in Obsidian with simple CSV files and automatic charts.

## What is FinDoc?

An Obsidian plugin that lets you:
- Edit financial data in CSV format
- Generate charts automatically (line, pie, radar)
- Create summary reports
- Track multiple financial categories
- Visualize your finances over time

## Documentation

Choose your path:

### [For Users →](user/getting-started.md)

Track your personal finances without coding knowledge.

**Topics:**
- Create and edit financial files
- Display charts in your notes
- Available chart types
- Customize categories and settings

### [For Developers →](developer/architecture.md)

Extend the plugin, create custom models, or understand the internals.

**Topics:**
- Plugin architecture
- TypeScript API reference
- Custom model creation
- Data processing pipeline
- Performance optimization

## Quick Example

**Create a file:**
Click the FinDoc ribbon icon to create `finances.csv`

**Add data:**
| Category | Subcategory | Value | TimeStamp | Extra |
|----------|-------------|-------|-----------|-------|
| Income | Salary | 5000 | 2025-01-15 | |
| Expenses | Rent | 1500 | 2025-01-15 | |

**Show chart in any note:**
````markdown
```findoc
filename: finances.csv
model: incomeVsExpenses
view: chart
```
````

## Features

- **CSV Editor**: Dropdown categories, autocomplete, math expressions
- **30+ Charts**: Pre-built models for common financial tracking
- **Reports**: Table and text summaries
- **Categories**: Portfolio, Income, Expenses, Mortgage, Dividends, Debt, Loans
- **Mobile Support**: Works on desktop and mobile
- **Performance**: Handles large datasets with lazy loading

## Get Started

[User Guide](user/getting-started.md) | [Developer Docs](developer/architecture.md)
