---
title: Charts and Reports
description: Common chart and report examples
---

# Charts and Reports

Quick examples of the most common visualizations. See [Model Reference](model-reference.md) for complete list of all models.

## Common Patterns

### Basic Charts

**Track monthly expenses:**
```findoc
filename: finances.csv
model: expensesMonthly
view: chart
```

**Income vs expenses:**
```findoc
filename: finances.csv
model: incomeVsExpenses
view: chart
```

**Portfolio value:**
```findoc
filename: finances.csv
model: portfolio
view: chart
```

### Pie Charts

**Expense breakdown by category:**
```findoc
filename: finances.csv
model: expensesByCategory
view: pie
```

**Portfolio allocation:**
```findoc
filename: finances.csv
model: portfolioByCategory
view: pie
```

### Table Reports

**Current month portfolio snapshot:**
```findoc
filename: finances.csv
model: portfolioReport
view: table
```

**Expenses grouped by name:**
```findoc
filename: finances.csv
model: expensesBySubcategoryTable
view: table
```

**Monthly expense totals:**
```findoc
filename: finances.csv
model: expensesMonthlyTable
view: table
```

## Advanced Features

### Multiple CSV Files

Combine data from multiple files:
```findoc
filename: expenses.csv, income.csv, portfolio.csv
model: incomeVsExpenses
view: chart
```

Files are merged before processing.

### Filter by Date

Show specific month (table/report views only):
```findoc
filename: finances.csv
model: portfolioReport
view: table
date: 2024-12-01
```

Without `date`, shows current month. With `date`, shows historical snapshot.

For subcategory tables:
```findoc
filename: finances.csv
model: expensesBySubcategoryTable
view: table
date: 2025-01-01
```

Without `date`, shows all-time totals. With `date`, shows only that month.

### Custom Titles

```findoc
filename: finances.csv
model: incomeVsExpenses
view: chart
title: My 2025 Financial Overview
```

### Chart Information Footer

Each chart includes a collapsible footer with details about how the chart was generated. Click the toggle button to view:
- Model name used
- Source CSV file(s)
- Processing details (for troubleshooting)

## View Types

Change visualization type with `view` parameter:

**Line chart:**
```findoc
view: chart
```

**Pie chart:**
```findoc
view: pie
```

**Radar chart:**
```findoc
view: radar
```

**Table:**
```findoc
view: table
```

**Text report:**
```findoc
view: report
```

Not all models support all views. Chart models work with chart/pie/radar. Report models work with table/report only.

## Quick Reference by Category

### Expenses
- **expensesMonthly** - Monthly totals (chart)
- **expensesWeekly** - Weekly totals (chart)
- **expensesQuarterly** - Quarterly totals (chart)
- **expensesAnnually** - Annual totals (chart)
- **expensesByCategory** - Breakdown by name (pie)
- **expensesBySubcategoryTable** - Grouped by name (table)
- **expensesMonthlyTable** - Monthly totals (table)

### Income
- **income** - Daily totals (chart)
- **incomeWeekly** - Weekly totals (chart)
- **incomeYearly** - Annual totals (chart)
- **incomeByCategory** - Breakdown by source (pie)
- **incomeBySubcategoryTable** - Grouped by source (table)

### Portfolio
- **portfolio** - Value over time (chart)
- **portfolioByCategory** - Distribution by holding (pie)
- **portfolioReport** - Current snapshot (table)
- **portfolioBySubcategoryTable** - Grouped by holding (table)

### Combined
- **incomeVsExpenses** - Compare income/expenses (chart)
- **netIncome** - Net income calculation (chart)
- **byCategory** - All categories (chart)

### Dividends
- **dividend** - Monthly totals (chart)
- **dividendQuarterly** - Quarterly totals (chart)
- **dividendByCategory** - Breakdown by symbol (pie)
- **dividendAnalysisReport** - Comprehensive metrics (table)

### Debt
- **debt** - Balance over time (chart)
- **loan** - Loan balance (chart)
- **mortgage** - Mortgage balance (chart)
- **debtReport** - Current summary (table)

See [Model Reference](model-reference.md) for complete list with all parameters and options.

## Migration Note

**Deprecated parameter:** `type` still works but use `view` instead:

Old:
```findoc
type: chart
```

New:
```findoc
view: chart
```
