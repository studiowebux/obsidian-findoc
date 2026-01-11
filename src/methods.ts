/*
 *	Functions to process the data
 */

import { generatorFunc, splitFunc } from "type.methods";
import {
	IInput,
	IDataset,
	IContext,
	IReportData,
	IDataSourceKeys,
	IReportEntries,
	IReportMultiData,
} from "types";
import { getDate, getMonth, skipped } from "utils";

export const splitBy: { [key: string]: { help: string; exec: splitFunc } } = {
	// SPLIT DATA (PREPARATION)
	splitBy: {
		help: "Split by custom key",
		exec: (input: Array<IInput | any>, key: IDataSourceKeys) => {
			return input.reduce((acc, current) => {
				if (!acc[current[key]]) {
					acc[current[key]] = [];
				}
				acc[current[key]].push(current);
				return acc;
			}, {});
		},
	},

	splitByYear: {
		help: "Split by year",
		exec: (input: Array<IInput | any>, key: IDataSourceKeys) => {
			return input.reduce((acc, current) => {
				const d = new Date(current[key]);
				const timestamp = `${d.getUTCFullYear()}`;
				if (!acc[timestamp]) {
					acc[timestamp] = [];
				}
				acc[timestamp].push(current);
				return acc;
			}, {});
		},
	},

	splitByYearMonth: {
		help: "Split by year/month",
		exec: (input: Array<IInput | any>, key: IDataSourceKeys) => {
			return input.reduce((acc, current) => {
				const d = new Date(current[key]);
				const timestamp = `${d.getUTCFullYear()}-${getMonth(d)}`;
				if (!acc[timestamp]) {
					acc[timestamp] = [];
				}
				acc[timestamp].push(current);
				return acc;
			}, {});
		},
	},

	splitDailyDates: {
		help: "Split by daily",
		exec: (input: Array<IInput | any>, key: IDataSourceKeys) => {
			return input.reduce((acc, current) => {
				const d = new Date(current[key]);
				const timestamp = `${d.getUTCFullYear()}-${getMonth(
					d
				)}-${getDate(d)}`;
				if (!acc[timestamp]) {
					acc[timestamp] = [];
				}
				acc[timestamp].push(current);
				return acc;
			}, {});
		},
	},

	splitByQuarter: {
		help: "Split by quarter (Q1, Q2, Q3, Q4)",
		exec: (input: Array<IInput | any>, key: IDataSourceKeys) => {
			return input.reduce((acc, current) => {
				const d = new Date(current[key]);
				const quarter = Math.floor(d.getUTCMonth() / 3) + 1;
				const timestamp = `${d.getUTCFullYear()}-Q${quarter}`;
				if (!acc[timestamp]) {
					acc[timestamp] = [];
				}
				acc[timestamp].push(current);
				return acc;
			}, {});
		},
	},

	splitByWeek: {
		help: "Split by week (ISO week number)",
		exec: (input: Array<IInput | any>, key: IDataSourceKeys) => {
			return input.reduce((acc, current) => {
				const d = new Date(current[key]);
				// Calculate ISO week number
				const d1 = new Date(d);
				d1.setHours(0, 0, 0, 0);
				// Set to Thursday of this week (ISO week starts on Monday)
				d1.setDate(d1.getDate() + 3 - (d1.getDay() + 6) % 7);
				// Get first Thursday of year
				const year = d1.getFullYear();
				const d2 = new Date(year, 0, 4);
				// Calculate week number
				const weekNumber = Math.round((d1.getTime() - d2.getTime()) / 86400000 / 7) + 1;
				const timestamp = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
				if (!acc[timestamp]) {
					acc[timestamp] = [];
				}
				acc[timestamp].push(current);
				return acc;
			}, {});
		},
	},

	splitBySubcategory: {
		help: "Split by subcategory",
		exec: (input: Array<IInput | any>, key: IDataSourceKeys) => {
			return input.reduce((acc, current) => {
				const subcategory = current.subcategory || 'Unknown';
				if (!acc[subcategory]) {
					acc[subcategory] = [];
				}
				acc[subcategory].push(current);
				return acc;
			}, {});
		},
	},

	splitByValueRange: {
		help: "Split by value ranges (Small: <100, Medium: 100-1000, Large: >1000)",
		exec: (input: Array<IInput | any>, key: IDataSourceKeys) => {
			return input.reduce((acc, current) => {
				const value = Math.abs(current.value || 0);
				let range: string;
				if (value < 100) {
					range = 'Small (<100)';
				} else if (value <= 1000) {
					range = 'Medium (100-1000)';
				} else {
					range = 'Large (>1000)';
				}
				if (!acc[range]) {
					acc[range] = [];
				}
				acc[range].push(current);
				return acc;
			}, {});
		},
	},

	splitByCategory: {
		help: "Split by category",
		exec: (input: Array<IInput | any>, key: IDataSourceKeys) => {
			return input.reduce((acc, current) => {
				const category = current.category || 'Unknown';
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(current);
				return acc;
			}, {});
		},
	},
};

