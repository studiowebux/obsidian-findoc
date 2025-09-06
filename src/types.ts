export type IInput = {
	category: string; // Entry category
	subcategory: string; // Entry subcategory
	value: number;
	timestamp: Date;
	extra: string;
};

export type IDataset = {
	labels: string[];
	datasets: {
		label: string;
		borderColor: string;
		fill: boolean;
		tension: number;
		data: number[];
		segment: {
			borderColor?: (ctx: IContext) => string | Array<number> | undefined;
			borderDash: (ctx: IContext) => string | Array<number> | undefined;
		};
	}[];
};

export type IPieDataset = {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
	}[];
};

export type IRadarDataset = {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		fill: boolean;
	}[];
};

export type ITooltip = {
	dataset: {
		label: string;
		data: number[];
	};
	parsed: {
		y: number;
	};
	dataIndex: number;
};

export type IPluginSettings = {
	models: {
		[key: string]: IModel;
	};
	colors: string[];
	debounce: string;
	csvSeparator: string;
	useLastElementAsTemplate: boolean;
	useAutocomplete: boolean;
	minCharsToMatch: number;
	categories: string[];
	chartLabelTypes: string[];
	version?: string;
};

export type IChartLabelTypes = "money" | "percent" | "generic" | "custom";
export type IDataSourceKeys =
	| "timestamp"
	| "category"
	| "subcategory"
	| "value"
	| "extra";

export type IModel = {
	dataSource: string;
	dataSourceKey: IDataSourceKeys;
	categories: string[]; // categories to include in the model
	output: string;
	beginAtZero: boolean;
	chartLabelType: IChartLabelTypes;
	suffix?: string;
	date?: string;
	values: string;
};

export type IEvent = {
	target: {
		innerHTML: string;
	};
};

export type IChartLine = {
	type: "line";
	data: IDataset;
	options: {
		responsive: boolean;
		maintainAspectRatio: boolean;
		interaction: {
			intersect: boolean;
		};
		scales: {
			y: {
				beginAtZero: boolean;
			};
		};
		plugins: {
			tooltip: {
				callbacks: {
					label: (context: ITooltip) => string;
				};
			};
		};
	};
};

export type IChartPie = {
	type: "pie";
	data: IPieDataset;
	options: {
		responsive: boolean;
		maintainAspectRatio: boolean;
	};
};

export type IChartRadar = {
	type: "radar";
	data: IRadarDataset;
	options: {
		responsive: boolean;
		maintainAspectRatio: boolean;
	};
};

export type IContext = {
	p0: { skip: boolean };
	p1: { skip: boolean };
};

export type IReportData = {
	datasets: IReportEntry[];
};

export type IReportEntry = {
	label: string;
	data: number;
	date: string;
};

export type IReportMultiData = {
	datasets: IReportEntries;
};

export type IReportEntries = {
	label: string;
	data: number[];
	labels: string[];
};
