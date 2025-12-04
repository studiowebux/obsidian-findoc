---
title: Developer Documentation
description: Technical reference and customization guides
---

# Developer Documentation

Technical documentation for extending and customizing FinDoc.

## Architecture

- [Architecture Overview](architecture.md) - Plugin structure, components, and design patterns
- [API Reference](api-reference.md) - TypeScript interfaces and types

## Data Processing

- [Models Reference](models.md) - All built-in models and how to create custom ones
- [Data Processing](data-processing.md) - Split functions and generator functions
- [Charts](charts.md) - Chart rendering and Chart.js configuration
- [Reports](reports.md) - Report generation system

## Configuration

- [Advanced Settings](settings-advanced.md) - Detailed configuration options and implementation

## Performance

- [Performance Guide](performance.md) - Optimization techniques and handling large datasets

## Key Concepts

**Model Pipeline:**

1. CSV data loaded
2. Split function organizes data
3. Generator creates datasets
4. Chart/report renders output

**Custom Model Example:**

```typescript
{
  dataSource: "splitByYearMonth",
  categories: ["Income"],
  output: "generateSumDataSet",
  chartLabelType: "money",
  dataSourceKey: "timestamp"
}
```

**Available Split Functions:**

- splitDailyDates
- splitByYearMonth
- splitByQuarter
- splitByWeek
- splitByYear
- splitByCategory
- splitByValueRange

**Available Generators:**

- generateDailyDataSet
- generateSumDataSet
- generateAverageDataSet
- generateCountDataSet
- generateMinMaxDataSet

## Extension Points

Create custom:

- Models (combine split + generator)
- Categories
- Color schemes
- Report formats

[Back to User Documentation](../user/getting-started.md)
