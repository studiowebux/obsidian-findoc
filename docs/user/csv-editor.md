---
title: CSV Editor
description: Interactive CSV file editor with autocomplete, validation, and batch operations
tags:
    - csv
    - editor
    - ui
    - data-entry
---

# CSV Editor

Interactive CSV editor for managing financial data with autocomplete, validation, and progressive rendering.

## Features

### Category Dropdown

First column uses dropdown with predefined categories from settings. Default categories:

- Portfolio, Income, Mortgage, Mortgage Rate, Cotisation, Dividend
- House Expenses, Expenses, Debt, Borrowable Money, Credit Line, Loan, Generic

### Autocomplete Subcategories

Second column provides autocomplete based on existing subcategories. Matches on partial input (configurable minimum characters).

### Math Evaluation

Value column supports math expressions using `mathjs`:

```
100 + 50    → 150
200 * 1.15  → 230
sqrt(144)   → 12
```

Input is sanitized before evaluation to prevent code injection.

### Row Operations

Each row includes action buttons:

- **Remove**: Delete row
- **Move Up**: Shift row up
- **Move Down**: Shift row down
- **Duplicate**: Copy row

### Batch Operations

#### Sort by Date

Sorts all rows by timestamp in ascending order. Creates backup before sorting.

#### Add New Row

Creates row using last row as template or default values.

#### Restore Backup

Reverts to previous state (maintains last 10 backups).

#### Refresh Autocomplete

Rebuilds autocomplete index from current data.

## Progressive Rendering

For datasets > 50 rows:

- Renders in batches of 100 rows
- Shows loading indicator with progress
- Prevents UI blocking
- Maintains responsiveness

## Performance

### Large Dataset Handling

- Lazy loading for > 500 rows
- Debounced save (default: 1000ms)
- Optimized DOM manipulation
- Efficient autocomplete indexing

### Security

All input is validated and sanitized to keep your data safe.

## Configuration

Customize the CSV editor in Settings → FinDoc:

- **Categories:** Options in the dropdown menu
- **Autocomplete:** Enable/disable and set minimum characters
- **New row template:** Use last row as template for new entries
- **Save delay:** How long to wait before auto-saving
- **CSV separator:** Column delimiter (comma or semicolon)

## Keyboard & Mobile

- ContentEditable cells for direct editing
- Touch-friendly action buttons
- Bottom margin prevents keyboard overlap on mobile
- Responsive table layout

## Data Validation

### Timestamp Validation

Invalid dates are handled gracefully:

- Entries with invalid dates are sorted to the end
- Use format: YYYY-MM-DD (e.g., 2025-01-15)
- Info section shows earliest and latest dates in your data

### Value Validation

- Non-numeric values default to 0
- Math expression errors preserved as-is
- Automatic number parsing

## Backup System

The CSV editor automatically maintains the last 10 backups of your file state. Backups are created before destructive operations.

**Automatic backups created before:**
- Sort by date operations
- Bulk modifications
- Data transformations

**Manual restore:**

Click "Restore Backup" button to undo recent changes. The system maintains a rolling history of your last 10 file states. Each restore removes one backup from the history.

**Use cases:**
- Accidentally sorted data incorrectly
- Made unwanted bulk changes
- Need to revert to a previous state

Backups are session-based and cleared when you close the file.

## CSV Format Compatibility

Supports quoted fields for values containing separators:

```csv
Category,Subcategory,Value,TimeStamp,Extra
Income,"Salary, Bonus",5000,2025-01-01,Q1
```

Parser handles:

- Escaped quotes (`""`)
- Fields with separators
- Multi-line fields (within quotes)
- Custom separators (configurable)

## File Operations

### Create CSV File

- Ribbon icon: Creates in vault root
- File menu: Creates in selected folder
- Default header automatically added

### File Association

`.csv` files open in CSV editor view automatically.

## Information Display

Bottom section shows:

- Total row count
- Minimum date in dataset
- Maximum date in dataset
- Updated after each save
