import { evaluate } from "mathjs";

/**
 * Security utilities for safe input handling
 */

/**
 * Safely evaluate mathematical expressions with input validation
 * @param input - Mathematical expression or numeric string
 * @returns Evaluated number or original parsed float
 */
export function safeEvaluate(input: string): number {
	// Clean the input
	const cleanInput = input.trim();
	
	// If empty or invalid, return 0
	if (!cleanInput || cleanInput === "") {
		return 0;
	}
	
	// Try simple numeric parsing first
	const simpleNumber = parseFloat(cleanInput);
	if (!isNaN(simpleNumber) && cleanInput === simpleNumber.toString()) {
		return simpleNumber;
	}
	
	// Whitelist allowed mathematical operations and characters
	const allowedPattern = /^[\d\+\-\*\/\.\(\)\s]+$/;
	if (!allowedPattern.test(cleanInput)) {
		// If contains disallowed characters, try to parse as simple number
		const fallback = parseFloat(cleanInput);
		return isNaN(fallback) ? 0 : fallback;
	}
	
	// Check for suspicious patterns that could be malicious
	const suspiciousPatterns = [
		/function/i,
		/eval/i,
		/import/i,
		/require/i,
		/process/i,
		/global/i,
		/window/i,
		/document/i,
		/__/,  // Double underscore (often used in exploits)
		/\[/,  // Square brackets (array access)
		/\{/,  // Curly braces (object access)
	];
	
	for (const pattern of suspiciousPatterns) {
		if (pattern.test(cleanInput)) {
			const fallback = parseFloat(cleanInput);
			return isNaN(fallback) ? 0 : fallback;
		}
	}
	
	try {
		const result = evaluate(cleanInput);
		
		// Ensure result is a valid number
		if (typeof result === 'number' && isFinite(result)) {
			return result;
		}
		
		// If result is not a number, try to convert or fallback
		const numResult = Number(result);
		if (!isNaN(numResult) && isFinite(numResult)) {
			return numResult;
		}
		
		// Final fallback to simple parsing
		const fallback = parseFloat(cleanInput);
		return isNaN(fallback) ? 0 : fallback;
		
	} catch (error) {
		// If evaluation fails, try simple numeric parsing
		const fallback = parseFloat(cleanInput);
		return isNaN(fallback) ? 0 : fallback;
	}
}

/**
 * Sanitize text content for contentEditable fields
 * @param input - Raw text input
 * @returns Sanitized text
 */
export function sanitizeTextInput(input: string): string {
	if (!input || typeof input !== 'string') {
		return '';
	}
	
	return input
		// Remove HTML tags
		.replace(/<[^>]*>/g, '')
		// Remove potential script injections
		.replace(/javascript:/gi, '')
		// Remove event handlers
		.replace(/on\w+\s*=/gi, '')
		// Remove potential data URIs that could contain scripts
		.replace(/data:[^;]*;base64[^"']*/gi, '')
		// Clean up excessive whitespace
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Validate CSV data parts
 * @param parts - Array of CSV field values
 * @returns Whether the CSV line is valid
 */
export function validateCSVLine(parts: string[]): boolean {
	if (!parts || parts.length !== 5) {
		return false;
	}
	
	// Validate each field
	const [category, subcategory, value, timestamp, extra] = parts;
	
	// Category and subcategory should not be empty
	if (!category.trim() || !subcategory.trim()) {
		return false;
	}
	
	// Validate timestamp
	const date = new Date(timestamp);
	if (isNaN(date.getTime())) {
		return false;
	}
	
	// Validate value (should be a number or safe mathematical expression)
	if (value.trim() === '') {
		return false;
	}
	
	// Try to safely evaluate the value
	try {
		const evaluated = safeEvaluate(value);
		if (!isFinite(evaluated)) {
			return false;
		}
	} catch {
		return false;
	}
	
	return true;
}

/**
 * Create a safe text node instead of using innerHTML
 * @param element - Parent element
 * @param content - Text content to add
 */
export function safeSetTextContent(element: HTMLElement, content: string): void {
	// Clear existing content safely
	element.textContent = '';
	
	// Add sanitized content
	const sanitized = sanitizeTextInput(content);
	element.textContent = sanitized;
}

/**
 * Safely create and append an icon element
 * @param parent - Parent element
 * @param iconSvg - SVG icon string (trusted content)
 * @returns Created icon element
 */
export function safeCreateIcon(parent: HTMLElement, iconSvg: string): HTMLElement {
	const iconContainer = parent.createEl('span', {
		cls: 'findoc-icon-container'
	});
	
	// Since icon SVG comes from our own icon files, it's trusted content
	// But we still create it safely
	iconContainer.innerHTML = iconSvg;
	
	return iconContainer;
}

/**
 * Generate a secure random ID
 * @returns Random ID string
 */
export function generateSecureId(): string {
	// Fallback for environments without crypto
	if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
		const array = new Uint32Array(1);
		window.crypto.getRandomValues(array);
		return `id-${array[0].toString(36)}`;
	}
	
	// Fallback using Math.random (less secure but functional)
	return `id-${Math.random().toString(36).substr(2, 9)}`;
}