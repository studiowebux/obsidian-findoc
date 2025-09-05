import { MarkdownRenderChild } from "obsidian";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { idToText } from "utils";
import { IChartLine, IModel, IChartPie, IChartRadar } from "types";
import { generateSecureId } from "security";

export default class ChartRenderer extends MarkdownRenderChild {
	private data: IChartLine | IChartPie | IChartRadar;
	private modelInfo: IModel;
	private model: string;
	private title: string;
	private filenames: string[];
	private canvases: { [key: string]: HTMLCanvasElement } = {};

	constructor(
		modelInfo: IModel,
		data: IChartLine | IChartPie | IChartRadar,
		model: string,
		title: string,
		filenames: string[],
		el: HTMLElement
	) {
		super(el);
		this.modelInfo = modelInfo;
		this.data = data;
		this.title = title; // Chart Title
		this.filenames = filenames;
		this.model = model;
	}

	async onload() {
		if (!this.canvases[this.model]) {
			// Chart
			try {
				this.canvases[this.model] = document.createElement("canvas");

				new Chart(
					this.canvases[this.model].getContext("2d"),
					this.data as ChartConfiguration
				);

				// Header
				if (this.title && this.title !== "") {
					this.containerEl.createEl("h3", { text: this.title });
				} else {
					this.containerEl.createEl("h3", { text: this.model });
				}

				// Chart
				const canvasDiv = this.containerEl.createEl("div");
				canvasDiv.addClass("chart-container");
				
				// Add chart type attribute for specific styling
				if (this.data.type === "radar") {
					canvasDiv.setAttribute("data-chart-type", "radar");
				}
				
				canvasDiv.append(this.canvases[this.model]);
				this.containerEl.append(canvasDiv);

				// Footer
				/// Button to toggle footer
				const id = generateSecureId();
				const btn = this.containerEl.createEl("button");
				btn.addClasses(["findoc-btn"]);
				btn.setAttribute("data-toggle", "collapse");
				btn.setAttribute("data-target", `.collapse.${id}`);
				btn.setAttribute("data-text", "Collapse");
				btn.textContent = "Toggle Chart Information";
				btn.onclick = (ev: MouseEvent) => {
					const containers = Array.from(
						document.querySelectorAll(
							btn.getAttribute("data-target")
						)
					);
					containers.forEach((target) => {
						target.classList.toggle("show");
					});
				};

				/// Footer content
				const containerInfo = this.containerEl.createEl("div");
				containerInfo.addClasses(["collapse", id]);

				containerInfo.createEl("p", {
					text: `Data Source: ${idToText(this.modelInfo.dataSource)}`,
				});
				containerInfo.createEl("p", {
					text: `Model: ${this.model}`,
				});
				containerInfo.createEl("p", {
					text: `Output: ${idToText(this.modelInfo.output)}`,
				});
				containerInfo.createEl("p", {
					text: `Source Input(s): ${this.filenames.join(", ")}`,
				});
			} catch (e) {
				this.containerEl.createEl("h3", { text: this.title });
				this.containerEl.createEl("p", {
					text: e.message,
				});
				throw e;
			}
		} else {
			console.debug("Canvas already loaded");
		}
	}
}
