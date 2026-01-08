---
title: Model Reference
description: Complete list of all available models
---

# Model Reference

Copy-paste any snippet below into your notes. Replace `finances.csv` with your file name.

## Expense Models

### Charts

**expensesMonthly** - Monthly expense totals
```findoc
filename: finances.csv
model: expensesMonthly
view: chart
```

**expensesWeekly** - Weekly expense totals
```findoc
filename: finances.csv
model: expensesWeekly
view: chart
```

**expensesQuarterly** - Quarterly expense totals
```findoc
filename: finances.csv
model: expensesQuarterly
view: chart
```

**expensesAnnually** - Annual expense totals
```findoc
filename: finances.csv
model: expensesAnnually
view: chart
```

**expenses** - Daily expense totals
```findoc
filename: finances.csv
model: expenses
view: chart
```

**expensesByCategory** - Expense breakdown by name (pie chart)
```findoc
filename: finances.csv
model: expensesByCategory
view: pie
```

### Tables

**expensesReport** - Current month expense summary
```findoc
filename: finances.csv
model: expensesReport
view: table
```

**expensesBySubcategoryTable** - Grouped by expense name, sorted by total
```findoc
filename: finances.csv
model: expensesBySubcategoryTable
view: table
```

With date filter (shows only that month):
```findoc
filename: finances.csv
model: expensesBySubcategoryTable
view: table
date: 2025-01-01
```

**expensesWeeklyTable** - Total expenses per week
```findoc
filename: finances.csv
model: expensesWeeklyTable
view: table
```

**expensesMonthlyTable** - Total expenses per month
```findoc
filename: finances.csv
model: expensesMonthlyTable
view: table
```

**expensesQuarterlyTable** - Total expenses per quarter
```findoc
filename: finances.csv
model: expensesQuarterlyTable
view: table
```

**expensesAnnuallyTable** - Total expenses per year
```findoc
filename: finances.csv
model: expensesAnnuallyTable
view: table
```

## Income Models

### Charts

**income** - Daily income totals
```findoc
filename: finances.csv
model: income
view: chart
```

**incomeWeekly** - Weekly income totals
```findoc
filename: finances.csv
model: incomeWeekly
view: chart
```

**incomeYearly** - Annual income totals
```findoc
filename: finances.csv
model: incomeYearly
view: chart
```

**incomeByCategory** - Income breakdown by source (pie chart)
```findoc
filename: finances.csv
model: incomeByCategory
view: pie
```

### Tables

**incomeReport** - Current month income summary
```findoc
filename: finances.csv
model: incomeReport
view: table
```

**incomeBySubcategoryTable** - Grouped by income source, sorted by total
```findoc
filename: finances.csv
model: incomeBySubcategoryTable
view: table
```

## Portfolio Models

### Charts

**portfolio** - Portfolio value over time
```findoc
filename: finances.csv
model: portfolio
view: chart
```

**portfolioByCategory** - Portfolio distribution by holding (pie chart)
```findoc
filename: finances.csv
model: portfolioByCategory
view: pie
```

**portfolioByValueRange** - Portfolio grouped by value ranges (pie chart)
```findoc
filename: finances.csv
model: portfolioByValueRange
view: pie
```

### Tables

**portfolioReport** - Current month portfolio snapshot
```findoc
filename: finances.csv
model: portfolioReport
view: table
```

With date filter (historical snapshot):
```findoc
filename: finances.csv
model: portfolioReport
view: table
date: 2024-12-01
```

**portfolioBySubcategoryTable** - Grouped by holding name, sorted by total
```findoc
filename: finances.csv
model: portfolioBySubcategoryTable
view: table
```

## Combined Models

**incomeVsExpenses** - Compare income and expenses monthly
```findoc
filename: finances.csv
model: incomeVsExpenses
view: chart
```

**netIncome** - Net income (Income minus Expenses) monthly
```findoc
filename: finances.csv
model: netIncome
view: chart
```

**byCategory** - All categories monthly
```findoc
filename: finances.csv
model: byCategory
view: chart
```

**all** - All categories daily
```findoc
filename: finances.csv
model: all
view: chart
```

## Debt and Loan Models

### Charts

**debt** - Debt balance over time
```findoc
filename: finances.csv
model: debt
view: chart
```

**loan** - Loan balance over time
```findoc
filename: finances.csv
model: loan
view: chart
```

**mortgage** - Mortgage balance over time
```findoc
filename: finances.csv
model: mortgage
view: chart
```

**mortgageRate** - Mortgage interest rate over time (percent format)
```findoc
filename: finances.csv
model: mortgageRate
view: chart
```

### Tables

**debtReport** - Current month debt summary
```findoc
filename: finances.csv
model: debtReport
view: table
```

**debtBySubcategoryTable** - Grouped by debt/loan name, sorted by total
```findoc
filename: finances.csv
model: debtBySubcategoryTable
view: table
```