export const functions: {
	[key: string]: { help: string; exec: generatorFunc };
} = {
	// GENERATORS

	generateSumDataSet: {
		help: "Generate Sum Dataset",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			categories,
			colors,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			categories: string[];
			colors: string[];
		}): IDataset => {
			const usableColors = [...colors];
			const datasets = categories.map((category) => {
				const color = usableColors[0];
				usableColors.shift();

				return {
					label: category,
					borderColor: color,
					fill: false,
					tension: 0.2,
					spanGaps: true,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: labels
						.map((label: string) => {
							return input[label]
								.filter((i: IInput) =>
									categoriesToSelect.includes(i.category)
								)
								.reduce(
									(
										categories: { [key: string]: number },
										current: IInput
									) => {
										if (!categories[current.subcategory])
											categories[current.subcategory] = 0;
										categories[current.subcategory] +=
											current.value;
										return categories;
									},
									{}
								);
						})
						.reduce((typeSum, current) => {
							if (current[category])
								typeSum.push(current[category]);
							else typeSum.push(0);
							return typeSum;
						}, []),
				};
			});
			return {
				labels,
				datasets,
			};
		},
	},

	generateDailyDataSet: {
		help: "Generate Daily Dataset (last value for snapshots, sum for transactions)",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			categories,
			colors,
			snapshotCategories = undefined,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			categories: string[];
			colors: string[];
			snapshotCategories: string[] | undefined;
		}): IDataset => {
			const nonEmptyLabels: string[] = [];
			const usableColors = [...colors];
			const snapshotSet = new Set(snapshotCategories || []);
			const isSnapshotMode = snapshotCategories === undefined;

			const datasets = categories.map((category) => {
				const color = usableColors[0];
				usableColors.shift();
				return {
					label: category,
					borderColor: color,
					fill: false,
					tension: 0.2,
					spanGaps: true,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: labels
						.map((label: string) => {
							const categoriesFound = input[label]
								.filter((i: IInput) =>
									categoriesToSelect.includes(i.category)
								)
								.reduce(
									(
										acc: { [key: string]: number },
										current: IInput
									) => {
										if (!acc[current.subcategory])
											acc[current.subcategory] = 0;
										// Snapshot categories use last value, others sum
										const useSnapshot = isSnapshotMode || snapshotSet.has(current.category);
										if (useSnapshot) {
											acc[current.subcategory] = current.value;
										} else {
											acc[current.subcategory] += current.value;
										}
										return acc;
									},
									{}
								);
							if (
								Object.keys(categoriesFound).length > 0 &&
								!nonEmptyLabels.includes(label)
							)
								nonEmptyLabels.push(label);

							return categoriesFound;
						})
						.filter((current) => {
							let total = 0;
							Object.values(current).forEach((c: number) => {
								total += c;
							});

							if (total === 0) return null;
							return current;
						})
						.reduce((typeSum, current) => {
							if (current[category])
								typeSum.push(current[category]);
							else typeSum.push(NaN);
							return typeSum;
						}, []),
				};
			});

			return {
				labels: nonEmptyLabels,
				datasets,
			};
		},
	},

	generateSumDataSetPerTypes: {
		help: "Generate Sum Dataset Per Categories",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			colors,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			colors: string[];
		}): IDataset => {
			const usableColors = [...colors];
			const datasets = categoriesToSelect.map((category) => {
				const color = usableColors[0];
				usableColors.shift();
				return {
					label: category,
					borderColor: color,
					fill: false,
					tension: 0.2,
					spanGaps: true,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: Object.values(input).map((i) => {
						return i
							.filter((entry) => entry.category === category)
							.reduce((acc, current) => {
								acc += current.value;
								return acc;
							}, 0);
					}),
				};
			});

			return {
				labels,
				datasets,
			};
		},
	},

	getLastValuePerTypeForCurrentMonth: {
		help: "Get last value for snapshot categories, sum all for others",
		exec: ({
			categoriesToSelect,
			input,
			date = undefined,
			snapshotCategories = undefined,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			date: string | undefined;
			snapshotCategories: string[] | undefined;
		}): IReportData => {
			let d = new Date();
			if (date) d = new Date(date);

			// Select current month dataset
			const monthKey = `${d.getUTCFullYear()}-${getMonth(d)}`;
			const lastInput = input[monthKey] || [];

			// For snapshot categories: keep only last value per subcategory
			const snapshotSet = new Set(snapshotCategories || []);
			const isSnapshotMode = snapshotCategories === undefined;

			// Build deduped entries for snapshot categories
			const _lastInput: IInput[] = [];
			const seen = new Set<string>();

			// Reverse to process most recent first
			[...lastInput].reverse().forEach((li) => {
				const key = `${li.category}-${li.subcategory}`;
				if (!seen.has(key)) {
					seen.add(key);
					_lastInput.push(li);
				}
			});

			const datasets = categoriesToSelect.map((category) => {
				// If snapshotCategories is undefined (backwards compat) or category is in snapshotCategories
				// use last value per subcategory, otherwise sum all
				const useSnapshot = isSnapshotMode || snapshotSet.has(category);

				const entries = useSnapshot
					? _lastInput.filter((entry) => entry.category === category)
					: lastInput.filter((entry) => entry.category === category);

				return {
					label: category,
					data: entries.reduce((acc, current) => acc + current.value, 0),
					date: monthKey,
				};
			});

			return {
				datasets,
			};
		},
	},

	generateCumulativeSumDataSet: {
		help: "Generate Cumulative Sum Dataset",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			categories,
			colors,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			categories: string[];
			colors: string[];
		}): IDataset => {
			const usableColors = [...colors];
			const datasets = categories.map((category) => {
				const color = usableColors[0];
				usableColors.shift();

				return {
					label: category,
					borderColor: color,
					fill: false,
					tension: 0.2,
					spanGaps: true,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: labels
						.map((label: string) => {
							return input[label]
								.filter((i: IInput) =>
									categoriesToSelect.includes(i.category)
								)
								.reduce(
									(
										categories: { [key: string]: number },
										current: IInput
									) => {
										if (!categories[current.subcategory])
											categories[current.subcategory] = 0;
										categories[current.subcategory] +=
											current.value;
										return categories;
									},
									{}
								);
						})
						.reduce((typeSum, current) => {
							if (current[category])
								typeSum.push(current[category]);
							else typeSum.push(0);
							return typeSum;
						}, [])
						// Cumulative Sum
						.map(
							(value: number, index: number, array: number[]) =>
								value +
								array
									.slice(0, index) // take previous value
									.reduce((acc, v) => (acc += v), 0) // sum all of them
						),
				};
			});
			return {
				labels,
				datasets,
			};
		},
	},

	generateCumulativeSumDataSetPerTypes: {
		help: "Generate Cumulative Sum Dataset Per Categories",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			colors,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			colors: string[];
		}): IDataset => {
			const usableColors = [...colors];
			const datasets = categoriesToSelect.map((category) => {
				const color = usableColors[0];
				usableColors.shift();
				return {
					label: category,
					borderColor: color,
					fill: false,
					tension: 0.2,
					spanGaps: true,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: Object.values(input)
						.map((i) => {
							return i
								.filter((entry) => entry.category === category)
								.reduce((acc, current) => {
									acc += current.value;
									return acc;
								}, 0);
						})
						// Cumulative Sum
						.map(
							(value, index, array) =>
								value +
								array
									.slice(0, index) // take previous value
									.reduce((acc, v) => (acc += v), 0) // sum all of them
						),
				};
			});

			return {
				labels,
				datasets,
			};
		},
	},

	generateDifference: {
		help: "Minus(Category1 - Category2)",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			colors,
			values,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			colors: string[];
			values: string[]; // Example: [Income, Expenses]
		}): IDataset => {
			const usableColors = [...colors];
			const color = usableColors[0];
			usableColors.shift();

			const dataToProcess: { [key: string]: number[] } = {};

			categoriesToSelect.forEach((category) => {
				dataToProcess[category] = Object.values(input).map((i) => {
					return i
						.filter((entry) => entry.category === category)
						.reduce((acc, current) => {
							acc += current.value;
							return acc;
						}, 0);
				});
			});

			const datasets = [
				{
					label: `${values[0]} - ${values[1]}`,
					borderColor: color,
					fill: false,
					tension: 0.2,
					spanGaps: true,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: dataToProcess[values[0].trim()].map(
						(n: number, idx: number) =>
							n - dataToProcess[values[1].trim()][idx]
					),
				},
			];

			return {
				labels,
				datasets,
			};
		},
	},

	generateCumulativeDifference: {
		help: "Minus(sum(Category1) - sum(Category2))",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			colors,
			values,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			colors: string[];
			values: string[]; // Example: [Income, Expenses]
		}): IDataset => {
			const usableColors = [...colors];
			const color = usableColors[0];
			usableColors.shift();

			const dataToProcess: { [key: string]: number[] } = {};

			categoriesToSelect.forEach((category) => {
				dataToProcess[category] = Object.values(input).map((i) => {
					return i
						.filter((entry) => entry.category === category)
						.reduce((acc, current) => {
							acc += current.value;
							return acc;
						}, 0);
				});
			});

			const datasets = [
				{
					label: `${values[0]} - ${values[1]}`,
					borderColor: color,
					fill: false,
					tension: 0.2,
					spanGaps: true,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: dataToProcess[values[0].trim()].map(
						(n: number, idx: number) =>
							n - dataToProcess[values[1].trim()][idx]
					),
				},
			];

			return {
				labels,
				datasets,
			};
		},
	},

	generateSum: {
		help: "Sum(Category1 + Category2)",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			colors,
			values,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			colors: string[];
			values: string[]; // Example: [House Expenses, Expenses]
		}): IDataset => {
			const usableColors = [...colors];
			const color = usableColors[0];
			usableColors.shift();

			const dataToProcess: { [key: string]: number[] } = {};

			categoriesToSelect.forEach((category) => {
				dataToProcess[category] = Object.values(input).map((i) => {
					return i
						.filter((entry) => entry.category === category)
						.reduce((acc, current) => {
							acc += current.value;
							return acc;
						}, 0);
				});
			});

			const datasets = [
				{
					label: `${values[0]} + ${values[1]}`,
					borderColor: color,
					fill: false,
					tension: 0.2,
					spanGaps: true,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: dataToProcess[values[0].trim()].map(
						(n: number, idx: number) =>
							n + dataToProcess[values[1].trim()][idx]
					),
				},
			];

			return {
				labels,
				datasets,
			};
		},
	},

	reportDifference: {
		help: "Report: Minus(Category1 - Category2)",
		exec: ({
			categoriesToSelect,
			input,
			values,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			values: string[]; // Example: [Income, Expenses]
		}): IReportMultiData => {
			const dataToProcess: { [key: string]: number[] } = {};

			categoriesToSelect.forEach((category) => {
				dataToProcess[category] = Object.values(input).map((i) => {
					return i
						.filter((entry) => entry.category === category)
						.reduce((acc, current) => {
							acc += current.value;
							return acc;
						}, 0);
				});
			});

			const datasets: IReportEntries = {
				label: `${values[0]} - ${values[1]}`,
				data: dataToProcess[values[0].trim()].map(
					(n: number, idx: number) =>
						n - dataToProcess[values[1].trim()][idx]
				),
				labels: Object.keys(input),
			};

			return {
				datasets,
			};
		},
	},

	reportSum: {
		help: "Report: Sum(Category1 + Category2)",
		exec: ({
			categoriesToSelect,
			input,
			values,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			values: string[]; // Example: [Income, Expenses]
		}): IReportMultiData => {
			const dataToProcess: { [key: string]: number[] } = {};

			categoriesToSelect.forEach((category) => {
				dataToProcess[category] = Object.values(input).map((i) => {
					return i
						.filter((entry) => entry.category === category)
						.reduce((acc, current) => {
							acc += current.value;
							return acc;
						}, 0);
				});
			});

			const datasets: IReportEntries = {
				label: `${values[0]} + ${values[1]}`,
				data: dataToProcess[values[0].trim()].map(
					(n: number, idx: number) =>
						n + dataToProcess[values[1].trim()][idx]
				),
				labels: Object.keys(input),
			};

			return {
				datasets,
			};
		},
	},

	// DIVIDEND ANALYSIS FUNCTIONS
	generateDividendMonthlyBySymbol: {
		help: "Generate monthly dividend data per symbol (subcategory)",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			colors,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			colors: string[];
		}): IDataset => {
			const usableColors = [...colors];
			
			// Get all unique symbols from dividend entries
			const symbols = new Set<string>();
			Object.values(input).forEach(entries => {
				entries
					.filter(entry => categoriesToSelect.includes(entry.category))
					.forEach(entry => symbols.add(entry.subcategory));
			});

			const datasets = Array.from(symbols).map((symbol) => {
				const color = usableColors[0] || "#1ac18f";
				usableColors.shift();
				
				return {
					label: symbol,
					borderColor: color,
					backgroundColor: color + "20", // Add transparency
					fill: false,
					tension: 0.2,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: labels.map(label => {
						const entries = input[label] || [];
						return entries
							.filter(entry => 
								categoriesToSelect.includes(entry.category) && 
								entry.subcategory === symbol
							)
							.reduce((sum, entry) => sum + entry.value, 0);
					}),
				};
			});

			return {
				labels,
				datasets,
			};
		},
	},

	generateCumulativeDividendBySymbol: {
		help: "Generate cumulative dividend data per symbol (subcategory)",
		exec: ({
			categoriesToSelect,
			input,
			labels,
			colors,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			labels: string[];
			colors: string[];
		}): IDataset => {
			const usableColors = [...colors];
			
			// Get all unique symbols from dividend entries
			const symbols = new Set<string>();
			Object.values(input).forEach(entries => {
				entries
					.filter(entry => categoriesToSelect.includes(entry.category))
					.forEach(entry => symbols.add(entry.subcategory));
			});

			const datasets = Array.from(symbols).map((symbol) => {
				const color = usableColors[0] || "#1ac18f";
				usableColors.shift();
				
				const monthlyData = labels.map(label => {
					const entries = input[label] || [];
					return entries
						.filter(entry => 
							categoriesToSelect.includes(entry.category) && 
							entry.subcategory === symbol
						)
						.reduce((sum, entry) => sum + entry.value, 0);
				});

				// Calculate cumulative sum
				const cumulativeData = monthlyData.map((value, index) => 
					value + monthlyData.slice(0, index).reduce((acc, v) => acc + v, 0)
				);

				return {
					label: symbol,
					borderColor: color,
					backgroundColor: color + "20",
					fill: false,
					tension: 0.2,
					segment: {
						borderColor: (ctx: IContext) => skipped(ctx, color),
						borderDash: (ctx: IContext) => skipped(ctx, [3, 3]),
					},
					data: cumulativeData,
				};
			});

			return {
				labels,
				datasets,
			};
		},
	},

	reportDividendAnalysis: {
		help: "Report: Comprehensive dividend analysis per symbol",
		exec: ({
			categoriesToSelect,
			input,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
		}): IReportMultiData => {
			// Get all dividend entries
			const dividendEntries = Object.values(input)
				.flat()
				.filter(entry => categoriesToSelect.includes(entry.category));

			// Group by symbol
			const symbolData: { [symbol: string]: IInput[] } = {};
			dividendEntries.forEach(entry => {
				if (!symbolData[entry.subcategory]) {
					symbolData[entry.subcategory] = [];
				}
				symbolData[entry.subcategory].push(entry);
			});

			const results: IReportEntries[] = [];

			Object.entries(symbolData).forEach(([symbol, entries]) => {
				const totalDividends = entries.reduce((sum, entry) => sum + entry.value, 0);
				const avgMonthlyDividend = totalDividends / new Set(entries.map(e => e.timestamp.toString().substring(0, 7))).size;
				const paymentCount = entries.length;
				const firstPayment = new Date(Math.min(...entries.map(e => new Date(e.timestamp).getTime())));
				const lastPayment = new Date(Math.max(...entries.map(e => new Date(e.timestamp).getTime())));

				results.push({
					label: symbol,
					data: [totalDividends, avgMonthlyDividend, paymentCount],
					labels: ['Total Dividends', 'Avg Monthly', 'Payment Count'],
					metadata: {
						firstPayment: firstPayment.toISOString().split('T')[0],
						lastPayment: lastPayment.toISOString().split('T')[0],
						totalValue: totalDividends,
						// Formatting hints for each data value
						formatTypes: ['money', 'money', 'generic']
					}
				});
			});

			return {
				datasets: results,
				summary: {
					totalSymbols: Object.keys(symbolData).length,
					totalDividends: dividendEntries.reduce((sum, entry) => sum + entry.value, 0),
					totalPayments: dividendEntries.length
				}
			};
		},
	},

	reportBySubcategory: {
		help: "Report: Group by subcategory (last value for snapshots, sum for transactions)",
		exec: ({
			categoriesToSelect,
			input,
			date = undefined,
			snapshotCategories = undefined,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
			date: string | undefined;
			snapshotCategories: string[] | undefined;
		}): IReportData => {
			let allEntries: IInput[];
			let dateLabel: string;

			if (date) {
				// Filter for specific month
				const d = new Date(date);
				const monthKey = `${d.getUTCFullYear()}-${getMonth(d)}`;
				allEntries = (input[monthKey] || [])
					.filter(entry => categoriesToSelect.includes(entry.category));
				dateLabel = monthKey;
			} else {
				// Use all entries across all time periods
				allEntries = Object.values(input)
					.flat()
					.filter(entry => categoriesToSelect.includes(entry.category));
				dateLabel = "All Time";
			}

			const snapshotSet = new Set(snapshotCategories || []);
			const isSnapshotMode = snapshotCategories === undefined;

			// For snapshot categories, keep only last value per subcategory
			let processedEntries: IInput[];
			if (isSnapshotMode) {
				// Backwards compat: no snapshotCategories = sum all
				processedEntries = allEntries;
			} else {
				// Separate snapshot and transaction entries
				const snapshotEntries = allEntries.filter(e => snapshotSet.has(e.category));
				const transactionEntries = allEntries.filter(e => !snapshotSet.has(e.category));

				// Dedupe snapshot entries - keep last per subcategory
				const seen = new Set<string>();
				const dedupedSnapshot: IInput[] = [];
				[...snapshotEntries].reverse().forEach((entry) => {
					if (!seen.has(entry.subcategory)) {
						seen.add(entry.subcategory);
						dedupedSnapshot.push(entry);
					}
				});

				processedEntries = [...dedupedSnapshot, ...transactionEntries];
			}

			// Group by subcategory and sum values
			const subcategoryTotals: { [subcategory: string]: number } = {};
			processedEntries.forEach(entry => {
				if (!subcategoryTotals[entry.subcategory]) {
					subcategoryTotals[entry.subcategory] = 0;
				}
				subcategoryTotals[entry.subcategory] += entry.value;
			});

			// Convert to report format
			const datasets = Object.entries(subcategoryTotals)
				.map(([subcategory, total]) => ({
					label: subcategory,
					data: total,
					date: dateLabel,
				}))
				.sort((a, b) => b.data - a.data); // Sort by total descending

			return {
				datasets,
			};
		},
	},

	reportSumByPeriod: {
		help: "Report: Sum categories by time period (for table view)",
		exec: ({
			categoriesToSelect,
			input,
		}: {
			categoriesToSelect: string[];
			input: { [key: string]: IInput[] };
		}): IReportMultiData => {
			const labels = Object.keys(input);
			const data = labels.map((label) => {
				return input[label]
					.filter((entry) => categoriesToSelect.includes(entry.category))
					.reduce((acc, current) => {
						acc += current.value;
						return acc;
					}, 0);
			});

			return {
				datasets: {
					label: categoriesToSelect.join(" + "),
					data,
					labels,
				},
			};
		},
	},
};
