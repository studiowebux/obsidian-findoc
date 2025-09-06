import { MarkdownRenderChild } from "obsidian";
import {
	IModel,
	IReportData,
	IReportEntries,
	IReportEntry,
	IReportMultiData,
} from "types";
import { idToText } from "utils";

export default class ReportRenderer extends MarkdownRenderChild {
	private data: IReportData | IReportMultiData;
	private modelInfo: IModel;
	private viewType: "text" | "table";

	constructor(
		modelInfo: IModel,
		data: IReportData | IReportMultiData,
		el: HTMLElement,
		viewType: "text" | "table" = "text",
	) {
		super(el);
		this.modelInfo = modelInfo;
		this.data = data;
		this.viewType = viewType;
	}

	async onload() {
		if (this.viewType === "table") {
			this.renderTableView();
		} else {
			this.renderTextView();
		}
	}

	private renderTableView() {
		if (Array.isArray(this.data.datasets)) {
			// Check if it's IReportEntry[] (has date property) or IReportEntries[] (has labels property)
			const firstDataset = this.data.datasets[0];
			const isReportEntries = 'labels' in firstDataset && Array.isArray(firstDataset.data);
			
			this.containerEl.createEl("h3", {
				text: `Report ${!isReportEntries && 'date' in firstDataset ? firstDataset.date : ''} (Table View)`,
			});

			this.containerEl.createEl("p", {
				text: `Data Source: ${
					idToText(this.modelInfo.dataSource)
				} | Output: ${idToText(this.modelInfo.output)}`,
			});

			const table = this.containerEl.createEl("table");
			table.addClass("findoc-report-table");

			if (isReportEntries) {
				// Handle IReportEntries[] type (like dividend analysis)
				const headerRow = table.createEl("tr");
				headerRow.createEl("th", { text: "Symbol" });
				headerRow.createEl("th", { text: "Metric" });
				headerRow.createEl("th", { text: "Value" });

				(this.data.datasets as IReportEntries[]).forEach((entry: IReportEntries) => {
					entry.labels.forEach((label, index) => {
						const row = table.createEl("tr");
						row.createEl("td", { text: entry.label });
						row.createEl("td", { text: label });
						
						// Use specific format type if available in metadata, otherwise use model default
						const formatType = entry.metadata?.formatTypes?.[index] || this.modelInfo.chartLabelType;
						row.createEl("td", {
							text: this.formatValue(
								entry.data[index],
								formatType
							),
						});
					});
				});
			} else {
				// Handle IReportEntry[] type (traditional reports)
				const headerRow = table.createEl("tr");
				headerRow.createEl("th", { text: "Category" });
				headerRow.createEl("th", { text: "Value" });
				headerRow.createEl("th", { text: "Date" });

				(this.data.datasets as IReportEntry[]).forEach((entry: IReportEntry) => {
					const row = table.createEl("tr");
					row.createEl("td", { text: entry.label });
					row.createEl("td", {
						text: this.formatValue(
							entry.data,
							this.modelInfo.chartLabelType
						),
					});
					row.createEl("td", { text: entry.date });
				});
			}
		} else if (!Array.isArray(this.data.datasets)) {
			const { data, label, labels } = this.data
				.datasets as IReportEntries;
			this.containerEl.createEl("h3", {
				text: `Report ${label} (Table View)`,
			});

			this.containerEl.createEl("p", {
				text: `Data Source: ${
					idToText(this.modelInfo.dataSource)
				} | Output: ${idToText(this.modelInfo.output)}`,
			});

			const table = this.containerEl.createEl("table");
			table.addClass("findoc-report-table");

			// Create header
			const headerRow = table.createEl("tr");
			headerRow.createEl("th", { text: "Period" });
			headerRow.createEl("th", { text: "Value" });

			// Create rows
			labels.forEach((dataLabel: string, idx: number) => {
				const row = table.createEl("tr");
				row.createEl("td", { text: dataLabel });
				row.createEl("td", {
					text: this.formatValue(
						data[idx],
						this.modelInfo.chartLabelType,
					),
				});
			});
		}
	}

	private renderTextView() {
		if (Array.isArray(this.data.datasets)) {
			// Check if it's IReportEntry[] (has date property) or IReportEntries[] (has labels property)
			const firstDataset = this.data.datasets[0];
			const isReportEntries = 'labels' in firstDataset && Array.isArray(firstDataset.data);
			
			this.containerEl.createEl("h3", {
				text: `Report ${!isReportEntries && 'date' in firstDataset ? firstDataset.date : ''}`,
			});

			this.containerEl.createEl("p", {
				text: `Data Source: ${idToText(this.modelInfo.dataSource)}`,
			});
			this.containerEl.createEl("p", {
				text: `Output: ${idToText(this.modelInfo.output)}`,
			});

			this.containerEl.createEl("hr");

			if (isReportEntries) {
				// Handle IReportEntries[] type (like dividend analysis)
				(this.data.datasets as IReportEntries[]).forEach((entry: IReportEntries) => {
					const symbolDiv = this.containerEl.createEl("div");
					symbolDiv.createEl("h4", { text: entry.label });
					
					entry.labels.forEach((label, index) => {
						const entryDiv = symbolDiv.createEl("div");
						
						// Use specific format type if available in metadata, otherwise use model default
						const formatType = entry.metadata?.formatTypes?.[index] || this.modelInfo.chartLabelType;
						entryDiv.createEl("span", {
							text: `${label}: ${this.formatValue(
								entry.data[index],
								formatType
							)}`,
						});
					});
				});
			} else {
				// Handle IReportEntry[] type (traditional reports)
				(this.data.datasets as IReportEntry[]).forEach((entry: IReportEntry) => {
					const chartLabelType = this.containerEl.createEl("div");

					chartLabelType.createEl("span", {
						text: `${entry.label}: ${
							this.formatValue(
								entry.data,
								this.modelInfo.chartLabelType
							)
						}`,
					});
				});
			}
		} else if (!Array.isArray(this.data.datasets)) {
			const { data, label, labels } = this.data
				.datasets as IReportEntries;
			this.containerEl.createEl("h3", {
				text: `Report ${label}`,
			});

			this.containerEl.createEl("p", {
				text: `Data Source: ${idToText(this.modelInfo.dataSource)}`,
			});
			this.containerEl.createEl("p", {
				text: `Output: ${idToText(this.modelInfo.output)}`,
			});

			this.containerEl.createEl("hr");
			labels.forEach((dataLabel: string, idx: number) => {
				const chartLabelType = this.containerEl.createEl("div");

				chartLabelType.createEl("span", {
					text: `${dataLabel}: ${
						this.formatValue(
							data[idx],
							this.modelInfo.chartLabelType,
						)
					}`,
				});
			});
		}
	}

	private formatValue(value: number, chartLabelType: string): string {
		switch (chartLabelType) {
			case "money":
				return value.toLocaleString("en-US", {
					style: "currency",
					currency: "USD",
				});
			case "percent":
				return `${(value * 100).toFixed(2)}%`;
			case "generic":
			case "custom":
			default:
				return value.toLocaleString();
		}
	}
}
