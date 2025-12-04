---
title: Architecture
description: Plugin architecture, design patterns, and code organization
tags:
    - architecture
    - design
    - code-structure
---

# Architecture

Comprehensive overview of FinDoc plugin architecture and design patterns.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Obsidian.md                            │
│                    ┌──────────────┐                         │
│                    │  Markdown    │                         │
│                    │  Processor   │                         │
│                    └──────┬───────┘                         │
│                           │                                 │
│              ┌────────────┼────────────┐                    │
│              ▼            ▼            ▼                    │
│         CSV View    Chart Block   Report Block              │
│              │            │            │                    │
│    ┌─────────┴────────────┴────────────┴───────────┐        │
│    │           FinDoc Plugin Core                  │        │
│    │  ┌──────────────────────────────────────┐     │        │
│    │  │  Processing Pipeline                 │     │        │
│    │  │  ┌────────┐  ┌────────┐  ┌────────┐  │     │        │
│    │  │  │ CSV    │→ │ Split  │→ │Generate│  │     │        │
│    │  │  │ Parser │  │ Func   │  │ Func   │  │     │        │
│    │  │  └────────┘  └────────┘  └────────┘  │     │        │
│    │  └──────────────────────────────────────┘     │        │
│    │  ┌──────────────────────────────────────┐     │        │
│    │  │  Rendering Layer                     │     │        │
│    │  │  ┌─────────────┐  ┌────────────────┐ │     │        │
│    │  │  │ChartRenderer│  │ReportRenderer  │ │     │        │
│    │  │  │(Chart.js)   │  │(HTML Tables)   │ │     │        │
│    │  │  └─────────────┘  └────────────────┘ │     │        │
│    │  └──────────────────────────────────────┘     │        │
│    └───────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### FinDocPlugin (main.ts)

Main plugin class extending Obsidian Plugin.

**Responsibilities:**

- Plugin lifecycle management
- Settings persistence
- View registration
- Code block processing
- File operations
- Migration logic

**Key Methods:**

```typescript
async onload()                    // Initialize plugin
async loadSettings()              // Load from data.json
async saveSettings()              // Persist to data.json
async migrateSettings()           // Version migration
async createCSVFile(parent)       // Create new CSV
showInlineError(el, content, msg) // Error display
```

### CSVView (view.ts)

Custom file view for CSV editing.

**Extends:** `TextFileView`

**Responsibilities:**

- CSV file rendering
- Interactive editing
- Data validation
- Backup management
- Progressive rendering

**Architecture:**

```typescript
CSVView
├── Data Layer
│   ├── tableData: string[]           // Rows
│   ├── tableHeader: string           // Header row
│   └── autocompleteData: object[]    // Index
├── UI Layer
│   ├── table: HTMLElement            // Main table
│   ├── parent: HTMLElement           // Container
│   └── div: HTMLElement              // Table wrapper
├── Operations
│   ├── addLine()                     // Add row
│   ├── sortByDate()                  // Sort rows
│   ├── saveData()                    // Persist
│   └── createBackup()                // Backup
└── Rendering
    ├── renderAllRowsSync()           // Small datasets
    └── renderRowsProgressively()     // Large datasets
```

### ChartRenderer (ChartRenderer.ts)

Chart.js integration for data visualization.

**Extends:** `MarkdownRenderChild`

**Responsibilities:**

- Chart instantiation
- Canvas management
- Chart configuration
- Footer rendering

**Chart Types:**

- Line charts (IChartLine)
- Pie charts (IChartPie)
- Radar charts (IChartRadar)

**Lifecycle:**

```typescript
constructor()     // Initialize with data
  ↓
async onload()    // Render chart
  ├── Create canvas
  ├── Initialize Chart.js
  ├── Render title
  ├── Append chart
  └── Add footer
```

### ReportRenderer (ReportRenderer.ts)

Report generation for text and table views.

**Extends:** `MarkdownRenderChild`

**Responsibilities:**

- Report rendering (text/table)
- Value formatting
- Metadata display

**Rendering Modes:**

```typescript
renderTextView()
├── Create title
├── Add metadata
├── Add separator
└── Render entries
    └── Format values per chartLabelType

renderTableView()
├── Create table element
├── Add header row
└── Add data rows
    └── Format values per chartLabelType
```

### SettingsTab (SettingsTab.ts)

Plugin configuration UI.

**Extends:** `PluginSettingTab`

**Sections:**

- General settings (separator, debounce)
- Categories management
- Colors configuration
- Models editor

**Dynamic UI:**

- Add/edit/delete categories
- Add/edit/delete colors
- Add/edit/duplicate/delete models
- Reload default configuration

## Data Flow

### CSV to Chart Pipeline

