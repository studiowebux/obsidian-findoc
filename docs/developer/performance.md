---
title: Performance
description: Optimization techniques and best practices for large datasets
tags:
    - performance
    - optimization
    - best-practices
---

# Performance

Optimization strategies and best practices for handling large financial datasets.

## Data Size Considerations

### Small Datasets (< 100 rows)

- Immediate rendering
- No special optimizations needed
- Full table rendering
- Real-time updates

### Medium Datasets (100-500 rows)

- Debounced saves (1000ms default)
- Loading indicators during operations
- Optimized DOM updates
- Progressive rendering optional

### Large Datasets (> 500 rows)

- Progressive rendering (100 rows/batch)
- Loading overlays with progress
- Lazy loading enabled
- Batch operations with backups
- Extended debounce (1500-2000ms recommended)

## CSV Editor Performance

### Progressive Rendering

Activated automatically for datasets > 50 rows.

**Implementation:**

```typescript
async renderRowsProgressively(rows: string[]) {
  const batchSize = 100;
  const totalBatches = Math.ceil(rows.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batch = rows.slice(i * batchSize, (i + 1) * batchSize);
    batch.forEach(row => this.createSingleTableRow(row));

    // Yield to UI thread
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Update progress
    this.showLoading(`Loading rows ${(i + 1) * batchSize}/${rows.length}`);
  }
}
```

**Benefits:**

- Prevents UI blocking
- Maintains responsiveness
- Shows progress feedback
- Cancellable operations

### Debounced Saves

Prevents excessive file writes during editing.

**Configuration:**

```typescript
this.table.oninput = debounce(
	() => {
		this.saveData();
	},
	parseInt(this.plugin.settings.debounce) || 1000,
);
```

**Recommendations:**

- 500ms: Small datasets, frequent saves needed
- 1000ms: Default, balanced
- 2000ms: Large datasets, reduce I/O

### Autocomplete Indexing

Efficient subcategory lookup.

**Implementation:**

```typescript
this.autocompleteData = [
	...new Map(
		this.tableData.map((row) => {
			const [category, subcategory] = row.split(separator);
			return [subcategory, { category, subcategory }];
		}),
	).values(),
];
```

**Performance:**

- O(n) complexity for indexing
- O(1) lookup via Map
- Deduplication included
- Refresh on demand only

### Sort Operations

Optimized date sorting with backup.

**Implementation:**

```typescript
sortByDate(data: string[]): string[] {
  return data.sort((a, b) => {
    const leftTime = new Date(a.split(separator)[3]).getTime();
    const rightTime = new Date(b.split(separator)[3]).getTime();

    if (isNaN(leftTime) && isNaN(rightTime)) return 0;
    if (isNaN(leftTime)) return 1;
    if (isNaN(rightTime)) return -1;

    return leftTime - rightTime;
  });
}
```

**Optimization:**

- Native Array.sort (O(n log n))
- NaN handling prevents errors
- In-place sorting
- Backup before operation

### Backup System

Minimal overhead with circular buffer.

**Implementation:**

```typescript
createBackup() {
  this.backupHistory.push(this.tableData.join("\n"));

  // Keep only last 10 backups
  if (this.backupHistory.length > this.maxBackups) {
    this.backupHistory.shift();
  }
}
```

**Memory Usage:**

- 10 backups × average file size
- Example: 1000 rows × 100 bytes = 100KB × 10 = 1MB

## Data Processing Performance

### CSV Parsing

Optimized single-pass parsing.

**Implementation:**

```typescript
function getData(csv: string, separator: string): Array<IInput> {
	const lines = csv.split("\n");
	const result: IInput[] = [];

	// Single pass through data
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		const parts = line.includes('"')
			? parseCSVLine(line, separator)
			: line.split(separator);

		result.push({
			category: parts[0],
			subcategory: parts[1],
			value: parseFloat(parts[2]) || 0,
			timestamp: new Date(parts[3]),
			extra: parts[4],
		});
	}

	return result.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}
```

**Complexity:**

- Parsing: O(n) where n = row count
- Sorting: O(n log n)
- Total: O(n log n)

**Optimizations:**

- Skip empty lines early
- Conditional quoted field parsing
- Default values for invalid data
- Single allocation for result array

### Split Functions

Efficient grouping via reduce.

**Example:**

```typescript
splitByYearMonth: {
	exec: (input: Array<IInput>, key: IDataSourceKeys) => {
		return input.reduce((acc, current) => {
			const d = new Date(current[key]);
			const timestamp = `${d.getUTCFullYear()}-${getMonth(d)}`;
			if (!acc[timestamp]) acc[timestamp] = [];
			acc[timestamp].push(current);
			return acc;
		}, {});
	};
}
```

**Complexity:** O(n)

**Memory:** O(n) for grouped object

### Generator Functions

Optimized dataset creation.

**Example:**

