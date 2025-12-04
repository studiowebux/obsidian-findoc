---
title: Models Reference
description: Complete reference for built-in models and custom model creation
tags:
    - models
    - configuration
    - data-processing
---

# Models Reference

Models define data transformation pipelines from CSV to charts/reports.

## Model Structure

```typescript
{
  dataSource: string,        // Split function name
  dataSourceKey: string,     // Key to split on (timestamp|category|subcategory|value|extra)
  categories: string[],      // Categories to include
  output: string,            // Generator function name
  beginAtZero: boolean,      // Chart Y-axis starts at zero
  chartLabelType: string,    // Label format (money|percent|generic|custom)
  suffix?: string,           // Custom label suffix
  date?: string,             // Optional date filter
  values: string             // Comma-separated parameters for output function
}
```

## Built-in Models

### Basic Expense/Income Models

#### `expenses`

Daily expense tracking across all categories.

- **Data Source**: `splitDailyDates`
- **Categories**: Income, House Expenses, Expenses
- **Output**: `generateDailyDataSet`
- **Chart Type**: Line
- **Label**: Money

#### `expensesMonthly`

Monthly aggregated expenses.

- **Data Source**: `splitByYearMonth`
- **Categories**: Income, House Expenses, Expenses
- **Output**: `generateSumDataSet`

#### `expensesQuarterly`

Quarterly expense analysis.

- **Data Source**: `splitByQuarter`
- **Categories**: House Expenses, Expenses
- **Output**: `generateSumDataSet`

#### `income`

Daily income tracking.

- **Data Source**: `splitDailyDates`
- **Categories**: Income
- **Output**: `generateDailyDataSet`

#### `incomeYearly`

Annual income aggregation.

- **Data Source**: `splitByYear`
- **Categories**: Income
- **Output**: `generateSumDataSet`

#### `incomeWeekly`

Weekly income analysis.

- **Data Source**: `splitByWeek`
- **Categories**: Income
- **Output**: `generateSumDataSet`

### Portfolio Models

#### `portfolio`

Daily portfolio value tracking.

- **Data Source**: `splitDailyDates`
- **Categories**: Portfolio
- **Output**: `generateDailyDataSet`
- **Begin at Zero**: false

#### `portfolioByValueRange`

Portfolio distribution by value ranges.

- **Data Source**: `splitByValueRange`
- **Categories**: Portfolio
- **Output**: `generateSumDataSetPerTypes`
- **Data Source Key**: value

#### `portfolioReport`

Current month portfolio snapshot.

- **Data Source**: `splitByYearMonth`
- **Categories**: Portfolio, Income, Cotisation, Expenses, House Expenses, Dividend, Debt
- **Output**: `getLastValuePerTypeForCurrentMonth`
- **View**: report or table

### Mortgage Models

#### `mortgage`

Daily mortgage balance tracking.

- **Data Source**: `splitDailyDates`
- **Categories**: Mortgage
- **Output**: `generateDailyDataSet`
- **Begin at Zero**: false

#### `mortgageRate`

Interest rate tracking over time.

- **Data Source**: `splitDailyDates`
- **Categories**: Mortgage Rate
- **Output**: `generateDailyDataSet`
- **Chart Label**: percent

### Dividend Models

#### `dividend`

Monthly dividend and contribution aggregation.

- **Data Source**: `splitByYearMonth`
- **Categories**: Dividend, Cotisation
- **Output**: `generateSumDataSetPerTypes`

#### `dividendMonthlyBySymbol`

Monthly dividends broken down by symbol (subcategory).

- **Data Source**: `splitByYearMonth`
- **Categories**: Dividend
- **Output**: `generateDividendMonthlyBySymbol`

#### `dividendCumulativeBySymbol`

Cumulative dividends per symbol over time.

- **Data Source**: `splitByYearMonth`
- **Categories**: Dividend
- **Output**: `generateCumulativeDividendBySymbol`

#### `dividendQuarterlyBySymbol`

Quarterly dividend breakdown by symbol.

- **Data Source**: `splitByQuarter`
- **Categories**: Dividend
- **Output**: `generateDividendMonthlyBySymbol`

#### `dividendAnalysisReport`

Comprehensive dividend analysis (report view).

- **Data Source**: `splitByYearMonth`
- **Categories**: Dividend
- **Output**: `reportDividendAnalysis`
- **View**: report or table
- **Metrics**: Total dividends, average monthly, payment count per symbol

### Cumulative Models

#### `cumulativeSum`

Cumulative sum across categories.

- **Data Source**: `splitByYearMonth`
- **Categories**: Portfolio, Income, Cotisation, Expenses, House Expenses, Dividend
- **Output**: `generateCumulativeSumDataSet`

#### `cumulativeSumPerTypes`

Cumulative sum split by category.

- **Data Source**: `splitByYearMonth`
- **Categories**: Portfolio, Income, Cotisation, Expenses, House Expenses, Dividend
- **Output**: `generateCumulativeSumDataSetPerTypes`

