---
title: Settings
description: Customize FinDoc to your needs
---

# Settings

Access settings via Settings → FinDoc.

## Categories

Add or remove categories that appear in the dropdown when editing CSV files.

**Default categories:**
- Portfolio
- Income
- Mortgage
- Dividend
- House Expenses
- Expenses
- Debt
- Loan

**To add a category:**
Type the name and press Enter or click Add.

**To remove a category:**
Click the X next to the category name.

## Colors

Manage the color palette used for chart datasets. Colors are assigned sequentially to datasets as they appear in charts.

**Format:** Hex color codes

The plugin includes 100 predefined colors. You can:
- Add new colors with "Add New Color" button
- Edit existing colors (hex format: #RRGGBB)
- Delete colors you don't need
- Reorder colors to change assignment priority

Colors apply to all chart types (line, pie, radar) and are assigned in order to each dataset.

## Autocomplete

**Enable autocomplete:** Toggle to show suggestions as you type subcategories

**Minimum characters:** How many letters before suggestions appear (range: 1-9, default: 2)

## New Rows

**Use last row as template:** When enabled, clicking "Add New Row" copies your last row to pre-fill the new row

## Save Behavior

**Debounce delay:** How long to wait (in ms) before auto-saving after you stop typing (range: 500-5000, default: 1000)

Lower values = more frequent saves but more processing
Higher values = less frequent saves but better performance

## CSV Format

**Separator:** Character used to separate columns (default: comma)

Change to semicolon (;) if needed for Excel compatibility in some regions.

## Models

Models define how your data is processed and displayed in charts and reports. The plugin includes many built-in models (see [Model Reference](model-reference.md)).

**Add New Model:** Create custom models for specific needs

**Load Default Models:** Resets all models to defaults (WARNING: deletes custom models)

**Per-model settings:**
- Which categories to include (e.g., Income, Expenses)
- How to group data (daily, weekly, monthly, yearly)
- Chart options (Y-axis starting point, label format)
- Output type (chart data or table/report data)

Most users can use the built-in models without modification. See [Developer Documentation](../developer/models.md) for advanced customization.

## Lazy Loading

**Enable for large files:** Loads data in chunks for files with many rows

Improves performance when working with hundreds of entries.
