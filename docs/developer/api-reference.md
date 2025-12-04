---
title: API Reference
description: TypeScript interfaces, types, and function signatures
tags:
    - api
    - typescript
    - interfaces
    - types
---

# API Reference

TypeScript interfaces and types for FinDoc plugin.

## Core Types

### IInput

Parsed CSV row data structure.

```typescript
type IInput = {
	category: string; // Entry category
	subcategory: string; // Entry subcategory
	value: number; // Numeric value
	timestamp: Date; // Entry date
	extra: string; // Additional metadata
};
```

### IDataSourceKeys

Valid field names for split operations.

```typescript
type IDataSourceKeys =
	| "timestamp"
	| "category"
	| "subcategory"
	| "value"
	| "extra";
```

### IChartLabelTypes

Chart label formatting options.

```typescript
type IChartLabelTypes =
	| "money" // Currency format
	| "percent" // Percentage format
	| "generic" // Number format
	| "custom"; // Custom suffix
```

## Model Configuration

### IModel

Model definition structure.

```typescript
type IModel = {
	dataSource: string; // Split function name
	dataSourceKey: IDataSourceKeys; // Field to split on
	categories: string[]; // Categories to include
	output: string; // Generator function name
	beginAtZero: boolean; // Y-axis starts at zero
	chartLabelType: IChartLabelTypes; // Label format type
	suffix?: string; // Custom label suffix
	date?: string; // Optional date filter
	values: string; // Comma-separated parameters
};
```

### IPluginSettings

Complete plugin settings structure.

```typescript
type IPluginSettings = {
	models: {
		[key: string]: IModel; // Model name → configuration
	};
	colors: string[]; // Hex color codes
	debounce: string; // Save delay (ms)
	csvSeparator: string; // CSV delimiter
	useLastElementAsTemplate: boolean;
	useAutocomplete: boolean;
	minCharsToMatch: number;
	categories: string[];
	chartLabelTypes: string[];
	version?: string; // Settings version
};
```

## Chart Data Structures

### IDataset

Line chart dataset structure.

```typescript
type IDataset = {
	labels: string[]; // X-axis labels
	datasets: {
		label: string; // Dataset name
		borderColor: string; // Line color
		fill: boolean; // Area fill
		tension: number; // Curve smoothing
		data: number[]; // Y-axis values
		segment: {
			borderColor?: (ctx: IContext) => string | number[] | undefined;
			borderDash: (ctx: IContext) => string | number[] | undefined;
		};
	}[];
};
```

### IPieDataset

Pie chart dataset structure.

```typescript
type IPieDataset = {
	labels: string[]; // Slice labels
	datasets: {
		label: string; // Dataset name
		data: number[]; // Slice values
	}[];
};
```

### IRadarDataset

Radar chart dataset structure.

```typescript
type IRadarDataset = {
	labels: string[]; // Axis labels
	datasets: {
		label: string; // Dataset name
		data: number[]; // Axis values
		fill: boolean; // Area fill
	}[];
};
```

### IContext

Chart.js segment context.

```typescript
type IContext = {
	p0: { skip: boolean }; // Previous point
	p1: { skip: boolean }; // Current point
};
```

## Chart Configuration Types

### IChartLine

Line chart configuration.

```typescript
type IChartLine = {
	type: "line";
	data: IDataset;
	options: {
		responsive: boolean;
		maintainAspectRatio: boolean;
		interaction: {
			intersect: boolean;
		};
		scales: {
			y: {
				beginAtZero: boolean;
			};
		};
		plugins: {
			tooltip: {
				callbacks: {
					label: (context: ITooltip) => string;
				};
			};
		};
	};
};
```

### IChartPie

Pie chart configuration.

```typescript
type IChartPie = {
	type: "pie";
	data: IPieDataset;
	options: {
		responsive: boolean;
		maintainAspectRatio: boolean;
	};
};
```

### IChartRadar

Radar chart configuration.

