import { App, Notice, PluginSettingTab, Setting, debounce } from "obsidian";
import FinDocPlugin from "main";
import { idToText } from "utils";
import loadIcons from "loadIcons";
import { IDataSourceKeys } from "types";
import { reloadDefaultConfiguration } from "configuration";
import { functions, splitBy } from "methods";

export default class SettingsTab extends PluginSettingTab {
	plugin: FinDocPlugin;

	constructor(app: App, plugin: FinDocPlugin) {
		super(app, plugin);
		this.plugin = plugin;

		loadIcons();
	}

	// Helper function for common button styles
	private styleButton(button: HTMLElement, extraStyles = ''): void {
		button.style.cssText = `
			margin-bottom: 10px;
			padding: 6px 12px;
			border: 1px solid var(--border-color);
			border-radius: 4px;
			background: var(--interactive-normal);
			color: var(--text-normal);
			cursor: pointer;
			${extraStyles}
		`;
	}

	// Helper function for modal styles
	private getModalStyles(): string {
		return `
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: var(--background-primary);
			border: 2px solid var(--border-color);
			border-radius: 8px;
			padding: 20px;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
			z-index: 9999;
			min-width: 300px;
		`;
	}

	// Helper function for button container styles
	private getButtonContainerStyles(): string {
		return 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;';
	}

	createNewColorBtn(): HTMLElement {
		const btn = this.containerEl.createEl("button");
		this.styleButton(btn);
		btn.id = "newColor";
		btn.innerText = "Add New Color";
		btn.onClickEvent(() => {
			this.plugin.settings.colors.unshift("#ffffff");
			this.display();
		});
		return btn;
	}

	createNewCategoryBtn(): HTMLElement {
		const btn = this.containerEl.createEl("button");
		this.styleButton(btn);
		btn.id = "newType";
		btn.innerText = "Add New Category";
		btn.onClickEvent(() => {
			this.plugin.settings.categories.unshift("");
			this.display();
		});
		return btn;
	}

	createReloadModelsBtn(): HTMLElement {
		const btn = this.containerEl.createEl("button");
		this.styleButton(btn, 'background: var(--text-warning); color: white;');
		btn.id = "reloadModels";
		btn.innerText = "Load Default Models (clears custom models)";
		btn.onClickEvent(async () => {
			await reloadDefaultConfiguration(this.plugin.settings, this.plugin);
			new Notice("All Models have been refreshed");
			this.display();
		});
		return btn;
	}

