---
title: Data Processing
description: Split functions and generator functions for data transformation
tags:
    - data-processing
    - transformation
    - functions
---

# Data Processing

Data processing pipeline transforms CSV data into chart datasets and reports using split functions and generators.

## Pipeline Overview

```
CSV Data → getData() → Split Function → Generator Function → Chart/Report
```

## Split Functions

Split functions partition data into groups for aggregation.

### Time-based Splits

#### `splitDailyDates`

Groups by day (YYYY-MM-DD).

```typescript
// Input timestamp: 2025-01-15
// Output key: "2025-01-15"
```

#### `splitByYearMonth`

Groups by month (YYYY-MM).

```typescript
// Input timestamp: 2025-01-15
// Output key: "2025-01"
```

#### `splitByYear`

Groups by year (YYYY).

```typescript
// Input timestamp: 2025-01-15
// Output key: "2025"
```

#### `splitByQuarter`

Groups by fiscal quarter (YYYY-Q#).

```typescript
// Input timestamp: 2025-01-15 (Q1)
// Output key: "2025-Q1"

// Quarter mapping:
// Q1: Jan-Mar (months 0-2)
// Q2: Apr-Jun (months 3-5)
// Q3: Jul-Sep (months 6-8)
// Q4: Oct-Dec (months 9-11)
```

#### `splitByWeek`

Groups by ISO week number (YYYY-W##).

```typescript
// Input timestamp: 2025-01-15
// Output key: "2025-W03"
```

ISO week calculation:

- Week starts Monday
- Week 1 contains first Thursday of year
- Weeks numbered 01-53

### Dimension-based Splits

#### `splitBy`

Generic split by any field (timestamp|category|subcategory|value|extra).

```typescript
// dataSourceKey: "extra"
// Input extra: "RRSP"
// Output key: "RRSP"
```

#### `splitByCategory`

Groups by category field.

```typescript
// Input category: "Income"
// Output key: "Income"
```

#### `splitBySubcategory`

Groups by subcategory field.

```typescript
// Input subcategory: "Salary"
// Output key: "Salary"
```

#### `splitByValueRange`

Groups by value magnitude.

```typescript
// Value ranges:
// "Small (<100)": value < 100
// "Medium (100-1000)": 100 ≤ value ≤ 1000
// "Large (>1000)": value > 1000

// Uses absolute value: |value|
```

## Generator Functions

Generator functions transform grouped data into chart datasets or reports.

### Chart Generators

#### `generateDailyDataSet`

Creates line chart with daily values (last value per day).

- Filters zero-sum days
- Handles missing data (NaN for gaps)
- Preserves actual daily values

```typescript
// Use case: Daily portfolio snapshots
// Each point = last recorded value for that day
```

#### `generateSumDataSet`

Aggregates values within each group.

- Sums all entries per period
- One dataset per subcategory
- Useful for total expenses/income

```typescript
// Use case: Monthly total expenses
// Each point = sum of all expenses in month
```

#### `generateSumDataSetPerTypes`

Creates separate dataset per category.

- One line per category
- Sums values per period
- Enables category comparison

```typescript
// Use case: Income vs Expenses comparison
// Two lines: Income total and Expense total per month
```

#### `generateCumulativeSumDataSet`

Running total across periods.

- Cumulative sum per subcategory
- Tracks accumulation over time

```typescript
// Use case: Total saved over time
// Each point = current period + all previous periods
```

#### `generateCumulativeSumDataSetPerTypes`

Running total per category.

- Separate cumulative line per category
- Useful for portfolio growth tracking

#### `generateDifference`

Calculates difference between two categories.

- Requires `values` parameter: "Category1, Category2"
- Result: Category1 - Category2
- Single dataset

```typescript
// values: "Income, Expenses"
// Output: Net income per period
```

#### `generateCumulativeDifference`

Cumulative difference over time.

- Running net total
- Tracks cash flow

#### `generateSum`

Adds two or more categories.

- Requires `values` parameter
- Result: Category1 + Category2 + ...
- Single dataset

```typescript
// values: "Expenses, House Expenses"
// Output: Total expenses per period
```

### Dividend Generators

#### `generateDividendMonthlyBySymbol`

Monthly dividends split by symbol (subcategory).

- One dataset per symbol
- Shows dividend payments per stock

#### `generateCumulativeDividendBySymbol`

Cumulative dividends per symbol.

- Tracks total dividends received per stock over time

### Report Generators

#### `getLastValuePerTypeForCurrentMonth`

Latest value per category for specified month.

- Defaults to current month if no `date` parameter
- Useful for portfolio snapshots
- Output: `IReportData`

```typescript
// Returns: { label: "Portfolio", data: 150000, date: "2025-01" }
```

#### `reportDifference`

Category difference in report format.

- Text or table view
- Requires `values` parameter

#### `reportSum`

Category sum in report format.

- Aggregated totals per period
- Table/text output

#### `reportDividendAnalysis`

Comprehensive dividend metrics per symbol:

- Total dividends received
- Average monthly dividend
- Payment count
- First and last payment dates
- Output: `IReportMultiData`

## Data Flow Example

### Input CSV

```csv
Category,Subcategory,Value,TimeStamp,Extra
Income,Salary,5000,2025-01-15,Regular
Expenses,Rent,1500,2025-01-01,Monthly
Expenses,Food,300,2025-01-20,Weekly
```

### Processing Steps

1. **Parse CSV** (`getData()`)

```typescript
[
  { category: "Income", subcategory: "Salary", value: 5000, timestamp: Date(2025-01-15), extra: "Regular" },
  { category: "Expenses", subcategory: "Rent", value: 1500, timestamp: Date(2025-01-01), extra: "Monthly" },
  { category: "Expenses", subcategory: "Food", value: 300, timestamp: Date(2025-01-20), extra: "Weekly" }
]
```

2. **Split by Month** (`splitByYearMonth`)

```typescript
{
  "2025-01": [
    { category: "Income", subcategory: "Salary", value: 5000, ... },
    { category: "Expenses", subcategory: "Rent", value: 1500, ... },
    { category: "Expenses", subcategory: "Food", value: 300, ... }
  ]
}
```

3. **Generate Sum Dataset** (`generateSumDataSet`)

```typescript
{
  labels: ["2025-01"],
  datasets: [
    { label: "Salary", data: [5000], ... },
    { label: "Rent", data: [1500], ... },
    { label: "Food", data: [300], ... }
  ]
}
```

## Custom Processing

### Creating Custom Split Function

Add to `methods.ts`:

```typescript
splitByCustom: {
  help: "Description of split logic",
  exec: (input: Array<IInput>, key: IDataSourceKeys) => {
    return input.reduce((acc, current) => {
      const customKey = /* your logic */;
      if (!acc[customKey]) acc[customKey] = [];
      acc[customKey].push(current);
      return acc;
    }, {});
  }
}
```

### Creating Custom Generator

Add to `methods.ts`:

```typescript
generateCustom: {
  help: "Description of generator",
  exec: ({ categoriesToSelect, input, labels, categories, colors, values }) => {
    // Transform input into IDataset or IReportData
    return {
      labels,
      datasets: [/* your datasets */]
    };
  }
}
```

## Performance Considerations

### Split Function Performance

- O(n) complexity for all split functions
- Single-pass reduce operations
- Efficient for large datasets

### Generator Function Performance

- Chart generators: O(n × m) where n = periods, m = categories
- Report generators: O(n) for most operations
- Dividend analysis: O(n × log n) for date sorting

## Error Handling

Invalid data handling:

- NaN timestamps sorted to end
- Missing values default to 0
- Empty groups filtered out
- Invalid model names throw errors with helpful messages

## Date Utilities

Helper functions in `utils.ts`:

- `getMonth()`: Returns zero-padded month (01-12)
- `getDate()`: Returns zero-padded day (01-31)
- `getToday()`: Returns current date in ISO format
- `skipped()`: Handles Chart.js segment gaps
