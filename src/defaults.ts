import { IPluginSettings } from "types";

export const HEADER = "Category,Subcategory,Value,TimeStamp,Extra";

export const COLORS: string[] = [
	// Original colors (29 colors)
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
	
	// Additional vibrant colors (21 new colors)
	"#ff4757", // Red
	"#2ed573", // Green
	"#1e90ff", // Blue
	"#ffa502", // Orange
	"#ff6348", // Coral
	"#70a1ff", // Light Blue
	"#5352ed", // Indigo
	"#ff3838", // Bright Red
	"#2f3542", // Dark Gray
	"#57606f", // Gray
	"#a4b0be", // Light Gray
	"#ff9ff3", // Pink
	"#54a0ff", // Sky Blue
	"#5f27cd", // Purple
	"#00d2d3", // Turquoise
	"#ff9f43", // Light Orange
	"#10ac84", // Teal
	"#ee5a6f", // Rose
	"#c44569", // Magenta
	"#f8b500", // Amber
	"#6c5ce7", // Lavender
	
	// Earthy & Professional colors (15 new colors)
	"#8d6e63", // Brown
	"#795548", // Dark Brown
	"#607d8b", // Blue Gray
	"#546e7a", // Dark Blue Gray
	"#78909c", // Light Blue Gray
	"#90a4ae", // Very Light Blue Gray
	"#6d4c41", // Dark Brown
	"#5d4037", // Very Dark Brown
	"#455a64", // Dark Gray Blue
	"#37474f", // Very Dark Gray Blue
	"#263238", // Almost Black
	"#424242", // Dark Gray
	"#616161", // Medium Gray
	"#757575", // Light Medium Gray
	"#9e9e9e", // Light Gray
	
	// Pastel colors (15 new colors)
	"#ffeaa7", // Pastel Yellow
	"#fab1a0", // Pastel Orange
	"#ff7675", // Pastel Red
	"#fd79a8", // Pastel Pink
	"#fdcb6e", // Pastel Gold
	"#e17055", // Pastel Brown
	"#81ecec", // Pastel Cyan
	"#74b9ff", // Pastel Blue
	"#a29bfe", // Pastel Purple
	"#6c5ce7", // Pastel Indigo
	"#00b894", // Pastel Green
	"#00cec9", // Pastel Teal
	"#55a3ff", // Pastel Light Blue
	"#fd79a8", // Pastel Rose
	"#fdcb6e", // Pastel Amber
	
	// Neon & Electric colors (10 new colors)
	"#ff0080", // Electric Pink
	"#00ff00", // Electric Green
	"#00ffff", // Electric Cyan
	"#ff00ff", // Electric Magenta
	"#ffff00", // Electric Yellow
	"#8000ff", // Electric Purple
	"#ff8000", // Electric Orange
	"#0080ff", // Electric Blue
	"#80ff00", // Electric Lime
	"#ff0040", // Electric Red
	
	// Metallic & Rich colors (10 new colors)
	"#b8860b", // Dark Goldenrod
	"#cd853f", // Peru
	"#daa520", // Goldenrod
	"#b22222", // Fire Brick
	"#dc143c", // Crimson
	"#800080", // Purple
	"#4b0082", // Indigo
	"#008b8b", // Dark Cyan
	"#556b2f", // Dark Olive Green
	"#8b4513", // Saddle Brown
];