```typescript
generateSumDataSet: {
	exec: ({ input, labels, categories, colors }) => {
		const datasets = categories.map((category, idx) => ({
			label: category,
			borderColor: colors[idx],
			data: labels.map((label) =>
				input[label]
					.filter((i) => i.subcategory === category)
					.reduce((sum, i) => sum + i.value, 0),
			),
		}));

		return { labels, datasets };
	};
}
```

**Complexity:** O(n × m) where n = periods, m = categories

**Optimization:**

- Single pass per period
- Filter + reduce combined
- Pre-allocated arrays

## Chart Rendering Performance

### Canvas Rendering

Hardware-accelerated rendering via Chart.js.

**Benefits:**

- GPU acceleration
- Efficient re-rendering
- Handles 1000+ data points
- Smooth animations

**Timing:**

- 100 points: ~10ms
- 1000 points: ~50ms
- 10000 points: ~200ms

### Data Conversion

Minimal overhead for pie/radar conversion.

**Implementation:**

```typescript
function convert_to_pie_chart(data: IDataset): IPieDataset {
	return {
		labels: data.datasets.map((d) => d.label),
		datasets: [
			{
				label: "Distribution",
				data: data.datasets.map((d) => d.data[d.data.length - 1]),
			},
		],
	};
}
```

**Complexity:** O(n) where n = dataset count

### Chart Updates

Efficient re-rendering on data changes.

**Strategy:**

- Destroy old chart instance
- Create new instance with updated data
- Canvas reused (no DOM manipulation)

## Report Generation Performance

### Simple Reports

Minimal processing overhead.

**Complexity:**

- Filter current month: O(n)
- Aggregate per category: O(n × m)
- Total: O(n × m) where n = rows, m = categories

**Timing:**

- 1000 rows, 10 categories: ~5ms

### Analysis Reports

More complex calculations.

**Example (Dividend Analysis):**

```typescript
reportDividendAnalysis: {
	exec: ({ input }) => {
		// Group by symbol: O(n)
		const symbolData = groupBySymbol(input);

		// Calculate metrics per symbol: O(m)
		return Object.entries(symbolData).map(([symbol, entries]) => ({
			label: symbol,
			data: [
				sum(entries), // O(k)
				average(entries), // O(k)
				entries.length, // O(1)
			],
		}));
	};
}
```

**Complexity:** O(n + m × k) where:

- n = total rows
- m = unique symbols
- k = entries per symbol

**Timing:**

- 1000 rows, 20 symbols: ~10ms

## Memory Management

### Memory Usage Estimates

**CSV Editor:**

- Table data: ~100 bytes/row
- DOM elements: ~500 bytes/row
- Autocomplete index: ~50 bytes/entry
- Backups: ~100 bytes/row × 10

**Example (1000 rows):**

- Data: 100KB
- DOM: 500KB
- Autocomplete: 50KB
- Backups: 1MB
- **Total: ~1.65MB**

### Memory Optimization

**Strategies:**

1. Clear unused backups
2. Lazy load autocomplete
3. Paginate large tables (future)
4. Destroy charts when note closed

### Garbage Collection

**Cleanup:**

```typescript
onunload() {
  // Clear references
  this.tableData = [];
  this.autocompleteData = [];
  this.backupHistory = [];

  // Remove event listeners
  this.table.oninput = null;

  // Clear DOM
  this.contentEl.empty();
}
```

## File I/O Performance

### Multiple File Loading

Sequential loading with single concatenation.

**Implementation:**

```typescript
async function loadCSVData(vault: Vault, filenames: string[]) {
	const data: string[] = [];

	for (const filename of filenames) {
		const content = await vault.adapter.read(filename);
		const lines = content.split(/\r?\n/);

		// Skip header, filter empty lines
		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line) data.push(line);
		}
	}

	return data.join("\n");
}
```

**Complexity:** O(n) where n = total rows across files

**Timing:**

- 5 files, 1000 rows each: ~50ms

### Save Operations

Atomic writes via Obsidian Vault API.

**Process:**

1. Build data string
2. Call `requestSave()`
3. Obsidian handles atomic write
4. Debounced to prevent excessive I/O

## Troubleshooting Performance Issues

### Slow CSV Editing

**Causes:**

- Large dataset (> 1000 rows)
- Low debounce value
- Autocomplete indexing frequently

**Solutions:**

- Increase debounce to 2000ms
- Disable autocomplete temporarily
- Split into multiple files

### Slow Chart Rendering

**Causes:**

- Too many datasets (> 20)
- Too many data points (> 5000)
- Complex calculations in generator

**Solutions:**

- Filter categories
- Increase time granularity (daily → monthly)
- Use simpler generator
- Optimize custom functions

### High Memory Usage

**Causes:**

- Multiple large CSV files open
- Many charts in single note
- Backup history accumulation

**Solutions:**

- Close unused files
- Split notes into smaller sections
- Clear backups periodically
- Restart Obsidian

### Slow Save Operations

**Causes:**

- Large file size
- File sync conflicts
- Frequent autosaves

**Solutions:**

- Increase debounce delay
- Disable sync temporarily
- Use local vault
- Optimize file size (remove unused data)
