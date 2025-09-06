import {
	IChartLabelTypes,
	IChartLine,
	IChartPie,
	IChartRadar,
	IDataset,
	IPieDataset,
	IRadarDataset,
	ITooltip,
} from "types";

function getChartLabelType(
	chartLabelType: IChartLabelTypes,
	label: string,
	value: number,
	suffix: string
) {
	let updatedLabel = label;
	if (chartLabelType === "money")
		updatedLabel += new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);
	else if (chartLabelType === "percent") updatedLabel += `${value}%`;
	else if (chartLabelType === "generic") updatedLabel += `${value}`;
	else if (chartLabelType === "custom") updatedLabel += `${value}${suffix}`;
	return updatedLabel;
}

export function chartLine(
	data: IDataset,
	chartLabelType: IChartLabelTypes,
	suffix = "",
	beginAtZero = true
): IChartLine {
	return {
		type: "line",
		data,
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				intersect: false,
			},
			scales: {
				y: {
					beginAtZero,
				},
			},
			plugins: {
				tooltip: {
					callbacks: {
						label: function (context: ITooltip) {
							let previousValue: number = null;
							let firstValue: number = null;
							let change = 0;
							let symbol: "+" | "-" = "+";
							let label = context.dataset.label || "";

							if (label) {
								label += ": ";
							}
							if (context.parsed.y !== null) {
								label = getChartLabelType(
									chartLabelType,
									label,
									context.parsed.y,
									suffix
								);
							}

							const currentValue: number = context.parsed.y;

							// NOTE: Skip
							if (isNaN(currentValue)) return label;

							// NOTE: Item index between 1 and the last one
							if (context.dataIndex - 1 >= 0) {
								// NOTE: Get Value from the previous point
								previousValue =
									context.dataset.data[context.dataIndex - 1];
								// NOTE: Skip
								if (previousValue === 0 || isNaN(previousValue))
									return label;
								// NOTE: Positive Change
								if (currentValue > previousValue) {
									symbol = "+";
									change =
										((currentValue - previousValue) /
											previousValue) *
										100;
								}
								// NOTE: Negative Change
								else {
									symbol = "-";
									change =
										((previousValue - currentValue) /
											previousValue) *
										100;
								}

								// NOTE: Append Label
								label += ` => ${
									change !== 0 ? symbol : ""
								}${change.toFixed(2)}%`;
							}

							// NOTE: Last item in the graph
							if (
								context.dataIndex ===
								context.dataset.data.length - 1
							) {
								firstValue = context.dataset.data[0];
								// NOTE: SKIP
								if (firstValue === 0 || isNaN(firstValue))
									return label;
								// NOTE: Positive Change
								if (currentValue > firstValue) {
									symbol = "+";
									change =
										((currentValue - firstValue) /
											firstValue) *
										100;
								}
								// NOTE: Negative Change
								else {
									symbol = "-";
									change =
										((firstValue - currentValue) /
											firstValue) *
										100;
								}
								// NOTE: Append Label
								label += ` > ${
									change !== 0 ? symbol : ""
								}${change.toFixed(2)}%`;
							}

							return label;
						},
					},
				},
			},
		},
	};
}

export function chartPie(data: IPieDataset): IChartPie {
	return {
		type: "pie",
		data,
		options: {
			responsive: true,
			maintainAspectRatio: false,
		},
	};
}

export function chartRadar(data: IRadarDataset): IChartRadar {
	return {
		type: "radar",
		data,
		options: {
			responsive: true,
			maintainAspectRatio: false,
		},
	};
}
