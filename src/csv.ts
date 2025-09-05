import { IInput } from "types";

/**
 * Parse CSV line with proper handling of quoted fields and separators
 * @param line CSV line to parse
 * @param separator Field separator (default: comma)
 * @returns Array of field values
 */
export function parseCSVLine(line: string, separator = ","): string[] {
	const result: string[] = [];
	let current = "";
	let inQuotes = false;
	
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		
		if (char === '"') {
			if (inQuotes && line[i + 1] === '"') {
				// Escaped quote
				current += '"';
				i++; // Skip next quote
			} else {
				// Toggle quote state
				inQuotes = !inQuotes;
			}
		} else if (char === separator && !inQuotes) {
			// Field separator outside quotes
			result.push(current.trim());
			current = "";
		} else {
			// Regular character
			current += char;
		}
	}
	
	// Add final field
	result.push(current.trim());
	return result;
}

export function getData(csv: string, separator = ","): Array<IInput> {
	const lines = csv.split("\n");
	const result: IInput[] = [];
	
	// Skip header (index 0) and process lines in single pass
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;
		
		const parts = line.includes('"') ? parseCSVLine(line, separator) : line.split(separator);
		if (parts.length !== 5) continue;
		
		const value = parseFloat(parts[2]);
		const timestamp = new Date(parts[3]);
		
		result.push({
			category: parts[0],
			subcategory: parts[1],
			value: isNaN(value) ? 0 : value,
			timestamp,
			extra: parts[4],
		});
	}
	
	// Sort by timestamp (handle invalid dates)
	result.sort((a, b) => {
		const leftTime = a.timestamp.getTime();
		const rightTime = b.timestamp.getTime();
		
		// Handle NaN cases - invalid dates go to the end
		if (isNaN(leftTime) && isNaN(rightTime)) return 0;
		if (isNaN(leftTime)) return 1;
		if (isNaN(rightTime)) return -1;
		
		return leftTime - rightTime;
	});
	
	return result;
}