```
1. Markdown Code Block
   └── YAML configuration parsed

2. loadCSVData(vault, filenames)
   ├── Read file(s)
   ├── Remove headers
   ├── Concatenate data
   └── Return raw CSV

3. getData(csv, separator)
   ├── Parse CSV lines
   ├── Convert to IInput[]
   ├── Validate data
   └── Sort by timestamp

4. processing(data, model, models, colors, chartType)
   ├── Get model config
   ├── Execute split function
   │   └── Group data by key
   ├── Extract labels
   ├── Execute generator function
   │   └── Transform to dataset
   └── Create chart config

5. ChartRenderer
   ├── Receive chart config
   ├── Create canvas
   ├── Initialize Chart.js
   └── Render to DOM
```

### CSV to Report Pipeline

```
1. Markdown Code Block
   └── YAML configuration parsed

2. loadCSVData(vault, filenames)
   └── Return raw CSV

3. getData(csv, separator)
   └── Return IInput[]

4. reporting(data, model, date, models)
   ├── Get model config
   ├── Execute split function
   ├── Execute report generator
   └── Return report data

5. ReportRenderer
   ├── Receive report data
   ├── Choose view type (text/table)
   ├── Render to DOM
   └── Format values
```

### CSV Editor Flow

```
1. File Open (.csv extension)
   └── CSVView registered

2. setViewData(data, clear)
   ├── Parse CSV string
   ├── Build autocomplete index
   ├── Create table structure
   └── Render rows
       ├── renderAllRowsSync() [< 50 rows]
       └── renderRowsProgressively() [≥ 50 rows]

3. User Interaction
   ├── Edit cell → Debounced save
   ├── Add row → Append + save
   ├── Delete row → Remove + save
   ├── Sort → Backup + sort + save
   └── Autocomplete → Index lookup

4. saveData()
   ├── Extract data from DOM
   ├── Build CSV string
   ├── requestSave()
   └── Update info section
```

## Processing Engine

### Split Functions (methods.ts)

Transform array to grouped object.

**Interface:**

```typescript
type splitFunc = (
	input: Array<IInput>,
	key: IDataSourceKeys,
) => { [key: string]: IInput[] };
```

**Available Functions:**

- Time-based: `splitDailyDates`, `splitByYearMonth`, `splitByYear`, `splitByQuarter`, `splitByWeek`
- Dimension-based: `splitBy`, `splitByCategory`, `splitBySubcategory`
- Value-based: `splitByValueRange`

**Implementation Pattern:**

```typescript
splitByX: {
  help: "Description",
  exec: (input, key) => {
    return input.reduce((acc, current) => {
      const groupKey = extractKey(current[key]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(current);
      return acc;
    }, {});
  }
}
```

### Generator Functions (methods.ts)

Transform grouped data to chart/report format.

**Interface:**

```typescript
type generatorFunc = (params: {
	categoriesToSelect: string[];
	input: { [key: string]: IInput[] };
	labels: string[];
	categories: string[];
	colors: string[];
	values: string[];
}) => IDataset | IReportData;
```

**Chart Generators:**

- Dataset creation: `generateDailyDataSet`, `generateSumDataSet`
- Aggregation: `generateSumDataSetPerTypes`
- Cumulative: `generateCumulativeSumDataSet`
- Operations: `generateDifference`, `generateSum`
- Specialized: `generateDividendMonthlyBySymbol`

**Report Generators:**

- Snapshot: `getLastValuePerTypeForCurrentMonth`
- Calculations: `reportDifference`, `reportSum`
- Analysis: `reportDividendAnalysis`

## Data Structures

### Type Hierarchy

```
IInput (Parsed CSV)
  ↓
Split Function
  ↓
Grouped Data: { [key: string]: IInput[] }
  ↓
Generator Function
  ↓
┌─────────────────────┬──────────────────┐
│                     │                  │
▼                     ▼                  ▼
IDataset          IReportData     IReportMultiData
│                     │                  │
▼                     ▼                  ▼
Chart Functions   Simple Reports   Complex Reports
```

### Data Transformation

```typescript
// Input: CSV string
"Category,Subcategory,Value,TimeStamp,Extra\n..."

// After getData()
[
  { category: "Income", subcategory: "Salary",
    value: 5000, timestamp: Date(...), extra: "" },
  ...
]

// After split function
{
  "2025-01": [{ category: "Income", ... }],
  "2025-02": [{ category: "Income", ... }]
}

// After generator function (chart)
{
  labels: ["2025-01", "2025-02"],
  datasets: [{
    label: "Salary",
    data: [5000, 5000],
    borderColor: "#1ac18f",
    ...
  }]
}

// After generator function (report)
{
  datasets: [
    { label: "Income", data: 5000, date: "2025-01" }
  ]
}
```

## Security Layer

### Input Sanitization (security.ts)

**Functions:**