```typescript
type IChartRadar = {
	type: "radar";
	data: IRadarDataset;
	options: {
		responsive: boolean;
		maintainAspectRatio: boolean;
	};
};
```

### ITooltip

Chart.js tooltip context.

```typescript
type ITooltip = {
	dataset: {
		label: string;
		data: number[];
	};
	parsed: {
		y: number;
	};
	dataIndex: number;
};
```

## Report Data Structures

### IReportData

Simple report data structure.

```typescript
type IReportData = {
	datasets: IReportEntry[];
};
```

### IReportEntry

Single report entry.

```typescript
type IReportEntry = {
	label: string; // Category name
	data: number; // Value
	date: string; // Period
};
```

### IReportMultiData

Multi-period or multi-metric report data.

```typescript
type IReportMultiData = {
	datasets: IReportEntries | IReportEntries[];
	summary?: any; // Optional summary statistics
};
```

### IReportEntries

Report entries with multiple values.

```typescript
type IReportEntries = {
	label: string; // Entry label
	data: number[]; // Values
	labels: string[]; // Value labels
	metadata?: any; // Optional metadata
};
```

## Function Type Signatures

### splitFunc

Split function signature.

```typescript
type splitFunc = (
	input: Array<IInput | any>,
	key: IDataSourceKeys,
) => { [key: string]: IInput[] };
```

**Parameters:**

- `input`: Array of parsed CSV entries
- `key`: Field to group by

**Returns:** Dictionary of grouped entries

**Example:**

```typescript
const splitByMonth: splitFunc = (input, key) => {
	return input.reduce((acc, current) => {
		const monthKey = extractMonth(current[key]);
		if (!acc[monthKey]) acc[monthKey] = [];
		acc[monthKey].push(current);
		return acc;
	}, {});
};
```

### generatorFunc

Generator function signature.

```typescript
type generatorFunc = (params: {
	categoriesToSelect: string[];
	input: { [key: string]: IInput[] };
	labels: string[];
	categories: string[];
	colors: string[];
	values: string[];
}) => IDataset | IReportData | IReportMultiData;
```

**Parameters:**

- `categoriesToSelect`: Categories to include
- `input`: Grouped data from split function
- `labels`: Period labels
- `categories`: Unique categories in data
- `colors`: Color palette
- `values`: Additional parameters

**Returns:** Chart dataset or report data

**Example:**

```typescript
const generateSum: generatorFunc = ({
	categoriesToSelect,
	input,
	labels,
	colors,
}) => {
	return {
		labels,
		datasets: categoriesToSelect.map((category, idx) => ({
			label: category,
			borderColor: colors[idx],
			data: labels.map((label) => sumCategory(input[label], category)),
		})),
	};
};
```

## Class Definitions

### FinDocPlugin

Main plugin class.

```typescript
class FinDocPlugin extends Plugin {
	settings: IPluginSettings;

	async createCSVFile(parent?: string): Promise<void>;
	async loadSettings(): Promise<void>;
	async migrateSettings(): Promise<void>;
	async saveSettings(): Promise<void>;
	compareVersions(a: string, b: string): number;
	showInlineError(el: HTMLElement, content: any, errorMessage: string): void;
}
```

### CSVView

CSV editor view.

```typescript
class CSVView extends TextFileView {
	plugin: FinDocPlugin;
	tableData: string[];
	tableHeader: string;
	autocompleteData: { category: string; subcategory: string }[];
	backupHistory: string[];

	getViewData(): string;
	setViewData(data: string, clear: boolean): void;
	saveData(): void;
	createBackup(): void;
	restoreBackup(): boolean;
	sortByDate(data: string[]): string[];
	addLine(lineData: string[]): void;
	createTable(data: string[]): void;
}
```

### ChartRenderer

Chart rendering component.

```typescript
class ChartRenderer extends MarkdownRenderChild {
	private data: IChartLine | IChartPie | IChartRadar;
	private modelInfo: IModel;
	private model: string;
	private title: string;
	private filenames: string[];

	constructor(
		modelInfo: IModel,
		data: IChartLine | IChartPie | IChartRadar,
		model: string,
		title: string,
		filenames: string[],
		el: HTMLElement,
	);

	async onload(): Promise<void>;
}
```

