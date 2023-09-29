import { IPluginSettings } from "types";

export const COLORS: string[] = [
	"#1ac18f",
	"#EAE2B7",
	"#8ecae6",
	"#219ebc",
	"#026597",
	"#be37a5",
	"#fb8500",
	"#ffbe0b",
	"#fff5b8",
	"#ff006e",
	"#8338ec",
	"#3a86ff",
	"#390099",
	"#9e0059",
	"#8c3b56",
	"#ff5400",
	"#ffbd00",
	"#619b8a",
	"#7678ed",
	"#c2e83b",
	"#33658a",
	"#ce6a85",
	"#985277",
	"#5c374c",
	"#ba66ff",
	"#2176ff",
	"#33a1fd",
	"#7cd671",
	"#22def7",
];

export const DEFAULT_SETTINGS: IPluginSettings = {
	chartLabelTypes: ["money", "percent", "generic", "custom"],
	minCharsToMatch: 1,
	useAutocomplete: true,
	types: [
		"Portfolio",
		"Income",
		"Mortgage",
		"Mortgage Rate",
		"Cotisation",
		"Dividend",
		"House Expenses",
		"Expenses",
		"Generic",
	],
	useLastElementAsTemplate: true,
	models: {
		expenses: {
			dataSource: "splitDailyDates",
			types: ["Income", "House Expenses", "Expenses"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "money",
		},
		expensesMonthly: {
			dataSource: "splitByYearMonth",
			types: ["Income", "House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
		},
		portfolio: {
			dataSource: "splitDailyDates",
			types: ["Portfolio"],
			output: "generateDailyDataSet",
			beginAtZero: false,
			chartLabelType: "money",
		},
		incomeYearly: {
			dataSource: "splitByYear",
			types: ["Income"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
		},
		income: {
			dataSource: "splitDailyDates",
			types: ["Income"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "money",
		},
		all: {
			dataSource: "splitDailyDates",
			types: [
				"Portfolio",
				"Income",
				"Mortgage",
				"Mortgage Rate",
				"Cotisation",
				"Dividend",
				"House Expenses",
				"Expenses",
			],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "money",
		},
		mortgage: {
			dataSource: "splitDailyDates",
			types: ["Mortgage"],
			output: "generateDailyDataSet",
			beginAtZero: false,
			chartLabelType: "money",
		},
		mortgageRate: {
			dataSource: "splitDailyDates",
			types: ["Mortgage Rate"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "percent",
		},
		dividend: {
			dataSource: "splitByYearMonth",
			types: ["Dividend", "Cotisation"],
			output: "generateSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
		},
		portfolioReport: {
			dataSource: "splitByYearMonth",
			types: [
				"Portfolio",
				"Income",
				"Cotisation",
				"Expenses",
				"House Expenses",
				"Dividend",
			],
			output: "getLastValuePerTypeForCurrentMonth",
			beginAtZero: false,
			chartLabelType: "money",
		},
		cumulativeSum: {
			dataSource: "splitByYearMonth",
			types: [
				"Portfolio",
				"Income",
				"Cotisation",
				"Expenses",
				"House Expenses",
				"Dividend",
			],
			output: "generateCumulativeSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
		},
		cumulativeSumPerTypes: {
			dataSource: "splitByYearMonth",
			types: [
				"Portfolio",
				"Income",
				"Cotisation",
				"Expenses",
				"House Expenses",
				"Dividend",
			],
			output: "generateCumulativeSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
		},
	},
	colors: COLORS,
	debounce: "1000",
	csvSeparator: ",",
};