export const DEFAULT_SETTINGS: IPluginSettings = {
	chartLabelTypes: ["money", "percent", "generic", "custom"],
	minCharsToMatch: 1,
	useAutocomplete: true,
	categories: [
		"Portfolio",
		"Income",
		"Mortgage",
		"Mortgage Rate",
		"Cotisation",
		"Dividend",
		"House Expenses",
		"Expenses",
		"Debt",
		"Generic",
	],
	useLastElementAsTemplate: true,
	models: {
		expenses: {
			dataSource: "splitDailyDates",
			categories: ["Income", "House Expenses", "Expenses"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		expensesMonthly: {
			dataSource: "splitByYearMonth",
			categories: ["Income", "House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		portfolio: {
			dataSource: "splitDailyDates",
			categories: ["Portfolio"],
			output: "generateDailyDataSet",
			beginAtZero: false,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		incomeYearly: {
			dataSource: "splitByYear",
			categories: ["Income"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		income: {
			dataSource: "splitDailyDates",
			categories: ["Income"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		all: {
			dataSource: "splitDailyDates",
			categories: [
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
			dataSourceKey: "timestamp",
			values: "",
		},
		mortgage: {
			dataSource: "splitDailyDates",
			categories: ["Mortgage"],
			output: "generateDailyDataSet",
			beginAtZero: false,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		mortgageRate: {
			dataSource: "splitDailyDates",
			categories: ["Mortgage Rate"],
			output: "generateDailyDataSet",
			beginAtZero: true,
			chartLabelType: "percent",
			dataSourceKey: "timestamp",
			values: "",
		},
		dividend: {
			dataSource: "splitByYearMonth",
			categories: ["Dividend", "Cotisation"],
			output: "generateSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		portfolioReport: {
			dataSource: "splitByYearMonth",
			categories: [
				"Portfolio",
				"Income",
				"Cotisation",
				"Expenses",
				"House Expenses",
				"Dividend",
				"Debt",
			],
			output: "getLastValuePerTypeForCurrentMonth",
			beginAtZero: false,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		cumulativeSum: {
			dataSource: "splitByYearMonth",
			categories: [
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
			dataSourceKey: "timestamp",
			values: "",
		},
		cumulativeSumPerTypes: {
			dataSource: "splitByYearMonth",
			categories: [
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
			dataSourceKey: "timestamp",
			values: "",
		},
		cumulativeSumForCotisationSplitByExtra: {
			dataSource: "splitBy",
			categories: ["Cotisation"],
			output: "generateCumulativeSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "extra",
			values: "",
		},
		incomeMinusExpensesByYearMonth: {
			dataSource: "splitByYearMonth",
			categories: ["Income", "Expenses"],
			output: "generateDifference",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Income, Expenses", // Yield: Income - Expenses
		},
		expensesPlusHouseExpensesByYearMonth: {
			dataSource: "splitByYearMonth",
			categories: ["Expenses", "House Expenses"],
			output: "generateSum",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Expenses, House Expenses", // Yield: Expenses + House Expenses
		},
		incomeMinusExpensesByYearMonthReport: {
			dataSource: "splitByYearMonth",
			categories: ["Income", "Expenses"],
			output: "reportDifference",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Income, Expenses", // Yield: Income - Expenses
		},
		expensesPlusHouseExpensesByYearMonthReport: {
			dataSource: "splitByYearMonth",
			categories: ["Expenses", "House Expenses"],
			output: "reportSum",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Expenses, House Expenses", // Yield: Expenses + House Expenses
		},
		incomeMinusExpensesByDaily: {
			dataSource: "splitDailyDates",
			categories: ["Income", "Expenses"],
			output: "generateCumulativeDifference",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Income, Expenses", // Yield: Income - Expenses
		},
		incomesExpensesYearly: {
			dataSource: "splitByYear",
			categories: ["Income", "House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		expensesOnlyMonthly: {
			dataSource: "splitByYearMonth",
			categories: ["House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		expensesOnlyDaily: {
			dataSource: "splitDailyDates",
			categories: ["House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
		expensesOnlyYearly: {
			dataSource: "splitByYear",
			categories: ["House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},

		// NEW MODELS WITH NEW PROCESSING FUNCTIONS

		expensesQuarterly: {
			dataSource: "splitByQuarter",
			categories: ["House Expenses", "Expenses"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},

		incomeWeekly: {
			dataSource: "splitByWeek",
			categories: ["Income"],
			output: "generateSumDataSet",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},

		portfolioByValueRange: {
			dataSource: "splitByValueRange",
			categories: ["Portfolio"],
			output: "generateSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "value",
			values: "",
		},

		expensesMonthlyBreakdown: {
			dataSource: "splitByYearMonth",
			categories: ["House Expenses", "Expenses"],
			output: "generateSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},

		allCategoriesBreakdown: {
			dataSource: "splitByCategory",
			categories: ["Portfolio", "Income", "House Expenses", "Expenses", "Dividend"],
			output: "generateSumDataSetPerTypes",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "category",
			values: "",
		},

		// REPORT MODELS FOR TABLE VIEW

		portfolioReportTable: {
			dataSource: "splitByYearMonth",
			categories: ["Portfolio", "Income", "Cotisation", "Expenses", "House Expenses", "Dividend", "Debt"],
			output: "getLastValuePerTypeForCurrentMonth",
			beginAtZero: false,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},

		quarterlyIncomeExpenseReport: {
			dataSource: "splitByQuarter",
			categories: ["Income", "House Expenses", "Expenses"],
			output: "reportSum",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "Income, House Expenses, Expenses",
		},

		weeklyExpenseAnalysis: {
			dataSource: "splitByWeek",
			categories: ["House Expenses", "Expenses"],
			output: "reportSum",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "House Expenses, Expenses",
		},

		// DIVIDEND ANALYSIS MODELS

		dividendMonthlyBySymbol: {
			dataSource: "splitByYearMonth",
			categories: ["Dividend"],
			output: "generateDividendMonthlyBySymbol",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},

		dividendCumulativeBySymbol: {
			dataSource: "splitByYearMonth",
			categories: ["Dividend"],
			output: "generateCumulativeDividendBySymbol",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},

		dividendAnalysisReport: {
			dataSource: "splitByYearMonth",
			categories: ["Dividend"],
			output: "reportDividendAnalysis",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},

		// Quarterly dividend analysis for radar charts
		dividendQuarterlyBySymbol: {
			dataSource: "splitByQuarter",
			categories: ["Dividend"],
			output: "generateDividendMonthlyBySymbol",
			beginAtZero: true,
			chartLabelType: "money",
			dataSourceKey: "timestamp",
			values: "",
		},
	},
	colors: COLORS,
	debounce: "1000",
	csvSeparator: ",",
	version: "0.8.0",
};
