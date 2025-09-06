import {
	MarkdownPostProcessorContext,
	Menu,
	MenuItem,
	Notice,
	Plugin,
	TFile,
	WorkspaceLeaf,
	normalizePath,
	parseYaml,
} from "obsidian";

import { CSVView, VIEW_TYPE_CSV } from "./view";
import processing from "./processing";
import { DEFAULT_SETTINGS, HEADER } from "./defaults";
import SettingsTab from "./SettingsTab";
import ChartRenderer from "./ChartRenderer";
import ReportRenderer from "ReportRenderer";
import reporting from "reporting";
import { loadCSVData } from "data";
import { IPluginSettings, IReportData } from "types";

export default class FinDocPlugin extends Plugin {
	settings: IPluginSettings;

	async createCSVFile(parent = "") {
		const filename = normalizePath(
			`/${parent}/findoc_${new Date()
				.toISOString()
				.replace(/[:|.]/g, "_")}.csv`
		);
		const exists = await this.app.vault.adapter.exists(filename, true);

		if (exists) {
			new Notice("File already exist.");
		} else {
			await this.app.vault.create(filename, HEADER);
		}
	}

	async loadSettings() {
		const savedData = await this.loadData();
		
		// Deep merge settings, especially models
		this.settings = {
			...DEFAULT_SETTINGS,
			...savedData,
			models: {
				...DEFAULT_SETTINGS.models,
				...savedData.models
			}
		};

		// Run migration for new models
		await this.migrateSettings();
	}

	async migrateSettings() {
		const currentVersion = "0.8.0";
		const savedVersion = this.settings.version || "0.7.4";

		// Only migrate if version is older than current OR if any new models are missing
		const newModelNames = [
			'expensesQuarterly', 'incomeWeekly', 'portfolioByValueRange', 
			'expensesMonthlyBreakdown', 'allCategoriesBreakdown',
			'portfolioReportTable', 'quarterlyIncomeExpenseReport', 'weeklyExpenseAnalysis',
			'dividendMonthlyBySymbol', 'dividendCumulativeBySymbol', 'dividendAnalysisReport', 'dividendQuarterlyBySymbol'
		];
		
		const missingModels = newModelNames.filter(name => !this.settings.models[name]);
		const needsMigration = this.compareVersions(savedVersion, currentVersion) < 0 || missingModels.length > 0;
		
		if (needsMigration) {
			// Add new models from v0.8.0 that don't exist in user settings
			const newModels = {
				expensesQuarterly: DEFAULT_SETTINGS.models.expensesQuarterly,
				incomeWeekly: DEFAULT_SETTINGS.models.incomeWeekly,
				portfolioByValueRange: DEFAULT_SETTINGS.models.portfolioByValueRange,
				expensesBySubcategory: DEFAULT_SETTINGS.models.expensesBySubcategory,
				allCategoriesBreakdown: DEFAULT_SETTINGS.models.allCategoriesBreakdown,
				portfolioReportTable: DEFAULT_SETTINGS.models.portfolioReportTable,
				quarterlyIncomeExpenseReport: DEFAULT_SETTINGS.models.quarterlyIncomeExpenseReport,
				weeklyExpenseAnalysis: DEFAULT_SETTINGS.models.weeklyExpenseAnalysis,
				dividendMonthlyBySymbol: DEFAULT_SETTINGS.models.dividendMonthlyBySymbol,
				dividendCumulativeBySymbol: DEFAULT_SETTINGS.models.dividendCumulativeBySymbol,
				dividendAnalysisReport: DEFAULT_SETTINGS.models.dividendAnalysisReport,
				dividendQuarterlyBySymbol: DEFAULT_SETTINGS.models.dividendQuarterlyBySymbol,
			};

			let addedCount = 0;
			for (const [modelName, modelConfig] of Object.entries(newModels)) {
				if (!this.settings.models[modelName]) {
					this.settings.models[modelName] = modelConfig;
					addedCount++;
				}
			}

			// Update version
			this.settings.version = currentVersion;
			
			// Save updated settings
			await this.saveSettings();

			if (addedCount > 0) {
				new Notice(`Findoc v${currentVersion}: Added ${addedCount} new models!`, 5000);
			}
		}
	}

	compareVersions(a: string, b: string): number {
		const aParts = a.split('.').map(n => parseInt(n));
		const bParts = b.split('.').map(n => parseInt(n));
		
		for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
			const aPart = aParts[i] || 0;
			const bPart = bParts[i] || 0;
			
			if (aPart < bPart) return -1;
			if (aPart > bPart) return 1;
		}
		return 0;
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	showInlineError(el: HTMLElement, content: any, errorMessage: string) {
		// Clear any existing content
		el.empty();
		
		// Create error container
		const errorDiv = el.createEl("div");
		errorDiv.addClass("findoc-error-container");
		
		// Error title
		const title = errorDiv.createEl("h4");
		title.addClass("findoc-error-title");
		title.innerHTML = `⚠️ Invalid Snippet Configuration`;
		
		// Error details
		const details = errorDiv.createEl("p");
		details.addClass("findoc-error-details");
		details.textContent = errorMessage;
		
		// Snippet info
		const info = errorDiv.createEl("div");
		info.addClass("findoc-error-snippet-info");
		const snippetText = `Model: ${content.model}\nView: ${content.view || content.type || 'chart'}\nFile: ${content.filename}`;
		info.textContent = snippetText;
		
		// Help text
		const help = errorDiv.createEl("p");
		help.addClass("findoc-error-help");
		help.innerHTML = `💡 <strong>Tips:</strong><br>
		• Check Settings → Findoc → Models for compatible snippets<br>
		• File not found? Try <code>filename: tests/test-data.csv</code><br>
		• Wrong model name? Check case sensitivity (camelCase required)`;
	}

