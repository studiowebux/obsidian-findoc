---
title: User Documentation
description: Learn to use FinDoc for personal finance tracking
---

# User Documentation

Everything you need to track your finances in Obsidian.

## Getting Started

New to FinDoc? Start here:

1. [Getting Started](getting-started.md) - Create your first financial file and charts
2. [Charts and Reports](charts-and-reports.md) - See all available visualizations
3. [CSV Editor Guide](csv-editor.md) - Learn to edit your data efficiently
4. [Settings](settings.md) - Customize categories and behavior

## Common Tasks

**Track monthly expenses:**
```findoc
filename: expenses.csv
model: expensesMonthly
view: chart
```

**Compare income vs expenses:**
```findoc
filename: finances.csv
model: incomeVsExpenses
view: chart
```

**View portfolio over time:**
```findoc
filename: portfolio.csv
model: portfolio
view: chart
```

**Get a summary report:**
```findoc
filename: finances.csv
model: portfolioReport
view: table
```

## Need More?

[Developer Documentation](../developer/architecture.md) for advanced customization and custom models.
