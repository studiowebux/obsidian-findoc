---
title: Reports
description: Report generation and formatting for financial data analysis
tags:
    - reports
    - tables
    - data-analysis
---

# Reports

Report generation for text and table-based financial data views.

## Report Types

### Text Reports

Simple text-based output with formatted values.

**Usage:**

````markdown
```findoc
filename: data.csv
model: portfolioReport
view: report
```
````

**Output:**

```
Report 2025-01

Data Source: Split By Year Month
Output: Get Last Value Per Type For Current Month

---
Portfolio: $150,000.00
Income: $5,000.00
Expenses: $2,500.00
```

### Table Reports

Structured table view with columns.

**Usage:**

````markdown
```findoc
filename: data.csv
model: portfolioReport
view: table
```
````

**Output:**

| Category  | Value       | Date    |
| --------- | ----------- | ------- |
| Portfolio | $150,000.00 | 2025-01 |
| Income    | $5,000.00   | 2025-01 |
| Expenses  | $2,500.00   | 2025-01 |

## Report Data Types

### Simple Reports (IReportData)

Single date snapshot with values per category.

**Structure:**

```typescript
{
	datasets: [
		{ label: "Portfolio", data: 150000, date: "2025-01" },
		{ label: "Income", data: 5000, date: "2025-01" },
	];
}
```

**Models:**

- `portfolioReport`
- `portfolioReportTable`

### Multi-Period Reports (IReportMultiData)

Time series data with multiple periods.

**Structure:**

```typescript
{
  datasets: {
    label: "Income - Expenses",
    data: [2500, 3000, 2800],
    labels: ["2025-01", "2025-02", "2025-03"]
  }
}
```

**Models:**

- `incomeMinusExpensesByYearMonthReport`
- `expensesPlusHouseExpensesByYearMonthReport`
- `quarterlyIncomeExpenseReport`
- `weeklyExpenseAnalysis`

### Analysis Reports (IReportMultiData)

Complex multi-metric analysis per entity.

**Structure:**

```typescript
{
  datasets: [
    {
      label: "AAPL",
      data: [1200, 100, 12],
      labels: ["Total Dividends", "Avg Monthly", "Payment Count"],
      metadata: {
        firstPayment: "2024-01-01",
        lastPayment: "2025-01-01",
        formatTypes: ["money", "money", "generic"]
      }
    }
  ],
  summary: {
    totalSymbols: 5,
    totalDividends: 6000,
    totalPayments: 60
  }
}
```

**Models:**

- `dividendAnalysisReport`

## Value Formatting

Reports use model's `chartLabelType` for formatting:

### Money Format

```typescript
chartLabelType: "money";
// 1234.56 → $1,234.56
// Locale: en-US, Currency: USD
```

### Percent Format

```typescript
chartLabelType: "percent";
// 0.15 → 15.00%
```

### Generic Format

```typescript
chartLabelType: "generic";
// 1234.56 → 1,234.56
```

### Per-Metric Formatting

Analysis reports can specify format per metric via metadata:

```typescript
metadata: {
	formatTypes: ["money", "money", "generic"];
}
// Metric 1: money format
// Metric 2: money format
// Metric 3: generic format
```

## Report Models

### Portfolio Snapshot

**Model:** `portfolioReport` / `portfolioReportTable`

Shows latest value per category for current month:

- Portfolio value
- Income total
- Expense total
- Dividend total
- Debt balance

**Configuration:**

```typescript
{
  dataSource: "splitByYearMonth",
  categories: ["Portfolio", "Income", "Cotisation", "Expenses",
               "House Expenses", "Dividend", "Debt"],
  output: "getLastValuePerTypeForCurrentMonth",
  chartLabelType: "money"
}
```

**Custom Date:**

````markdown
```findoc
filename: data.csv
model: portfolioReport
view: table
date: 2024-12-01
```
````

### Income/Expense Analysis

**Model:** `incomeMinusExpensesByYearMonthReport`

Monthly net income calculation:

- Income total per month
- Expense total per month
- Net income (Income - Expenses)

**Table Output:**

| Period  | Value     |
| ------- | --------- |
| 2025-01 | $2,500.00 |
| 2025-02 | $3,000.00 |
| 2025-03 | $2,800.00 |

### Dividend Analysis

**Model:** `dividendAnalysisReport`

Comprehensive dividend metrics per symbol:

**Text View:**

```
AAPL
Total Dividends: $1,200.00
Avg Monthly: $100.00
Payment Count: 12

MSFT
Total Dividends: $800.00
Avg Monthly: $66.67
Payment Count: 12
```