	async onload() {
		try {
			await this.loadSettings();
			this.addSettingTab(new SettingsTab(this.app, this));

			const { vault } = this.app;

			this.registerView(
				VIEW_TYPE_CSV,
				(leaf: WorkspaceLeaf) => new CSVView(leaf, this)
			);

			this.registerExtensions(["csv"], VIEW_TYPE_CSV);

			this.registerMarkdownCodeBlockProcessor(
				"findoc",
				async (
					src: string,
					el: HTMLElement,
					ctx: MarkdownPostProcessorContext
				) => {
					try {
						const activeFile = this.app.workspace.getActiveFile();
						if (!activeFile) {
							return;
						}
						const content = parseYaml(src);
						if (!content || !content.filename) {
							new Notice("No Content or No Filename", 10000);
							return;
						}

						const filenames: string[] = content.filename
							.split(",")
							.map((filename: string) =>
								normalizePath(
									`${
										activeFile.parent.path
									}/${filename.trim()}`
								)
							);

						if (filenames && filenames.length > 0) {
							const data = await loadCSVData(vault, filenames);

							if (
								content.view === "view" ||
								content.view === "line" ||
								content.view === "chart" || // NEW: Support view: chart
								content.type === "chart" || // DEPRECATED
								content.type === "line" || // DEPRECATED
								(!content.type && !content.view)
							) {
								try {
									const chartData = processing(
										data,
										content.model,
										this.settings.models,
										this.settings.colors,
										"line",
										this.settings.csvSeparator
									);
									if (chartData)
										ctx.addChild(
											new ChartRenderer(
												this.settings.models[
													content.model
												],
												chartData,
												content.model,
												content.title,
												filenames,
												el
											)
										);
								} catch (e) {
									this.showInlineError(el, content, e.message);
									return;
								}
							} else if (
								content.type === "report" || // DEPRECATED
								content.view === "report" ||
								content.view === "table"
							) {
								const reportData: IReportData = reporting(
									data,
									content.model,
									content.date || undefined,
									this.settings.models,
									this.settings.csvSeparator
								);
								const viewType = content.view === "table" ? "table" : "text";
								ctx.addChild(
									new ReportRenderer(
										this.settings.models[content.model],
										reportData,
										el,
										viewType
									)
								);
							} else if (
								content.view === "pie" ||
								content.type === "pie"
							) {
								try {
									const chartData = processing(
										data,
										content.model,
										this.settings.models,
										this.settings.colors,
										"pie",
										this.settings.csvSeparator
									);
									if (chartData)
										ctx.addChild(
											new ChartRenderer(
												this.settings.models[
													content.model
												],
												chartData,
												content.model,
												content.title,
												filenames,
												el
											)
										);
								} catch (e) {
									this.showInlineError(el, content, e.message);
									return;
								}
							} else if (
								content.view === "radar" ||
								content.type === "radar"
							) {
								try {
									const chartData = processing(
										data,
										content.model,
										this.settings.models,
										this.settings.colors,
										"radar",
										this.settings.csvSeparator
									);
									if (chartData)
										ctx.addChild(
											new ChartRenderer(
												this.settings.models[
													content.model
												],
												chartData,
												content.model,
												content.title,
												filenames,
												el
											)
										);
								} catch (e) {
									this.showInlineError(el, content, e.message);
									return;
								}
							} else {
								this.showInlineError(el, content, "Unsupported view type. Supported types: chart, pie, radar, report, table");
								return;
							}
						}
					} catch (e) {
						// Show general error notice for parsing/loading issues
						new Notice(`Findoc error: ${e.message}`, 10000);
						
						// Show inline error if possible
						const generalError = el.createEl("div", {
							text: `⚠️ Findoc Error: ${e.message}`
						});
						generalError.addClass("findoc-general-error");
						return;
					}
				}
			);

			this.addRibbonIcon("table", "Create CSV File", async (e) => {
				this.createCSVFile();
			});
			const menuCreateCSVFile = (menu: Menu, file: TFile) => {
				menu.addItem((item: MenuItem) => {
					item.setTitle("Create CSV File").onClick(() => {
						this.createCSVFile(file.path);
					});
				});
			};

			this.registerEvent(
				this.app.workspace.on("file-menu", menuCreateCSVFile)
			);
		} catch (e) {
			new Notice(e.message, 10000);
			throw e;
		}
	}
}
