---
title: Charts and Reports
description: Available charts and reports you can use
---

# Charts and Reports

Use these pre-built models in your code blocks to visualize your financial data.

## Expense Charts

**Daily expenses:**

```findoc
filename: finances.csv
model: expenses
view: chart
```

**Monthly expenses:**

```findoc
filename: finances.csv
model: expensesMonthly
view: chart
```

**Quarterly expenses:**

```findoc
filename: finances.csv
model: expensesQuarterly
view: chart
```

**Expense breakdown (pie):**

```findoc
filename: finances.csv
model: expensesByCategory
view: pie
```

## Income Charts

**Daily income:**

```findoc
filename: finances.csv
model: income
view: chart
```

**Weekly income:**

```findoc
filename: finances.csv
model: incomeWeekly
view: chart
```

**Yearly income:**

```findoc
filename: finances.csv
model: incomeYearly
view: chart
```

**Income breakdown (pie):**

```findoc
filename: finances.csv
model: incomeByCategory
view: pie
```

## Combined Charts

**Income vs Expenses:**

```findoc
filename: finances.csv
model: incomeVsExpenses
view: chart
```

**Net income (income minus expenses):**

```findoc
filename: finances.csv
model: netIncome
view: chart
```

**All categories monthly:**

```findoc
filename: finances.csv
model: byCategory
view: chart
```

## Portfolio Charts

**Portfolio value over time:**

```findoc
filename: finances.csv
model: portfolio
view: chart
```

**Portfolio distribution (pie):**

```findoc
filename: finances.csv
model: portfolioByCategory
view: pie
```

**Value ranges:**

```findoc
filename: finances.csv
model: portfolioByValueRange
view: pie
```

## Debt and Loan Charts

**Debt tracking:**

```findoc
filename: finances.csv
model: debt
view: chart
```

**Loan balance:**

```findoc
filename: finances.csv
model: loan
view: chart
```

**Mortgage tracking:**

```findoc
filename: finances.csv
model: mortgage
view: chart
```

## Dividend Charts

**Monthly dividends:**

```findoc
filename: finances.csv
model: dividend
view: chart
```

**Quarterly dividends:**

```findoc
filename: finances.csv
model: dividendQuarterly
view: chart
```

**Dividend by category (pie):**

```findoc
filename: finances.csv
model: dividendByCategory
view: pie
```

## Reports (Tables)

**Portfolio summary:**

```findoc
filename: finances.csv
model: portfolioReport
view: table
```

**Expense summary:**

```findoc
filename: finances.csv
model: expensesReport
view: table
```

**Income summary:**

```findoc
filename: finances.csv
model: incomeReport
view: table
```

**Debt summary:**

```findoc
filename: finances.csv
model: debtReport
view: table
```

**Dividend summary:**

```findoc
filename: finances.csv
model: dividendReport
view: table
```

## Chart Types

Change the `view` parameter to get different visualizations:

**Line chart (default):**

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

**Text report:**

```findoc
view: report
```

**Table report:**

```findoc
view: table
```

## Add a Title

```findoc
filename: finances.csv
model: incomeVsExpenses
view: chart
title: My Income vs Expenses 2025
```