### ReportRenderer

Report rendering component.

```typescript
class ReportRenderer extends MarkdownRenderChild {
	private data: IReportData | IReportMultiData;
	private modelInfo: IModel;
	private viewType: "text" | "table";

	constructor(
		modelInfo: IModel,
		data: IReportData | IReportMultiData,
		el: HTMLElement,
		viewType?: "text" | "table",
	);

	async onload(): Promise<void>;
	private renderTableView(): void;
	private renderTextView(): void;
	private formatValue(value: number, chartLabelType: string): string;
}
```

## Utility Functions

### CSV Parsing

```typescript
function parseCSVLine(line: string, separator?: string): string[];
function getData(csv: string, separator?: string): Array<IInput>;
```

### Data Loading

```typescript
async function loadCSVData(vault: Vault, filenames: string[]): Promise<string>;
```

### Processing

```typescript
function processing(
	csvRawData: string,
	modelToGenerate: string,
	models: { [key: string]: IModel },
	colors: string[],
	chartType?: "line" | "pie" | "radar",
	separator?: string,
): IChartLine | IChartPie | IChartRadar;
```

### Reporting

```typescript
function reporting(
	csvRawData: string,
	modelToGenerate: string,
	date: string | undefined,
	models: { [key: string]: IModel },
	separator?: string,
): IReportData;
```

### Date Utilities

```typescript
function getToday(): string;
function getMonth(date: Date): string;
function getDate(date: Date): string;
function skipped(ctx: IContext, value: any): any;
```

### Security

```typescript
function sanitizeTextInput(input: string): string;
function safeEvaluate(expression: string): number;
function safeCreateIcon(element: HTMLElement, iconSvg: string): void;
function generateSecureId(): string;
```

## Constants

### DEFAULT_SETTINGS

```typescript
const DEFAULT_SETTINGS: IPluginSettings = {
	chartLabelTypes: ["money", "percent", "generic", "custom"],
	minCharsToMatch: 1,
	useAutocomplete: true,
	categories: [
		/* default categories */
	],
	useLastElementAsTemplate: true,
	models: {
		/* default models */
	},
	colors: [
		/* 100 hex colors */
	],
	debounce: "1000",
	csvSeparator: ",",
	version: "0.8.3",
};
```

### HEADER

```typescript
const HEADER = "Category,Subcategory,Value,TimeStamp,Extra";
```

### COLORS

```typescript
const COLORS: string[] = [
	/* 100 hex color codes */
];
```

## Event Types

### IEvent

Generic event structure.

```typescript
type IEvent = {
	target: {
		innerHTML: string;
	};
};
```

## Error Handling

Errors thrown with descriptive messages:

```typescript
throw new Error(
	`The specified model: "${modelName}" does not exist or ` +
		`the split function "${dataSource}" does not exist. ` +
		`Model names are available in the Documentation.`,
);
```

## Type Guards

### Check Report Data Type

```typescript
function isReportEntry(obj: any): obj is IReportEntry {
	return "date" in obj && typeof obj.data === "number";
}

function isReportEntries(obj: any): obj is IReportEntries {
	return "labels" in obj && Array.isArray(obj.data);
}
```

### Check Chart Data Type

```typescript
function isChartData(obj: any): obj is IDataset {
	return "labels" in obj && "datasets" in obj && Array.isArray(obj.datasets);
}
```

## Extension Points

### Adding Custom Split Function

```typescript
export const splitBy: {
	[key: string]: { help: string; exec: splitFunc };
} = {
	customSplit: {
		help: "Custom split description",
		exec: (input, key) => {
			/* implementation */
		},
	},
};
```

### Adding Custom Generator

```typescript
export const functions: {
	[key: string]: { help: string; exec: generatorFunc };
} = {
	customGenerator: {
		help: "Custom generator description",
		exec: (params) => {
			/* implementation */
		},
	},
};
```
