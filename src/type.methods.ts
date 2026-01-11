import { IDataSourceKeys, IDataset, IInput, IReportData, IReportMultiData } from "types";

export type generatorFuncParams = {
	categoriesToSelect: string[];
	input: { [key: string]: IInput[] };
	labels: string[];
	categories: string[];
	colors: string[];
};
export type generatorFuncParams1 = {
	categoriesToSelect: string[];
	input: { [key: string]: IInput[] };
	date: string | undefined;
	snapshotCategories?: string[];
};
export type generatorFuncParams2 = {
	categoriesToSelect: string[];
	input: { [key: string]: IInput[] };
	labels: string[];
	colors: string[];
	values: string[]; // Example: [Income, Expenses]
};
export type generatorFuncParams3 = {
	categoriesToSelect: string[];
	input: { [key: string]: IInput[] };
	values: string[]; // Example: [Income, Expenses]
};
export type generatorFuncParams4 = {
	categoriesToSelect: string[];
	input: { [key: string]: IInput[] };
	labels: string[];
	colors: string[];
};

// TODO: determine the output of the split function. 
export type splitFunc = (input: Array<IInput | any>, key: IDataSourceKeys) => any;
export type generatorFunc = (
	params:
		| generatorFuncParams
		| generatorFuncParams1
		| generatorFuncParams2
		| generatorFuncParams3
		| generatorFuncParams4
) => IReportData | IDataset | IReportMultiData;