#### `cumulativeSumForCotisationSplitByExtra`

Cumulative contributions by extra field.

- **Data Source**: `splitBy`
- **Categories**: Cotisation
- **Output**: `generateCumulativeSumDataSetPerTypes`
- **Data Source Key**: extra

### Comparison Models

#### `incomeMinusExpensesByYearMonth`

Monthly net income (Income - Expenses).

- **Data Source**: `splitByYearMonth`
- **Categories**: Income, Expenses
- **Output**: `generateDifference`
- **Values**: "Income, Expenses"

#### `incomeMinusExpensesByDaily`

Daily cumulative net income.

- **Data Source**: `splitDailyDates`
- **Categories**: Income, Expenses
- **Output**: `generateCumulativeDifference`
- **Values**: "Income, Expenses"

#### `expensesPlusHouseExpensesByYearMonth`

Total monthly expenses (Expenses + House Expenses).

- **Data Source**: `splitByYearMonth`
- **Categories**: Expenses, House Expenses
- **Output**: `generateSum`
- **Values**: "Expenses, House Expenses"

### Breakdown Models

#### `expensesMonthlyBreakdown`

Monthly expenses separated by category.

- **Data Source**: `splitByYearMonth`
- **Categories**: House Expenses, Expenses
- **Output**: `generateSumDataSetPerTypes`

#### `allCategoriesBreakdown`

All categories broken down by type.

- **Data Source**: `splitByCategory`
- **Categories**: Portfolio, Income, House Expenses, Expenses, Dividend
- **Output**: `generateSumDataSetPerTypes`
- **Data Source Key**: category

### Report Models

#### `incomeMinusExpensesByYearMonthReport`

Net income report (table/text view).

- **Output**: `reportDifference`
- **View**: report or table

#### `expensesPlusHouseExpensesByYearMonthReport`

Total expenses report (table/text view).

- **Output**: `reportSum`
- **View**: report or table

#### `quarterlyIncomeExpenseReport`

Quarterly financial summary.

- **Data Source**: `splitByQuarter`
- **Output**: `reportSum`
- **View**: report or table

#### `weeklyExpenseAnalysis`

Weekly expense breakdown.

- **Data Source**: `splitByWeek`
- **Output**: `reportSum`
- **View**: report or table

#### `portfolioReportTable`

Portfolio snapshot for current month (table view).

- **Output**: `getLastValuePerTypeForCurrentMonth`
- **View**: table

### Aggregate Models

#### `all`

All financial categories in single view.

- **Categories**: Portfolio, Income, Mortgage, Mortgage Rate, Cotisation, Dividend, House Expenses, Expenses
- **Output**: `generateDailyDataSet`

#### `incomesExpensesYearly`

Annual income and expense summary.

- **Data Source**: `splitByYear`
- **Categories**: Income, House Expenses, Expenses
- **Output**: `generateSumDataSet`

#### `expensesOnlyMonthly`, `expensesOnlyDaily`, `expensesOnlyYearly`

Expense-only views at different time granularities.

## Custom Model Creation

### Via Settings UI

1. Navigate to Settings → FinDoc → Models
2. Click "Add New Model"
3. Configure model parameters
4. Save settings

### Model Validation

Invalid models show inline errors:

- Missing split function
- Invalid output function
- Incompatible view type (e.g., report output with chart view)

### Example: Custom Model

```yaml
customExpenseAnalysis:
    dataSource: splitByYearMonth
    categories: ["Expenses"]
    output: generateSumDataSetPerTypes
    beginAtZero: true
    chartLabelType: money
    dataSourceKey: timestamp
    values: ""
```

Usage:

````markdown
```findoc
filename: expenses.csv
model: customExpenseAnalysis
view: pie
```
````

## Model Compatibility Matrix

| Output Function                      | Chart View | Report View | Table View |
| ------------------------------------ | ---------- | ----------- | ---------- |
| `generateDailyDataSet`               | ✓          | ✗           | ✗          |
| `generateSumDataSet`                 | ✓          | ✗           | ✗          |
| `generateSumDataSetPerTypes`         | ✓          | ✗           | ✗          |
| `generateDifference`                 | ✓          | ✗           | ✗          |
| `generateSum`                        | ✓          | ✗           | ✗          |
| `generateCumulativeSumDataSet`       | ✓          | ✗           | ✗          |
| `getLastValuePerTypeForCurrentMonth` | ✗          | ✓           | ✓          |
| `reportDifference`                   | ✗          | ✓           | ✓          |
| `reportSum`                          | ✗          | ✓           | ✓          |
| `reportDividendAnalysis`             | ✗          | ✓           | ✓          |
| `generateDividendMonthlyBySymbol`    | ✓          | ✗           | ✗          |

## Migration

Plugin automatically migrates settings on version updates, adding new models while preserving custom models.
