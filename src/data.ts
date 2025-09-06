import { Vault } from "obsidian";

export async function loadCSVData(vault: Vault, filenames: string[]) {
	const data: string[] = [];
	
	for (const filename of filenames) {
		const content = await vault.adapter.read(filename);
		const lines = content.split(/\r?\n/);
		
		// Skip header and filter empty lines in single pass
		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line) {
				data.push(line);
			}
		}
	}
	
	return data.join("\n");
}