	getCategories() {
		return this.plugin.settings.categories;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings" });

		//
		// SUPPORT
		//

		new Setting(containerEl).setName("Support").addButton((button) => {
			button.buttonEl.innerHTML =
				"<a style='margin: 0 auto;' href='https://www.buymeacoffee.com/studiowebux'><img width='109px' alt='Buy me a Coffee' src='https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png'/></a>";
			button.buttonEl.classList.add("findoc-support-btn");
		});

		//
		// DOCUMENTATION
		//

		new Setting(containerEl)
			.setName("Documentation")
			.addButton((button) => {
				button.buttonEl.innerHTML =
					"<a style='margin: 0 auto;' href='https://studiowebux.github.io/obsidian-plugins-docs/docs/category/plugin-financial-doc/'>Link to Documentation</a>";
				button.buttonEl.classList.add("findoc-documentation-btn");
			});

		//
		// CSV SAVE DEBOUNCE
		//

		new Setting(containerEl)
			.setName("CSV Save debounce")
			.setDesc(
				"Timeout to trigger the CSV saving process (Value must be greater than 500 and less than 5000)"
			)
			.addText((text) => {
				text.setValue(this.plugin.settings.debounce.toString());
				text.onChange(
					debounce(async (value: string) => {
						if (
							isNaN(parseInt(value)) ||
							parseInt(value) < 500 ||
							parseInt(value) > 5000
						) {
							new Notice("Invalid debounce value !");
							return;
						}
						this.plugin.settings.debounce = value;
						await this.plugin.saveSettings();
						new Notice("Debounce Updated !");
					}, 500)
				);
			});

		//
		// CSV SEPARATOR
		//

		new Setting(containerEl).setName("CSV Separator").addText((text) => {
			text.setValue(this.plugin.settings.csvSeparator.toString());
			text.onChange(
				debounce(async (value: string) => {
					this.plugin.settings.csvSeparator = value;
					await this.plugin.saveSettings();
					new Notice("CSV Separator Updated !");
				}, 500)
			);
		});

		//
		// USE LAST ELEMENT AS TEMPLATE
		//

		new Setting(containerEl)
			.setName("Use Last Element as Template")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.useLastElementAsTemplate);
				toggle.onChange(
					debounce(async (value: boolean) => {
						this.plugin.settings.useLastElementAsTemplate = value;
						await this.plugin.saveSettings();
						new Notice("Use Last Element as Template Updated !");
					}, 500)
				);
			});

		//
		// TOGGLE AUTOCOMPLETE
		//

		new Setting(containerEl)
			.setName("Use Autocomplete")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.useAutocomplete);
				toggle.onChange(
					debounce(async (value: boolean) => {
						this.plugin.settings.useAutocomplete = value;
						await this.plugin.saveSettings();
						new Notice("Use autocomplete Updated !");
					}, 500)
				);
			});

		//
		// MIN CHARS TO MATCH
		//

		new Setting(containerEl)
			.setName("Minimum characters to Match")
			.setDesc(
				"The minimum amount of characters to open the autocomplete popup"
			)
			.addText((text) => {
				text.setValue(this.plugin.settings.minCharsToMatch.toString());
				text.onChange(
					debounce(async (value: string) => {
						if (!value || value === "") return;
						if (
							isNaN(parseInt(value)) ||
							parseInt(value) < 1 ||
							parseInt(value) >= 10
						) {
							new Notice(
								"Invalid amount, must be between 1 and 9"
							);
							return;
						}
						this.plugin.settings.minCharsToMatch = parseInt(value);
						await this.plugin.saveSettings();
						new Notice("Minimum characters to Match Updated !");
					}, 500)
				);
			});

		//
		//  CATEGORIES
		//

		new Setting(containerEl)
			.setName("categories")
			.setDesc(
				"NOTE: Deleting Existing Category might break the workflow, be sure to dissociate the category from everywhere."
			);
		const typesSection = containerEl.createDiv();
		typesSection.appendChild(this.createNewCategoryBtn());
		typesSection.classList.add("findoc-type-section");

		this.plugin.settings.categories.forEach((category, key) => {
			new Setting(typesSection)
				.setName(`Category`)
				.addText(async (text) => {
					text.setValue(category);
					text.onChange(
						debounce(async (value: string) => {
							this.plugin.settings.categories = Object.assign(
								this.plugin.settings.categories,
								{ [key]: value }
							);
							await this.plugin.saveSettings();
							new Notice("Category Updated !");
						}, 1000)
					);
					text.inputEl.onblur = () => {
						this.display(); // Force refresh.
					};
				})
				.addExtraButton((btn) => {
					btn.setTooltip("Delete Category");
					btn.setIcon("trash");
					btn.onClick(async () => {
						this.plugin.settings.categories.splice(key, 1);
						await this.plugin.saveSettings();
						new Notice("Category Deleted !");
						this.display();
					});
				});
		});

		//
		// MODELS
		//

		new Setting(containerEl)
			.setName("Models")
			.setDesc("Models available - Create, edit, or delete models for different data views");
		
		const modelControlsDiv = containerEl.createDiv();
		modelControlsDiv.classList.add("findoc-model-controls");
		
		// Model management buttons
		const addModelBtn = modelControlsDiv.createEl("button");
		addModelBtn.classList.add("findoc-btn-margin-right");
		addModelBtn.innerText = "Add New Model";
		addModelBtn.onclick = () => this.createNewModel();
		
		modelControlsDiv.appendChild(this.createReloadModelsBtn());

		const div = containerEl.createDiv();
		div.classList.add("findoc-models-container");

		Object.entries(this.plugin.settings.models).forEach(([key, model]) => {
			const name = idToText(key);
			const modelSection = div.createDiv();
			const el = modelSection.createEl("h1");
			el.innerText = "Model: " + name;
			modelSection.classList.add("findoc-model-section");
			
			// Model management buttons
			const modelHeaderDiv = modelSection.createDiv();
			modelHeaderDiv.classList.add("findoc-model-header");
			modelHeaderDiv.appendChild(el);
			
			const modelActionsDiv = modelHeaderDiv.createDiv();
			modelActionsDiv.classList.add("findoc-model-actions");
			
			const duplicateBtn = modelActionsDiv.createEl("button");
			duplicateBtn.innerText = "Duplicate";
			duplicateBtn.classList.add("findoc-btn-small", "findoc-btn-margin-right");
			duplicateBtn.onclick = () => this.duplicateModel(key, model);
			
			const deleteBtn = modelActionsDiv.createEl("button");
			deleteBtn.innerText = "Delete";
			deleteBtn.classList.add("findoc-btn-small", "findoc-btn-danger");
			deleteBtn.onclick = () => this.deleteModel(key);

			// Snippet examples section
			const snippetSection = modelSection.createDiv();
			snippetSection.classList.add("findoc-snippet-section");
			
			const snippetHeader = snippetSection.createEl("h4");
			snippetHeader.innerText = "Usage Examples";
			snippetHeader.classList.add("findoc-snippet-header");
			
			const snippetContainer = snippetSection.createDiv();
			snippetContainer.classList.add("findoc-snippet-container");
			
			// Generate different snippet examples based on model output type
			const snippets = this.generateSnippetsForModel(key, model);
			snippets.forEach((snippet, index) => {
				const snippetDiv = snippetContainer.createDiv();
				snippetDiv.classList.add("findoc-snippet-item");
				
				// Add warning class for incompatible snippets
				if (!snippet.compatible) {
					snippetDiv.classList.add("findoc-snippet-warning");
				}
				
				const snippetLabel = snippetDiv.createEl("span");
				snippetLabel.classList.add("findoc-snippet-label");
				snippetLabel.innerText = snippet.label;
				
				// Add warning text if present
				if (snippet.warning) {
					const warningSpan = snippetDiv.createEl("span");
					warningSpan.classList.add("findoc-snippet-warning-text");
					warningSpan.innerText = snippet.warning;
				}
				
				const snippetCode = snippetDiv.createEl("code");
				snippetCode.classList.add("findoc-snippet-code");
				if (!snippet.compatible) {
					snippetCode.classList.add("findoc-snippet-code-disabled");
				}
				snippetCode.innerText = snippet.code;
				
				const copyBtn = snippetDiv.createEl("button");
				copyBtn.innerText = snippet.compatible ? "Copy" : "Info";
				copyBtn.classList.add("findoc-btn-small", "findoc-btn-copy");
				if (!snippet.compatible) {
					copyBtn.classList.add("findoc-btn-disabled");
					copyBtn.title = snippet.warning || "This view type is not compatible with this model";
				}
				copyBtn.onclick = () => {
					if (snippet.compatible) {
						this.copyToClipboard(snippet.code, `${snippet.label} snippet copied!`);
					} else {
						new Notice(snippet.warning || "This view type is not compatible with this model", 5000);
					}
				};
			});

			// PREPARATION
			new Setting(modelSection)
				.setName(`Data Source for ${name}`)
				.setDesc("Method used to prepare the raw data.")
				.addDropdown((dropdown) => {
					Object.keys(splitBy)
						.map((key, idx) =>
							splitBy[key].help
								? dropdown.addOption(key, splitBy[key].help)
								: null
						)
						.filter((v) => v != null);

					dropdown.setValue(
						this.plugin.settings.models[key].dataSource
					);

					dropdown.onChange(async (value) => {
						this.plugin.settings.models[key].dataSource = value;
						await this.plugin.saveSettings();
						new Notice("Data Source Updated !");
					});
				});

			// Custom key `splitBy`
			new Setting(modelSection)
				.setName(`Data Source key for ${name}`)
				.setDesc(
					"Column to use when preparing the raw data. Modify this value exclusively when employing the `Split By` method for the data source."
				)
				.addDropdown((dropdown) => {
					dropdown.addOption("category", "Category");
					dropdown.addOption("subcategory", "SubCategory");
					dropdown.addOption("value", "Value");
					dropdown.addOption("timestamp", "Timestamp");
					dropdown.addOption("extra", "Extra");

					dropdown.setValue(
						this.plugin.settings.models[key].dataSourceKey
					);

					dropdown.onChange(async (value: IDataSourceKeys) => {
						this.plugin.settings.models[key].dataSourceKey = value;
						await this.plugin.saveSettings();
						new Notice("Data Source Key Updated !");
					});
				});

			// OUTPUT
			new Setting(modelSection)
				.setName(`Output Function for ${name}`)
				.setDesc("Method used to show the data in chart or table.")
				.addDropdown((dropdown) => {
					Object.keys(functions)
						.map((key, idx) =>
							functions[key].help
								? dropdown.addOption(key, functions[key].help)
								: null
						)
						.filter((v) => v != null);

					dropdown.setValue(this.plugin.settings.models[key].output);

					dropdown.onChange(async (value) => {
						this.plugin.settings.models[key].output = value;
						await this.plugin.saveSettings();
						new Notice("Output Updated !");
					});
				});

			//
			// BEGIN AT ZERO
			//
			new Setting(modelSection)
				.setName(`Begin at Zero for ${name}`)
				.addToggle((toggle) => {
					toggle.setValue(
						this.plugin.settings.models[key].beginAtZero
					);
					toggle.onChange(async (value) => {
						this.plugin.settings.models[key].beginAtZero = value;
						await this.plugin.saveSettings();
						new Notice("Begin at Zero Updated !");
					});
				});

			//
			// CHART LABEL TYPES; MONEY, PERCENT, GENERIC, CUSTOM
			//
			const h2ChartType = modelSection.createEl("h2");
			h2ChartType.innerText = `Chart Label Type for ${name}`;

			const wrapperChartType = modelSection.createDiv();
			wrapperChartType.classList.add("findoc-model-section-wrapper");

			const chartLabelType = wrapperChartType.createEl("select");
			chartLabelType.id = `chart-label-type-${key}`;
			chartLabelType.multiple = false;
			chartLabelType.classList.add("findoc-select-one");

			chartLabelType.setAttribute("value", model.chartLabelType);
			chartLabelType.onchange = async () => {
				const selected = [];
				for (const option of (
					document.getElementById(
						`chart-label-type-${key}`
					) as HTMLSelectElement
				).options as any) {
					if (option.selected) {
						selected.push(option.value);
					}
				}
				model.chartLabelType = selected[0];
				await this.plugin.saveSettings();
				new Notice("Label Type Updated !");
			};
			this.plugin.settings.chartLabelTypes.forEach(
				(labelType: string) => {
					const opt = chartLabelType.createEl("option");
					opt.id = labelType;
					opt.value = labelType;
					opt.innerText = labelType;
					opt.selected = model.chartLabelType === labelType;
				}
			);

			//
			// SUFFIX
			//
			new Setting(modelSection)
				.setDisabled(model.chartLabelType !== "custom")
				.setName("Suffix")
				.setDesc(
					`Optional Suffix, only used when the chart label type is set to "custom"`
				)
				.addText((text) => {
					text.setValue(model.suffix);
					text.onChange(
						debounce(async (value: string) => {
							model.suffix = value || "";
							await this.plugin.saveSettings();
							new Notice("Suffix Updated !");
						}, 500)
					);
				});

			//
			// categories
			//
			const h2 = modelSection.createEl("h2");
			h2.innerText = `Categories for ${name}`;

			const wrapper = modelSection.createDiv();
			wrapper.classList.add("findoc-model-section-wrapper");

			const select = wrapper.createEl("select");
			select.id = key;
			select.multiple = true;
			select.classList.add("findoc-select");

			select.setAttribute("value", model.categories.join(","));
			select.onchange = async () => {
				const selected = [];
				// @ts-ignore
				for (const option of document.getElementById(key).options) {
					if (option.selected) {
						selected.push(option.value);
					}
				}
				model.categories = selected;
				await this.plugin.saveSettings();
				new Notice("Categories Updated !");
			};

			this.getCategories().forEach((category: string) => {
				const opt = select.createEl("option");
				opt.id = category;
				opt.value = category;
				opt.innerText = category;
				opt.selected = model.categories.includes(category);
			});

			//
			// VALUES (Comma delimited list to specify the values to substract)
			//
			new Setting(modelSection)
				.setDisabled(model.output !== "generateDifference")
				.setName("Values")
				.setDesc(
					`Comma delimited list of two values.\nOnly used when the output is set to "generateDifference".\nExample: "Income, Expenses" will produce: Income - Expenses`
				)
				.addText((text) => {
					text.setValue(model.values);
					text.onChange(
						debounce(async (value: string) => {
							model.values = value || "";
							await this.plugin.saveSettings();
							new Notice("Values Updated !");
						}, 500)
					);
				});
			modelSection.createEl("hr");
		});

		//
		//  COLORS
		//

		new Setting(containerEl).setName("Colors");
		const colorSection = containerEl.createDiv();
		colorSection.appendChild(this.createNewColorBtn());
		colorSection.classList.add("findoc-color-section");

		this.plugin.settings.colors.forEach((color, key) => {
			new Setting(colorSection)
				.setName(`Color #${key}`)
				.addColorPicker(async (colorPicker) => {
					colorPicker.setValue(color);
					colorPicker.onChange(
						debounce(async (value: string) => {
							this.plugin.settings.colors[key] = value;
							await this.plugin.saveSettings();
							new Notice("Color Updated !");
						}, 500)
					);
				})
				.addExtraButton((btn) => {
					btn.setTooltip("Delete Color");
					btn.setIcon("trash");
					btn.onClick(async () => {
						this.plugin.settings.colors.splice(key, 1);
						await this.plugin.saveSettings();
						new Notice("Color Deleted !");
						this.display();
					});
				});
		});
	}

	/**
	 * Create a new model with default settings
	 */
	async createNewModel() {
		const modelName = await this.promptForModelName();
		if (!modelName || modelName.trim() === '') {
			return;
		}

		const sanitizedName = modelName.toLowerCase().replace(/[^a-z0-9]/g, '');
		if (this.plugin.settings.models[sanitizedName]) {
			new Notice(`Model "${sanitizedName}" already exists!`);
			return;
		}

		// Create new model with default settings
		this.plugin.settings.models[sanitizedName] = {
			dataSource: "splitByYearMonth",
			categories: ["Portfolio"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: ""
		};

		await this.plugin.saveSettings();
		new Notice(`Model "${sanitizedName}" created successfully!`);
		this.display(); // Refresh the settings display
	}

	/**
	 * Duplicate an existing model
	 */
	async duplicateModel(originalKey: string, originalModel: any) {
		const newModelName = await this.promptForModelName(`Copy of ${originalKey}`);
		if (!newModelName || newModelName.trim() === '') {
			return;
		}

		const sanitizedName = newModelName.toLowerCase().replace(/[^a-z0-9]/g, '');
		if (this.plugin.settings.models[sanitizedName]) {
			new Notice(`Model "${sanitizedName}" already exists!`);
			return;
		}

		// Deep copy the original model
		this.plugin.settings.models[sanitizedName] = {
			dataSource: originalModel.dataSource,
			categories: [...originalModel.categories],
			output: originalModel.output,
			beginAtZero: originalModel.beginAtZero,
			chartLabelType: originalModel.chartLabelType,
			dataSourceKey: originalModel.dataSourceKey,
			values: originalModel.values || ""
		};

		await this.plugin.saveSettings();
		new Notice(`Model "${sanitizedName}" duplicated successfully!`);
		this.display(); // Refresh the settings display
	}

	/**
	 * Delete a model with confirmation
	 */
	async deleteModel(modelKey: string) {
		const confirmed = await this.confirmDelete(modelKey);
		if (!confirmed) {
			return;
		}

		delete this.plugin.settings.models[modelKey];
		await this.plugin.saveSettings();
		new Notice(`Model "${modelKey}" deleted successfully!`);
		this.display(); // Refresh the settings display
	}

	/**
	 * Prompt user for model name
	 */
	async promptForModelName(defaultName: string = ''): Promise<string | null> {
		return new Promise((resolve) => {
			const modal = document.createElement('div');
			modal.style.cssText = this.getModalStyles() + 'width: 300px; z-index: 10000;';

			const title = modal.createEl('h3');
			title.innerText = 'Enter Model Name';

			const input = modal.createEl('input');
			input.type = 'text';
			input.value = defaultName;
			input.style.cssText = `
				width: 100%;
				padding: 8px;
				margin: 10px 0;
				border: 1px solid var(--border-color);
				border-radius: 4px;
				background: var(--background-secondary);
				color: var(--text-normal);
				box-sizing: border-box;
			`;

			const buttonsDiv = modal.createDiv();
			buttonsDiv.style.cssText = this.getButtonContainerStyles();

			const cancelBtn = buttonsDiv.createEl('button');
			cancelBtn.innerText = 'Cancel';
			this.styleButton(cancelBtn, 'margin-bottom: 0;');
			cancelBtn.onclick = () => {
				modal.remove();
				resolve(null);
			};

			const okBtn = buttonsDiv.createEl('button');
			okBtn.innerText = 'OK';
			this.styleButton(okBtn, 'background: var(--interactive-accent); color: var(--text-on-accent); margin-bottom: 0;');
			okBtn.onclick = () => {
				modal.remove();
				resolve(input.value);
			};

			input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					okBtn.click();
				} else if (e.key === 'Escape') {
					cancelBtn.click();
				}
			});

			document.body.appendChild(modal);
			input.focus();
			input.select();
		});
	}

	/**
	 * Confirm deletion with user
	 */
	async confirmDelete(modelKey: string): Promise<boolean> {
		return new Promise((resolve) => {
			const modal = document.createElement('div');
			modal.style.cssText = this.getModalStyles() + 'width: 350px; z-index: 10000;';

			const title = modal.createEl('h3');
			title.innerText = 'Confirm Deletion';
			title.style.color = 'var(--text-error)';

			const message = modal.createEl('p');
			message.innerText = `Are you sure you want to delete the model "${modelKey}"? This action cannot be undone.`;

			const buttonsDiv = modal.createDiv();
			buttonsDiv.style.cssText = this.getButtonContainerStyles();

			const cancelBtn = buttonsDiv.createEl('button');
			cancelBtn.innerText = 'Cancel';
			this.styleButton(cancelBtn, 'margin-bottom: 0;');
			cancelBtn.onclick = () => {
				modal.remove();
				resolve(false);
			};

			const deleteBtn = buttonsDiv.createEl('button');
			deleteBtn.innerText = 'Delete';
			this.styleButton(deleteBtn, 'background: var(--text-error); color: var(--text-on-accent); margin-bottom: 0;');
			deleteBtn.onclick = () => {
				modal.remove();
				resolve(true);
			};

			document.addEventListener('keydown', function escHandler(e) {
				if (e.key === 'Escape') {
					cancelBtn.click();
					document.removeEventListener('keydown', escHandler);
				}
			});

			document.body.appendChild(modal);
			cancelBtn.focus();
		});
	}

	/**
	 * Generate snippet examples for a model
	 */
	generateSnippetsForModel(modelKey: string, model: any): { label: string; code: string; compatible: boolean; warning?: string }[] {
		const snippets = [];
		const isReportOnly = this.isReportModel(model);
		const isChartCompatible = !isReportOnly;
		
		// Basic chart snippet
		if (isChartCompatible) {
			snippets.push({
				label: "Chart",
				compatible: true,
				code: `\`\`\`findoc
filename: your-data.csv
model: ${modelKey}
view: chart
title: ${this.toTitleCase(modelKey)}
\`\`\``
			});
		} else {
			snippets.push({
				label: "Chart",
				compatible: false,
				warning: "⚠️ Not compatible - Use report/table views instead",
				code: `<!-- Model "${modelKey}" is not compatible with chart views -->
<!-- Use view: report or view: table instead -->`
			});
		}

		// Pie chart snippet (if suitable for pie charts)
		if (this.isSuitableForPieChart(model) && isChartCompatible) {
			snippets.push({
				label: "Pie Chart",
				compatible: true,
				code: `\`\`\`findoc
filename: your-data.csv
model: ${modelKey}
view: pie
title: ${this.toTitleCase(modelKey)} Distribution
\`\`\``
			});
		} else if (!isChartCompatible) {
			snippets.push({
				label: "Pie Chart",
				compatible: false,
				warning: "⚠️ Report model - Not compatible with pie charts",
				code: `<!-- Model "${modelKey}" is not compatible with pie charts -->
<!-- Use view: report or view: table instead -->`
			});
		}

		// Radar chart snippet (if suitable)
		if (this.isSuitableForRadarChart(model) && isChartCompatible) {
			snippets.push({
				label: "Radar Chart",
				compatible: true,
				code: `\`\`\`findoc
filename: your-data.csv
model: ${modelKey}
view: radar
title: ${this.toTitleCase(modelKey)} Radar
\`\`\``
			});
		}

		// Report/Table snippets for report models
		if (isReportOnly) {
			snippets.push({
				label: "Text Report",
				compatible: true,
				code: `\`\`\`findoc
filename: your-data.csv
model: ${modelKey}
view: report
date: 2025-09-01
\`\`\``
			});

			snippets.push({
				label: "Table Report",
				compatible: true,
				code: `\`\`\`findoc
filename: your-data.csv
model: ${modelKey}
view: table
date: 2025-09-01
\`\`\``
			});
		}

		return snippets;
	}

	/**
	 * Check if model is suitable for pie charts
	 */
	isSuitableForPieChart(model: any): boolean {
		// Models with "PerTypes" output or subcategory/category splits work well as pie charts
		return model.output.includes('PerTypes') || 
			   model.dataSource.includes('Subcategory') || 
			   model.dataSource.includes('Category') ||
			   model.dataSource.includes('ValueRange');
	}

	/**
	 * Check if model is suitable for radar charts
	 */
	isSuitableForRadarChart(model: any): boolean {
		// Similar to pie charts, models with multiple categories work well as radar
		return model.categories && model.categories.length > 2 && 
			   (model.output.includes('generateSumDataSet') || 
			    model.output.includes('PerTypes'));
	}

	/**
	 * Check if model is a report model
	 */
	isReportModel(model: any): boolean {
		return model.output.includes('report') || 
			   model.output.includes('getLastValue');
	}

	/**
	 * Convert camelCase/kebab-case to Title Case
	 */
	toTitleCase(str: string): string {
		return str
			.replace(/([A-Z])/g, ' $1') // Add space before capitals
			.replace(/^./, (char) => char.toUpperCase()) // Capitalize first letter
			.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
	}

	/**
	 * Copy text to clipboard and show notice
	 */
	async copyToClipboard(text: string, message: string) {
		try {
			await navigator.clipboard.writeText(text);
			new Notice(message, 3000);
		} catch (err) {
			// Fallback for browsers that don't support clipboard API
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			textArea.style.top = '-999999px';
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			textArea.remove();
			new Notice(message, 3000);
		}
	}
}
