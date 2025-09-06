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
			this.containerEl.createEl("h3", {
				text: `Report ${this.data?.datasets[0]?.date} (Table View)`,
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
			headerRow.createEl("th", { text: "Category" });
			headerRow.createEl("th", { text: "Value" });
			headerRow.createEl("th", { text: "Date" });

			// Create rows
			this.data.datasets.forEach((entry: IReportEntry) => {
				const row = table.createEl("tr");
				row.createEl("td", { text: entry.label });
				row.createEl("td", {
					text: this.formatValue(
						entry.data,
						this.modelInfo.chartLabelType,
					),
				});
				row.createEl("td", { text: entry.date });
			});
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
			this.containerEl.createEl("h3", {
				text: `Report ${this.data?.datasets[0]?.date}`,
			});

			this.containerEl.createEl("p", {
				text: `Data Source: ${idToText(this.modelInfo.dataSource)}`,
			});
			this.containerEl.createEl("p", {
				text: `Output: ${idToText(this.modelInfo.output)}`,
			});

			this.containerEl.createEl("hr");

			this.data.datasets.forEach((entry: IReportEntry) => {
				const chartLabelType = this.containerEl.createEl("div");

				chartLabelType.createEl("span", {
					text: `${entry.label}: ${
						this.formatValue(
							entry.data,
							this.modelInfo.chartLabelType,
						)
					}`,
				});
			});
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
