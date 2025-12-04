---
title: Chart Rendering
description: Chart types, configuration, and visualization options
tags:
    - charts
    - visualization
    - chartjs
---

# Chart Rendering

Chart rendering using `Chart.js` with line, pie, and radar chart support.

## Chart Types

### Line Chart

Default chart type for time series data.

**Usage:**

````markdown
```findoc
filename: data.csv
model: expenses
view: chart
title: Monthly Expenses
```
````

**Features:**

- Time series visualization
- Multiple datasets (categories)
- Spannable gaps (NaN handling)
- Dashed lines for missing data
- Configurable Y-axis (beginAtZero)

**Configuration:**

```typescript
{
  type: "line",
  data: {
    labels: string[],      // X-axis labels
    datasets: [{
      label: string,       // Dataset name
      borderColor: string, // Line color
      fill: false,         // No area fill
      tension: 0.2,        // Curve smoothing
      spanGaps: true,      // Connect across gaps
      segment: {
        borderColor: ctx => skipped(ctx, color),  // Gap styling
        borderDash: ctx => skipped(ctx, [3, 3])   // Dashed gaps
      },
      data: number[]       // Y-axis values
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: boolean }
    }
  }
}
```

### Pie Chart

Distribution visualization.

**Usage:**

````markdown
```findoc
filename: data.csv
model: allCategoriesBreakdown
view: pie
```
````

**Features:**

- Category distribution
- Percentage calculation
- Color-coded segments
- Interactive tooltips

**Use Cases:**

- Expense breakdown by category
- Portfolio allocation
- Income sources

**Conversion:**
Line chart data automatically converted to pie format:

- Last value from each dataset
- Labels from dataset names
- Preserves colors

### Radar Chart

Multi-dimensional comparison.

**Usage:**

````markdown
```findoc
filename: data.csv
model: dividendQuarterlyBySymbol
view: radar
```
````

**Features:**

- Multiple metrics comparison
- Overlapping datasets
- Circular layout
- Fill areas

**Use Cases:**

- Quarterly performance comparison
- Multi-category analysis
- Symbol comparison

**Conversion:**
Similar to pie chart conversion with fill areas enabled.

## Chart Configuration

### Responsive Sizing

Charts resize automatically within container.

**Container:**

```css
.chart-container {
	position: relative;
	height: 400px; /* Default */
	width: 100%;
}
```

**Radar-specific:**

```css
.chart-container[data-chart-type="radar"] {
	height: 500px;
	max-width: 600px;
	margin: 0 auto;
}
```

### Label Formatting

Configured via `chartLabelType` in model:

#### Money Format

```typescript
chartLabelType: "money";
// Output: $1,234.56
// Locale: en-US
// Currency: USD
```

#### Percent Format

```typescript
chartLabelType: "percent";
// Input: 0.15
// Output: 15.00%
```

#### Generic Format

```typescript
chartLabelType: "generic";
// Output: 1,234.56 (locale formatting)
```

#### Custom Format

```typescript
chartLabelType: "custom";
suffix: " units";
// Output: 1234.56 units
```

### Tooltip Configuration

Tooltips show formatted values on hover:

```typescript
plugins: {
	tooltip: {
		callbacks: {
			label: (context) => {
				const value = context.parsed.y;
				return formatValue(value, chartLabelType, suffix);
			};
		}
	}
}
```

## Chart Features

### Gap Handling

Missing data (NaN) rendered as gaps with dashed segments:

```typescript
segment: {
  borderColor: (ctx) => {
    // If either point is skipped, use gray
    return ctx.p0.skip || ctx.p1.skip ? "#999" : color;
  },
  borderDash: (ctx) => {
    // Dashed line for gaps
    return ctx.p0.skip || ctx.p1.skip ? [3, 3] : [];
  }
}
```

### Color Assignment

Colors assigned from settings color array (100 colors):

- Sequential assignment per dataset
- Consistent colors across charts
- Customizable via settings

### Chart Information Footer

Collapsible footer with metadata:

- Data source function
- Model name
- Output function
- Source file(s)

**Toggle:**

```typescript
btn.onclick = () => {
	containers.forEach((target) => {
		target.classList.toggle("show");
	});
};
```

## Chart Embedding

### Basic Syntax

````markdown
```findoc
filename: data.csv
model: modelName
view: chart|pie|radar
title: Optional Title
```
````

### Multiple Files

Combine data from multiple CSV files:

````markdown
```findoc
filename: file1.csv, file2.csv, file3.csv
model: expenses
view: chart
```
````

Files merged before processing:

- Headers removed from subsequent files
- Data concatenated
- Sorted by timestamp

### Model-View Compatibility

Not all models work with all views:

| Model Output      | Line | Pie | Radar |
| ----------------- | ---- | --- | ----- |
| Chart generators  | ✓    | ✓   | ✓     |
| Report generators | ✗    | ✗   | ✗     |

Invalid combinations show inline error with suggestions.

## Performance

### Large Datasets

Charts optimized for large datasets:

- Canvas rendering (hardware accelerated)
- Efficient data structures
- No DOM manipulation per data point

### Rendering Process

1. Parse YAML configuration
2. Load CSV file(s)
3. Process data via model pipeline
4. Convert to Chart.js format
5. Render canvas
6. Add interactive features

Total time for 1000 data points: ~50-100ms

## Styling

### CSS Classes

```css
.chart-container {
	/* Container styling */
}

.findoc-btn {
	/* Toggle button styling */
}

.collapse {
	/* Footer hidden state */
}

.collapse.show {
	/* Footer visible state */
}
```

### Theme Integration

Charts use Obsidian theme colors:

- `--background-primary`: Chart background
- `--text-normal`: Labels and text
- `--border-color`: Container borders
- Dataset colors from plugin settings

## Error Handling

### Invalid Configuration

Errors display inline in note:

```
⚠️ Invalid Snippet Configuration
Model: invalidModel
View: chart
File: data.csv

💡 Tips:
• Check Settings → Findoc → Models
• File not found? Verify path
• Wrong model name? Check case sensitivity
```

### File Not Found

Graceful handling with helpful error messages.

### Data Validation

- Empty datasets: Show empty chart
- Invalid values: Default to 0
- Malformed dates: Filtered out
