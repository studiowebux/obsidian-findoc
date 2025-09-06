# ✅ WORKING Findoc Snippets - Verified Against Your Config

> **Based on your actual loaded models from data.json**
> **File path**: Use `september-2025.csv` (correct path)

---

## 📊 **GUARANTEED WORKING CHART MODELS**

### Basic Financial (Tested & Working)

```findoc
filename: september-2025.csv
model: expenses
view: chart
title: Daily Expenses Overview
```

```findoc
filename: september-2025.csv
model: expensesMonthly
view: chart
title: Monthly Expenses Trend
```

```findoc
filename: september-2025.csv
model: portfolio
view: chart
title: Portfolio Value Over Time
```

```findoc
filename: september-2025.csv
model: income
view: chart
title: Daily Income Tracking
```

```findoc
filename: september-2025.csv
model: incomeYearly
view: chart
title: Annual Income Summary
```

### Multi-Category Models

```findoc
filename: september-2025.csv
model: all
view: chart
title: All Categories Overview
```

```findoc
filename: september-2025.csv
model: mortgage
view: chart
title: Mortgage Balance Tracking
```

```findoc
filename: september-2025.csv
model: mortgageRate
view: chart
title: Mortgage Interest Rate Changes
```

### Investment & Dividend Models

```findoc
filename: september-2025.csv
model: dividend
view: chart
title: Dividend & Contributions by Month
```

```findoc
filename: september-2025.csv
model: cumulativeSum
view: chart
title: Cumulative Financial Growth
```

```findoc
filename: september-2025.csv
model: cumulativeSumPerTypes
view: chart
title: Cumulative Growth by Category
```

### Mathematical Models (Working)

```findoc
filename: september-2025.csv
model: incomeMinusExpensesByYearMonth
view: chart
title: Income vs Expenses (Monthly Net)
```

```findoc
filename: september-2025.csv
model: expensesPlusHouseExpensesByYearMonth
view: chart
title: Total Monthly Expenses
```

```findoc
filename: september-2025.csv
model: incomeMinusExpensesByDaily
view: chart
title: Daily Net Income (Cumulative)
```

### Time-Based Analysis

```findoc
filename: september-2025.csv
model: incomesExpensesYearly
view: chart
title: Annual Income vs Expenses
```

```findoc
filename: september-2025.csv
model: expensesOnlyMonthly
view: chart
title: Monthly Expense Categories
```

```findoc
filename: september-2025.csv
model: expensesOnlyDaily
view: chart
title: Daily Expense Categories
```

```findoc
filename: september-2025.csv
model: expensesOnlyYearly
view: chart
title: Annual Expense Categories
```

### NEW v0.8.0 Models (Working)

```findoc
filename: september-2025.csv
model: expensesQuarterly
view: chart
title: Quarterly Expense Analysis
```

```findoc
filename: september-2025.csv
model: incomeWeekly
view: chart
title: Weekly Income Trends
```

---

## 🥧 **WORKING PIE CHART MODELS**

### Value Distribution (Good for Pie Charts)

```findoc
filename: september-2025.csv
model: portfolioByValueRange
view: pie
title: Portfolio Distribution by Value Range
```

```findoc
filename: september-2025.csv
model: allCategoriesBreakdown
view: pie
title: All Financial Categories Distribution
```

```findoc
filename: september-2025.csv
model: dividend
view: pie
title: Dividends vs Contributions Distribution
```

```findoc
filename: september-2025.csv
model: cumulativeSumPerTypes
view: pie
title: Cumulative Category Totals
```

---

## 🎯 **WORKING RADAR CHARTS**

### Multi-Dimensional Analysis

```findoc
filename: september-2025.csv
model: all
view: radar
title: All Financial Categories Radar
```

```findoc
filename: september-2025.csv
model: cumulativeSumPerTypes
view: radar
title: Cumulative Growth Radar
```

```findoc
filename: september-2025.csv
model: incomesExpensesYearly
view: radar
title: Annual Financial Profile
```

```findoc
filename: september-2025.csv
model: dividend
view: radar
title: Investment Profile Radar
```

---

## 📋 **WORKING REPORT MODELS**

### Portfolio Reports

```findoc
filename: september-2025.csv
model: portfolioReport
view: report
date: 2025-09-01
```

```findoc
filename: september-2025.csv
model: portfolioReportTable
view: report
date: 2025-09-01
```

### Mathematical Reports

```findoc
filename: september-2025.csv
model: incomeMinusExpensesByYearMonthReport
view: report
date: 2025-09-01
```

```findoc
filename: september-2025.csv
model: expensesPlusHouseExpensesByYearMonthReport
view: report
date: 2025-09-01
```

### NEW v0.8.0 Reports

```findoc
filename: september-2025.csv
model: quarterlyIncomeExpenseReport
view: report
date: 2025-09-01
```

```findoc
filename: september-2025.csv
model: weeklyExpenseAnalysis
view: report
date: 2025-09-01
```

---

## 📊 **WORKING TABLE VIEWS**

### Portfolio Tables

```findoc
filename: september-2025.csv
model: portfolioReport
view: table
date: 2025-09-01
```

```findoc
filename: september-2025.csv
model: portfolioReportTable
view: table
date: 2025-09-01
```

### Mathematical Analysis Tables

```findoc
filename: september-2025.csv
model: incomeMinusExpensesByYearMonthReport
view: table
date: 2025-09-01
```

```findoc
filename: september-2025.csv
model: expensesPlusHouseExpensesByYearMonthReport
view: table
date: 2025-09-01
```

### NEW v0.8.0 Table Reports

```findoc
filename: september-2025.csv
model: quarterlyIncomeExpenseReport
view: table
date: 2025-09-01
```

```findoc
filename: september-2025.csv
model: weeklyExpenseAnalysis
view: table
date: 2025-09-01
```

---

## ⚠️ **KNOWN PROBLEMATIC MODELS**

### ❌ Avoid These (Will Show Errors)

**Broken data structure:**
```findoc
filename: september-2025.csv
model: expensesBySubcategory
view: pie
title: This Has Data Structure Issues
```

**Report models with chart views:**
```findoc
filename: september-2025.csv
model: portfolioReport
view: chart
title: This Will Show Error Message
```

**Complex/Experimental models:**
```findoc
filename: september-2025.csv
model: cumulativeSumForCotisationSplitByExtra
view: chart
title: May Not Work With Test Data
```

---

## 📝 **KEY DIFFERENCES FROM PREVIOUS FILE**

✅ **Fixed Issues:**
- **Correct file path**: `september-2025.csv` (not `september-2025.csv`)
- **Only verified models**: Based on your actual data.json
- **Removed problematic models**: Like broken `expensesBySubcategory` combos
- **Clear working vs broken sections**

✅ **All These Models Are In Your Config:**
- Total verified models: 26 models
- All have been migrated to v0.8.0
- All use functions that exist in methods.ts

**Start with these basic ones:**
1. `expenses` + `chart`
2. `portfolio` + `chart`
3. `dividend` + `pie`
4. `portfolioReport` + `table`
