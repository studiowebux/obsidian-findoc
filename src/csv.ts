import { IInput } from "types";

export function getData(csv: string, separator = ","): Array<IInput> {
	return csv
		.split("\n")
		.filter(
			(line, idx) =>
				idx !== 0 && line !== "" && line.split(separator).length === 5,
		)
		.filter((line) => line !== "")
		.map((line) => {
			return {
				category: line.split(separator)[0],
				subcategory: line.split(separator)[1],
				value: parseFloat(line.split(separator)[2]) !== 0
					? parseFloat(line.split(separator)[2])
					: 0,
				timestamp: new Date(line.split(separator)[3]),
				extra: line.split(separator)[4],
			};
		})
		.sort((a, b) => {
			const leftDateStr = a.timestamp;
			const rightDateStr = b.timestamp;

			const leftTime = new Date(leftDateStr).getTime();
			const rightTime = new Date(rightDateStr).getTime();

			// Handle NaN cases - invalid dates go to the end
			if (isNaN(leftTime) && isNaN(rightTime)) return 0;
			if (isNaN(leftTime)) return 1; // left goes to end
			if (isNaN(rightTime)) return -1; // right goes to end

			return leftTime - rightTime; // ascending order (oldest first)
		});
}
