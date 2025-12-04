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

Assign colors to categories for consistent chart appearance.

**Format:** Category name = Color (hex or name)

Example:
```
Income = #10b981
Expenses = #ef4444
Portfolio = #3b82f6
```

## Autocomplete

**Enable autocomplete:** Toggle to show suggestions as you type subcategories

**Minimum characters:** How many letters before suggestions appear (default: 2)

## New Rows

**Use last row as template:** When enabled, clicking "+" copies your last row to pre-fill the new row

## Save Behavior

**Debounce delay:** How long to wait (in ms) before auto-saving after you stop typing (default: 1000)

Lower values = more frequent saves but more processing
Higher values = less frequent saves but better performance

## CSV Format

**Separator:** Character used to separate columns (default: comma)

Change to semicolon (;) if needed for Excel compatibility in some regions.

## Lazy Loading

**Enable for large files:** Loads data in chunks for files with many rows

Improves performance when working with hundreds of entries.