## Dividend Models

### Charts

**dividend** - Monthly dividend totals
```findoc
filename: finances.csv
model: dividend
view: chart
```

**dividendQuarterly** - Quarterly dividend totals
```findoc
filename: finances.csv
model: dividendQuarterly
view: chart
```

**dividendByCategory** - Dividend breakdown by symbol (pie chart)
```findoc
filename: finances.csv
model: dividendByCategory
view: pie
```

**dividendMonthlyBySymbol** - Monthly dividends per symbol (multi-series)
```findoc
filename: finances.csv
model: dividendMonthlyBySymbol
view: chart
```

**dividendQuarterlyBySymbol** - Quarterly dividends per symbol
```findoc
filename: finances.csv
model: dividendQuarterlyBySymbol
view: radar
```

**dividendCumulativeBySymbol** - Cumulative dividends per symbol
```findoc
filename: finances.csv
model: dividendCumulativeBySymbol
view: chart
```

### Tables

**dividendReport** - Current month dividend summary
```findoc
filename: finances.csv
model: dividendReport
view: table
```

**dividendBySubcategoryTable** - Grouped by symbol, sorted by total
```findoc
filename: finances.csv
model: dividendBySubcategoryTable
view: table
```

**dividendAnalysisReport** - Comprehensive dividend metrics per symbol (Total, Avg Monthly, Payment Count, First/Last Payment dates)
```findoc
filename: finances.csv
model: dividendAnalysisReport
view: table
```

## Advanced Models

**cumulativeSum** - Cumulative sum across all categories
```findoc
filename: finances.csv
model: cumulativeSum
view: chart
```

**cumulativeSumPerTypes** - Cumulative sum per category (multi-series)
```findoc
filename: finances.csv
model: cumulativeSumPerTypes
view: chart
```

**incomeMinusExpensesByYearMonth** - Net income chart
```findoc
filename: finances.csv
model: incomeMinusExpensesByYearMonth
view: chart
```

**incomeMinusExpensesByDaily** - Daily cumulative net income
```findoc
filename: finances.csv
model: incomeMinusExpensesByDaily
view: chart
```

**expensesPlusHouseExpensesByYearMonth** - Combined expenses monthly
```findoc
filename: finances.csv
model: expensesPlusHouseExpensesByYearMonth
view: chart
```

**incomeMinusExpensesByYearMonthReport** - Net income table
```findoc
filename: finances.csv
model: incomeMinusExpensesByYearMonthReport
view: table
```

**expensesPlusHouseExpensesByYearMonthReport** - Combined expenses table
```findoc
filename: finances.csv
model: expensesPlusHouseExpensesByYearMonthReport
view: table
```

**quarterlyIncomeExpenseReport** - Quarterly income and expense totals
```findoc
filename: finances.csv
model: quarterlyIncomeExpenseReport
view: table
```

**weeklyExpenseAnalysis** - Weekly expense totals
```findoc
filename: finances.csv
model: weeklyExpenseAnalysis
view: table
```

**expensesMonthlyBreakdown** - Monthly expenses by subcategory (multi-series)
```findoc
filename: finances.csv
model: expensesMonthlyBreakdown
view: chart
```

**allCategoriesBreakdown** - All categories summed by type (pie chart)
```findoc
filename: finances.csv
model: allCategoriesBreakdown
view: pie
```

**incomesExpensesYearly** - Annual income and expenses
```findoc
filename: finances.csv
model: incomesExpensesYearly
view: chart
```

**expensesOnlyMonthly** - Monthly expenses only
```findoc
filename: finances.csv
model: expensesOnlyMonthly
view: chart
```

**expensesOnlyDaily** - Daily expenses only
```findoc
filename: finances.csv
model: expensesOnlyDaily
view: chart
```

**expensesOnlyYearly** - Annual expenses only
```findoc
filename: finances.csv
model: expensesOnlyYearly
view: chart
```

## Parameters

All models accept these optional parameters:

**filename** - CSV file path (required)
```findoc
filename: finances.csv
```

**Multiple files** - Combine data from multiple CSVs
```findoc
filename: expenses.csv, income.csv
```

**title** - Custom chart title
```findoc
filename: finances.csv
model: expenses
view: chart
title: My Expense Tracker
```

**date** - Filter to specific month (table/report models only)
```findoc
filename: finances.csv
model: portfolioReport
view: table
date: 2025-01-01
```

**view** - Visualization type (default: chart)
- `chart` - Line chart
- `pie` - Pie chart
- `radar` - Radar chart
- `table` - Table view
- `report` - Text report

## View Compatibility

| Model Type | chart | pie | radar | table | report |
|------------|-------|-----|-------|-------|--------|
| Chart models (expenses, income, portfolio, etc.) | Yes | Yes | Yes | No | No |
| Report/Table models (expensesReport, portfolioReport, etc.) | No | No | No | Yes | Yes |