- `sanitizeTextInput()`: Remove dangerous characters
- `safeEvaluate()`: Sandboxed math evaluation
- `safeCreateIcon()`: Secure SVG rendering
- `generateSecureId()`: Collision-free identifiers

**Sandboxing:**

```typescript
function safeEvaluate(expression: string): number {
	// Remove dangerous patterns
	const sanitized = sanitizeTextInput(expression);

	try {
		// Use mathjs in limited scope
		const result = math.evaluate(sanitized);
		return typeof result === "number" ? result : 0;
	} catch {
		return parseFloat(sanitized) || 0;
	}
}
```

## Plugin Lifecycle

```
1. Plugin Load
   ├── loadSettings()
   │   ├── Read data.json
   │   ├── Merge with defaults
   │   └── migrateSettings()
   ├── addSettingTab()
   ├── registerView()
   ├── registerExtensions()
   ├── registerMarkdownCodeBlockProcessor()
   └── Add ribbon icon

2. Plugin Active
   ├── CSV files open in CSVView
   ├── Code blocks render charts/reports
   └── Settings changes save immediately

3. Plugin Unload
   ├── Destroy chart instances
   ├── Clear event listeners
   └── Clean up views
```

## Extension Points

### Adding Custom Functionality

**1. Custom Split Function:**

```typescript
// In methods.ts
export const splitBy = {
	...existingSplits,
	customSplit: {
		help: "Description",
		exec: (input, key) => {
			/* logic */
		},
	},
};
```

**2. Custom Generator:**

```typescript
// In methods.ts
export const functions = {
	...existingFunctions,
	customGenerator: {
		help: "Description",
		exec: (params) => {
			/* logic */
		},
	},
};
```

**3. Custom Model:**

```json
// In settings
{
  "models": {
    "customModel": {
      "dataSource": "customSplit",
      "output": "customGenerator",
      ...
    }
  }
}
```

## Dependencies

### External Libraries

**Chart.js v4.4.1**

- Purpose: Chart rendering
- Import: `import Chart from "chart.js/auto"`
- Usage: Canvas-based visualization
- Size: ~200KB (auto-register)

**mathjs v12.4.0**

- Purpose: Math expression evaluation
- Import: `import { evaluate } from "mathjs"`
- Usage: CSV value calculations
- Size: ~500KB

**Obsidian API**

- Purpose: Plugin framework
- Types: @types/obsidian
- Classes: Plugin, TextFileView, MarkdownRenderChild, PluginSettingTab
- Services: Vault, Workspace, Notice

### Build System

**esbuild**

- Fast bundling
- TypeScript compilation
- Production optimization
- Development watch mode

**tsconfig.json**

- Target: ES2018
- Module: ESNext
- Strict type checking
- Declaration files

## File Structure

```
src/
├── main.ts                 // Plugin entry point
├── types.ts                // TypeScript definitions
├── defaults.ts             // Default settings
├── configuration.ts        // Settings management
│
├── view.ts                 // CSV editor view
├── ChartRenderer.ts        // Chart rendering
├── ReportRenderer.ts       // Report rendering
├── SettingsTab.ts          // Settings UI
│
├── processing.ts           // Chart data pipeline
├── reporting.ts            // Report data pipeline
├── methods.ts              // Split & generator functions
│
├── csv.ts                  // CSV parsing
├── data.ts                 // Data loading
├── data_conversion.ts      // Chart format conversion
│
├── chart.ts                // Chart.js configuration
├── utils.ts                // Utility functions
├── security.ts             // Security layer
├── lazy-loading.ts         // Performance optimization
│
└── icons/                  // SVG icons
    ├── up.ts
    ├── down.ts
    ├── remove.ts
    └── duplicate.ts
```

## Design Patterns

### Factory Pattern

Generator functions create different dataset types based on configuration.

### Strategy Pattern

Split functions interchangeable via model configuration.

### Observer Pattern

Debounced save watches table input events.

### Template Pattern

Base classes (TextFileView, MarkdownRenderChild) extended with specific behavior.

### Singleton Pattern

Plugin instance manages global state.

## Performance Considerations

### Optimization Techniques

**Lazy Loading:**

- Progressive rendering for large tables
- Deferred autocomplete indexing
- On-demand backup creation

**Caching:**

- Autocomplete index cached
- Chart instances reused
- Settings cached in memory

**Batching:**

- Batch row rendering (100 rows/frame)
- Debounced saves (1000ms default)
- Grouped file operations

**Memory Management:**

- Circular backup buffer (10 max)
- Chart cleanup on unload
- Event listener removal

### Complexity Analysis

**CSV Parsing:** O(n)
**Split Functions:** O(n)
**Generator Functions:** O(n × m)
**Sorting:** O(n log n)
**Chart Rendering:** O(n) per dataset

Where:

- n = row count
- m = category count
