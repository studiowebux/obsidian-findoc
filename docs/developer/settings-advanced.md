---
title: Settings
description: Plugin configuration options and customization
tags:
    - settings
    - configuration
    - customization
---

# Settings

Plugin configuration through Settings → FinDoc.

## General Settings

### CSV Separator

Delimiter used in CSV files.

**Default:** `,` (comma)

**Options:** `,` `;` `|` `\t`

**Usage:**

- Standard CSV files: `,`
- European CSV: `;`
- Custom formats: `|` or `\t`

Changes apply to all CSV parsing and saving operations.

### Debounce Delay

Delay before auto-saving CSV changes (milliseconds).

**Default:** `1000`

**Range:** 100-5000ms

**Behavior:**

- Prevents excessive saves during rapid editing
- Lower values: More frequent saves, higher CPU usage
- Higher values: Less frequent saves, risk of data loss

### Use Last Element as Template

When adding new rows, copy values from last row.

**Default:** `true`

**Options:**

- `true`: New row uses last row's values (except timestamp)
- `false`: New row uses default values (first category, 0, today, empty)

### Use Autocomplete

Enable autocomplete for subcategory field.

**Default:** `true`

**Benefits:**

- Consistent data entry
- Faster input
- Reduced typos

### Minimum Characters to Match

Characters required before autocomplete activates.

**Default:** `1`

**Range:** 1-5

**Recommendation:** 1-2 for small datasets, 2-3 for large datasets

## Categories

Predefined categories for dropdown selection.

### Default Categories

- Portfolio
- Income
- Mortgage
- Mortgage Rate
- Cotisation
- Dividend
- House Expenses
- Expenses
- Debt
- Borrowable Money
- Credit Line
- Loan
- Generic

### Adding Categories

1. Navigate to Settings → FinDoc → Categories
2. Click "Add New Category"
3. Enter category name
4. Click Save

### Editing Categories

1. Locate category in list
2. Modify text field
3. Click Save

### Deleting Categories

1. Click "X" button next to category
2. Confirm deletion
3. Click Save

**Warning:** Deleting categories doesn't affect existing CSV data, but removes from dropdown.

### Reordering Categories

1. Click up/down arrows
2. Categories reorder in dropdown
3. Click Save

## Colors

Color palette for chart datasets (100 colors).

### Default Palette

Mix of vibrant, pastel, earthy, neon, and metallic colors providing visual distinction across datasets.

### Adding Colors

1. Navigate to Settings → FinDoc → Colors
2. Click "Add New Color"
3. Enter hex color code (e.g., `#FF5733`)
4. Click Save

### Editing Colors

1. Locate color in list
2. Modify hex code
3. Click Save

### Deleting Colors

1. Click "X" button next to color
2. Click Save

**Note:** Minimum 1 color required. Charts cycle through colors if datasets exceed color count.

### Color Preview

Each color shows visual preview swatch in settings.

## Models

Define data processing pipelines.

### Model List

Shows all available models with:

- Model name
- Data source function
- Output function
- Categories
- View compatibility

### Adding Models

1. Click "Add New Model"
2. Configure parameters:
    - **Name:** Unique identifier (camelCase)
    - **Data Source:** Split function
    - **Data Source Key:** Field to split on
    - **Categories:** Included categories
    - **Output:** Generator function
    - **Begin at Zero:** Y-axis configuration
    - **Chart Label Type:** Value formatting
    - **Values:** Parameters for output function
3. Click Save

### Editing Models

1. Expand model in list
2. Modify fields
3. Click Save

**Caution:** Changing models affects existing snippets using that model.

### Deleting Models

1. Click "Delete Model" button
2. Confirm deletion
3. Click Save

**Warning:** Deleted models break snippets referencing them.

### Duplicating Models

1. Click "Duplicate Model" button
2. Model copied with "\_copy" suffix
3. Modify as needed
4. Click Save

Useful for creating variants of existing models.

### Reloading Default Models

Click "Load Default Models" button to restore all defaults.

**Warning:** Overwrites custom models. Backup settings first via Obsidian settings export.

## Model Configuration

### Data Source Options

Available split functions:

| Function             | Description            |
| -------------------- | ---------------------- |
| `splitDailyDates`    | Daily grouping         |
| `splitByYearMonth`   | Monthly grouping       |
| `splitByYear`        | Annual grouping        |
| `splitByQuarter`     | Quarterly grouping     |
| `splitByWeek`        | Weekly grouping (ISO)  |
| `splitBy`            | Generic field grouping |
| `splitByCategory`    | Category grouping      |
| `splitBySubcategory` | Subcategory grouping   |
| `splitByValueRange`  | Value range grouping   |

### Data Source Key Options

Field used for splitting:

- `timestamp` (default for time-based splits)
- `category`
- `subcategory`
- `value`
- `extra`

### Output Options

Available generator functions:

**Chart Generators:**

- `generateDailyDataSet`
- `generateSumDataSet`
- `generateSumDataSetPerTypes`
- `generateCumulativeSumDataSet`
- `generateCumulativeSumDataSetPerTypes`
- `generateDifference`
- `generateCumulativeDifference`
- `generateSum`
- `generateDividendMonthlyBySymbol`
- `generateCumulativeDividendBySymbol`

**Report Generators:**

- `getLastValuePerTypeForCurrentMonth`
- `reportDifference`
- `reportSum`
- `reportDividendAnalysis`

### Chart Label Type Options

- `money`: USD currency format
- `percent`: Percentage format
- `generic`: Number format
- `custom`: Requires `suffix` parameter

### Begin at Zero

Boolean controlling Y-axis:

- `true`: Y-axis starts at 0
- `false`: Y-axis auto-scales to data range

**Recommendations:**

- `true` for: Expenses, Income, Counts
- `false` for: Portfolio value, Rates, Balances

### Values Parameter

Comma-separated list for operations requiring multiple categories:

**Example:**

```
values: "Income, Expenses"
```

Used by:

- `generateDifference`
- `generateSum`
- `reportDifference`
- `reportSum`

## Settings Migration

Plugin automatically migrates settings on version updates.

### Migration Process

1. Detect version change
2. Add new models from latest version
3. Preserve custom models
4. Update version number
5. Save merged settings
6. Notify user of changes

### Manual Migration

If migration fails or custom settings lost:

1. Export Obsidian settings (Settings → About → Advanced)
2. Locate plugin settings: `.obsidian/plugins/findoc/data.json`
3. Backup file
4. Reinstall plugin
5. Restore from backup if needed

## Settings File Structure

```json
{
  "models": {
    "expenses": { /* model config */ },
    "customModel": { /* custom config */ }
  },
  "colors": ["#1ac18f", "#EAE2B7", ...],
  "debounce": "1000",
  "csvSeparator": ",",
  "useLastElementAsTemplate": true,
  "useAutocomplete": true,
  "minCharsToMatch": 1,
  "categories": ["Portfolio", "Income", ...],
  "chartLabelTypes": ["money", "percent", "generic", "custom"],
  "version": "0.8.0"
}
```

## Troubleshooting

### Settings Not Saving

**Check:**

1. Obsidian has file write permissions
2. No file sync conflicts
3. Plugin enabled
4. `.obsidian/plugins/findoc/` directory exists

**Solution:**
Restart Obsidian or manually save `data.json`.

### Models Not Appearing

**Check:**

1. Settings loaded (check console for errors)
2. Model name uses camelCase
3. No duplicate names
4. All required fields populated

**Solution:**
Reload plugin or restore from backup.

### Colors Not Updating

**Check:**

1. Valid hex color codes (`#RRGGBB`)
2. Settings saved
3. Charts refreshed (reopen note)

**Solution:**
Clear Obsidian cache and reload.

### Categories Not Showing

**Check:**

1. Category list not empty
2. Settings saved
3. CSV view reloaded

**Solution:**
Refresh CSV file (close and reopen).

## Advanced Configuration

### Direct JSON Editing

For bulk changes, edit `data.json` directly:

1. Close Obsidian
2. Navigate to `.obsidian/plugins/findoc/data.json`
3. Edit with text editor
4. Validate JSON syntax
5. Restart Obsidian

**Warning:** Invalid JSON prevents plugin loading.

### Sharing Settings

Export settings for team use:

1. Copy `data.json`
2. Share file
3. Team members replace their `data.json`
4. Restart Obsidian

### Version Control

Track settings in Git:

```bash
git add .obsidian/plugins/findoc/data.json
git commit -m "Update FinDoc models"
```