**Table View:**

| Symbol | Metric          | Value     |
| ------ | --------------- | --------- |
| AAPL   | Total Dividends | $1,200.00 |
| AAPL   | Avg Monthly     | $100.00   |
| AAPL   | Payment Count   | 12        |
| MSFT   | Total Dividends | $800.00   |
| MSFT   | Avg Monthly     | $66.67    |
| MSFT   | Payment Count   | 12        |

**Metadata:**

- First payment date
- Last payment date
- Total value
- Summary statistics

## Report Rendering

### ReportRenderer Class

Handles both text and table views:

```typescript
class ReportRenderer extends MarkdownRenderChild {
	private data: IReportData | IReportMultiData;
	private modelInfo: IModel;
	private viewType: "text" | "table";

	async onload() {
		if (this.viewType === "table") {
			this.renderTableView();
		} else {
			this.renderTextView();
		}
	}
}
```

### Text View Rendering

```typescript
private renderTextView() {
  // Title
  this.containerEl.createEl("h3", { text: `Report ${date}` });

  // Metadata
  this.containerEl.createEl("p", { text: dataSource });
  this.containerEl.createEl("p", { text: output });

  // Separator
  this.containerEl.createEl("hr");

  // Data entries
  datasets.forEach(entry => {
    this.containerEl.createEl("span", {
      text: `${entry.label}: ${formatValue(entry.data)}`
    });
  });
}
```

### Table View Rendering

```typescript
private renderTableView() {
  const table = this.containerEl.createEl("table");
  table.addClass("findoc-report-table");

  // Header row
  const headerRow = table.createEl("tr");
  headerRow.createEl("th", { text: "Category" });
  headerRow.createEl("th", { text: "Value" });
  headerRow.createEl("th", { text: "Date" });

  // Data rows
  datasets.forEach(entry => {
    const row = table.createEl("tr");
    row.createEl("td", { text: entry.label });
    row.createEl("td", { text: formatValue(entry.data) });
    row.createEl("td", { text: entry.date });
  });
}
```

## Report Generation Functions

### getLastValuePerTypeForCurrentMonth

Extracts latest values for current/specified month:

```typescript
exec: ({ categoriesToSelect, input, date }) => {
	const d = date ? new Date(date) : new Date();
	const monthKey = `${d.getUTCFullYear()}-${getMonth(d)}`;
	const monthData = input[monthKey] || [];

	// Keep last value per subcategory (for Portfolio)
	// Sum all values for other categories
	return {
		datasets: categoriesToSelect.map((category) => ({
			label: category,
			data: sumForCategory(monthData, category),
			date: monthKey,
		})),
	};
};
```

### reportDifference / reportSum

Generate period-by-period calculations:

```typescript
exec: ({ categoriesToSelect, input, values }) => {
	// Calculate per period
	const data = labels.map((label) => {
		const value1 = sumForCategory(input[label], values[0]);
		const value2 = sumForCategory(input[label], values[1]);
		return value1 - value2; // or value1 + value2 for reportSum
	});

	return {
		datasets: {
			label: `${values[0]} - ${values[1]}`,
			data,
			labels: Object.keys(input),
		},
	};
};
```

### reportDividendAnalysis

Complex multi-metric analysis:

```typescript
exec: ({ categoriesToSelect, input }) => {
	// Group by symbol
	const symbolData = groupBySymbol(input);

	// Calculate metrics per symbol
	const results = Object.entries(symbolData).map(([symbol, entries]) => {
		const total = sum(entries);
		const avgMonthly = total / uniqueMonths(entries).length;
		const count = entries.length;
		const firstPayment = min(entries.map((e) => e.timestamp));
		const lastPayment = max(entries.map((e) => e.timestamp));

		return {
			label: symbol,
			data: [total, avgMonthly, count],
			labels: ["Total Dividends", "Avg Monthly", "Payment Count"],
			metadata: {
				firstPayment,
				lastPayment,
				formatTypes: ["money", "money", "generic"],
			},
		};
	});

	return { datasets: results };
};
```

## Styling

### CSS Classes

```css
.findoc-report-table {
	/* Table styling */
	border-collapse: collapse;
	width: 100%;
	margin: 1em 0;
}

.findoc-report-table th {
	/* Header cells */
	background: var(--background-secondary);
	padding: 8px;
	border: 1px solid var(--border-color);
}

.findoc-report-table td {
	/* Data cells */
	padding: 8px;
	border: 1px solid var(--border-color);
}
```
