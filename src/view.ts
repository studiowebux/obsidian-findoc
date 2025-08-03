import FinDocPlugin from "main";
import { debounce, Notice, TextFileView, WorkspaceLeaf } from "obsidian";
import { getToday } from "utils";
import up from "icons/up";
import down from "icons/down";
import remove from "icons/remove";
import duplicate from "icons/duplicate";
import { evaluate } from "mathjs";

export const VIEW_TYPE_CSV = "csv-view";

export class CSVView extends TextFileView {
	plugin: FinDocPlugin;
	tableData: string[];
	tableHeader: string;
	div: HTMLElement;
	parent: HTMLElement;
	table: HTMLElement;

	autocompleteData: { category: string; subcategory: string }[]; // store entries for local autocomplete

	constructor(leaf: WorkspaceLeaf, plugin: FinDocPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewData() {
		return this.tableData.join("\n");
	}

	dropdown(selected = ""): HTMLElement {
		const id = new Date().getTime().toString();
		const dropdown = this.contentEl.createEl("select");
		dropdown.id = id;
		dropdown.setAttribute("value", selected);
		dropdown.onchange = () => {
			dropdown.setAttribute("value", dropdown.value);
		};

		this.plugin.settings.categories.forEach((option: string) => {
			const opt = this.contentEl.createEl("option");
			opt.value = option;
			opt.id = id + option.replace(" ", "_");
			opt.innerText = option;
			if (option === selected) opt.selected = true;
			dropdown.appendChild(opt);
		});

		return dropdown;
	}

	match(
		term: string,
		inputs: { category: string; subcategory: string }[],
	): { category: string; subcategory: string }[] {
		return inputs.filter(
			(input: { category: string; subcategory: string }) =>
				input.subcategory.toLowerCase().includes(term.toLowerCase()),
		);
	}

	autocomplete(el: string, tr: HTMLTableRowElement): HTMLElement {
		const id = new Date().getTime().toString();
		const container = this.contentEl.createEl("div");
		container.id = `container-${id}`;
		container.addClasses(["findoc-autocomplete-container"]);

		const ul = container.createEl("ul");
		ul.id = `results-${id}`;
		ul.addClasses(["findoc-autocomplete-list"]);

		const input = container.createEl("div");
		input.contentEditable = "true";
		input.innerText = el;

		input.onkeyup = (ev: KeyboardEvent) => {
			ul.empty();
			const val = (ev.target as HTMLElement).innerText;

			if (val.length >= this.plugin.settings.minCharsToMatch) {
				const list = this.match(val, this.autocompleteData);

				if (list?.length > 0) {
					ul.addClasses(["findoc-autocomplete-list-opened"]);
				} else {
					ul.empty();
					ul.removeClasses(["findoc-autocomplete-list-opened"]);
				}

				list.forEach((listItem) => {
					const li = ul.createEl("li");
					li.innerText =
						`${listItem.subcategory} (${listItem.category})`;
					li.onClickEvent((ev: MouseEvent) => {
						input.innerText = listItem.subcategory;
						this.updateSelectValue(tr, listItem.category);
						ul.empty();
						ul.removeClasses(["findoc-autocomplete-list-opened"]);
						this.saveData();
						return;
					});
				});
			}
		};

		// FIXME: Not super clean. need to detect if at least a changes as been made.
		input.onblur = (ev: FocusEvent) => {
			if (!ev.relatedTarget) return;
			ul.empty();
			ul.removeClasses(["findoc-autocomplete-list-opened"]);
			this.saveData();
			return;
		};

		return container;
	}

	createTable(data: string[]) {
		this.div = this.contentEl.createDiv();
		this.table = this.div.createEl("table");

		//
		// Table Header
		//
		this.tableHeader = data[0];
		const headers = this.tableHeader.split(
			this.plugin.settings.csvSeparator,
		);
		const trHeaders = this.contentEl.createEl("tr");
		headers.forEach((header) => {
			const th = this.contentEl.createEl("th");
			th.innerText = header;
			trHeaders.appendChild(th);
		});
		this.table.appendChild(trHeaders);

		//
		// Table Content
		//
		data.slice(1).forEach((line) => {
			const trContent = this.contentEl.createEl("tr");

			const lineData = line.split(this.plugin.settings.csvSeparator);
			lineData.push("ACTION");
			lineData.forEach((el, idx) => {
				const td = this.contentEl.createEl("td");
				td.id = `data_${idx}`;
				td.classList.add("findoc-line-data");
				if (idx === 0) {
					// DROPDOWN Column
					td.appendChild(this.dropdown(el));
				} else if (idx === 1 && this.plugin.settings.useAutocomplete) {
					// AUTOCOMPLETE Column
					td.appendChild(this.autocomplete(el, trContent));
				} else if (idx === 2) {
					// VALUE Column
					td.innerText = el;
					td.contentEditable = "true";
					td.onblur = (_) => {
						const input = td.innerText
							.replaceAll(/<.*?>/g, "")
							.replaceAll(/&(?:amp;)+nbsp;/g, "")
							.replaceAll(
								'&lt;br class="Apple-interchange-newline"&gt',
								"",
							);
						try {
							td.innerText = evaluate(input) ?? 0;
						} catch (_) {
							td.innerText = input;
						}
					};
				} else if (idx === lineData.length - 1) {
					// ACTIONS Column
					td.appendChild(this.createBtnRemoveLine(trContent));
					td.appendChild(this.createBtnMoveUp(trContent));
					td.appendChild(this.createBtnMoveDown(trContent));
					td.appendChild(this.createBtnDuplicate(trContent));
				} else {
					td.innerText = el;
					td.contentEditable = "true";
				}

				trContent.appendChild(td);
			});
			this.table.appendChild(trContent);
		});

		this.div.appendChild(this.table);
		this.parent.appendChild(this.table);

		this.createBtnAddLine();
		this.createBtnSort();
		if (this.plugin.settings.useAutocomplete) {
			this.createBtnRefreshAutocomplete();
		}

		this.createSectionInformation();
	}

	createBtnRemoveLine(el: HTMLElement): HTMLElement {
		const btn = this.contentEl.createEl("button");

		btn.classList.add("findoc-btn-margin-top");
		btn.id = "deleteRow";
		btn.innerHTML = remove();
		btn.onClickEvent(() => {
			el.remove();
			this.saveData();
		});

		return btn;
	}

	createBtnMoveUp(el: HTMLElement): HTMLElement {
		const btn = this.contentEl.createEl("button");

		btn.classList.add("findoc-btn-margin-top");
		btn.id = "moveUpRow";
		btn.innerHTML = up();
		btn.onClickEvent(() => {
			const children = Array.from(this.table.children);
			const idx = children.indexOf(el);
			if (idx - 1 === 0) return;
			else this.table.insertBefore(children[idx], children[idx - 1]);
			this.saveData();
		});

		return btn;
	}

	createBtnMoveDown(el: HTMLElement): HTMLElement {
		const btn = this.contentEl.createEl("button");

		btn.classList.add("findoc-btn-margin-top");
		btn.id = "moveDownRow";
		btn.innerHTML = down();
		btn.onClickEvent(() => {
			const children = Array.from(this.table.children);
			const idx = children.indexOf(el);
			if (idx + 1 >= children.length) return;
			else this.table.insertAfter(children[idx], children[idx + 1]);
			this.saveData();
		});

		return btn;
	}

	createBtnDuplicate(el: HTMLElement): HTMLElement {
		const btn = this.contentEl.createEl("button");

		btn.classList.add("findoc-btn-margin-top");
		btn.id = "duplicateRow";
		btn.innerHTML = duplicate();
		btn.onClickEvent(() => {
			this.addLine(this.getLine(el as HTMLTableRowElement));
			this.saveData();
		});

		return btn;
	}

	createBtnAddLine() {
		const btn = this.contentEl.createEl("button");
		btn.classList.add("findoc-btn-margin-top", "findoc-btn-margin-right");
		btn.id = "newRow";
		btn.innerText = "Add New Row";
		btn.onClickEvent(() => {
			if (this.plugin.settings.useLastElementAsTemplate) {
				this.addLine(
					this.getLine(this.table.lastChild as HTMLTableRowElement),
				);
			} else {
				this.addLine([
					this.plugin.settings.categories[0],
					"",
					"0",
					getToday(),
					"",
					"ACTION",
				]);
			}
		});
		this.parent.appendChild(btn);
	}

	getTableData() {
		const rows = this.table.innerHTML.split(new RegExp(/<tr.*?>/));
		return rows.map((column) =>
			column
				.split(new RegExp(/<td.*?>/))
				.slice(1)
				.filter((i) => !new RegExp(/<button.*?>.*<.*?>/).test(i))
				.map((i, idx) => {
					if (idx === 0) {
						// Select (Dropdown)
						return (
							i.split('value="')[1].split('"')[0] ||
							this.plugin.settings.categories[0]
						);
					} else if (
						idx === 1 &&
						this.plugin.settings.useAutocomplete
					) {
						// autocomplete
						return i
							.split(/<div/)[2]
							.replaceAll(/<.*?>/g, "")
							.replaceAll(/(.*?)>/g, "") // unclosed html tag, due to the split
							.replaceAll(/&(?:amp;)+nbsp;/g, "")
							.replaceAll(
								'&lt;br class="Apple-interchange-newline"&gt',
								"",
							);
					} else if (idx === 2) {
						// Value column only.
						const input = i
							.replaceAll(/<.*?>/g, "")
							.replaceAll(/&(?:amp;)+nbsp;/g, "")
							.replaceAll(
								'&lt;br class="Apple-interchange-newline"&gt',
								"",
							);
						try {
							return evaluate(input) ?? 0;
						} catch (_) {
							return input;
						}
					} else {
						// Input field
						const input = i
							.replaceAll(/<.*?>/g, "")
							.replaceAll(/&(?:amp;)+nbsp;/g, "")
							.replaceAll(
								'&lt;br class="Apple-interchange-newline"&gt',
								"",
							);
						return input;
					}
				})
				.join(this.plugin.settings.csvSeparator)
		);
	}

	sortByDate(data: string[]) {
		return data.sort(
			(a, b) =>
				// by date
				new Date(
					a.split(this.plugin.settings.csvSeparator)[3],
				).getTime() -
				new Date(
					b.split(this.plugin.settings.csvSeparator)[3],
				).getTime(),
		);
	}

	getMinMaxDate() {
		const dates = this.tableData
			.map((data) =>
				new Date(
					data.split(this.plugin.settings.csvSeparator)[3],
				).getTime()
			)
			.filter((input) => !isNaN(input));

		return {
			min: new Date(Math.min(...dates)).toISOString().slice(0, 10),
			max: new Date(Math.max(...dates)).toISOString().slice(0, 10),
		};
	}

	createBtnSort() {
		const btn = this.contentEl.createEl("button");
		btn.classList.add("findoc-btn-margin-top", "findoc-btn-margin-right");
		btn.id = "sortByDate";
		btn.innerText = "Sort by Date";
		btn.onClickEvent(() => {
			this.tableData = this.sortByDate(this.getTableData()).filter(
				(r) => r.length !== 0,
			); // Clear empty lines

			this.tableData = [this.tableHeader, ...this.tableData];
			this.setViewData(this.tableData.join("\n"), true);
			this.saveData();
		});
		this.parent.appendChild(btn);
	}

	createSectionInformation() {
		const div = this.contentEl.createEl("div");
		div.classList.add("findoc-section-margin-top");
		div.id = "information";

		const p = div.createEl("p");
		const dates = this.getMinMaxDate();
		p.innerText =
			`Rows Count: ${this.tableData.length}\n Min Date: ${dates.min}\n Max Date: ${dates.max}`;
		div.appendChild(p);

		this.parent.appendChild(div);
	}

	createBtnRefreshAutocomplete() {
		const btn = this.contentEl.createEl("button");
		btn.classList.add("findoc-btn-margin-top");
		btn.id = "refreshAutocompleteFieldsRow";
		btn.innerText = "Refresh Autocomplete fields";
		btn.onclick = () => {
			this.refreshAutocomplete();
			new Notice("Autocomplete refreshed !", 2005);
		};
		this.parent.appendChild(btn);
	}

	refreshAutocomplete() {
		this.autocompleteData = [
			...new Map(
				this.tableData
					.map((subcategory) => ({
						category: subcategory.split(
							this.plugin.settings.csvSeparator,
						)[0],
						subcategory: subcategory.split(
							this.plugin.settings.csvSeparator,
						)[1],
					}))
					.map((item: { subcategory: string; category: string }) => [
						item["subcategory"],
						item,
					]),
			).values(),
		];
	}

	getSelectValue(tr: HTMLTableRowElement) {
		return (tr.children.item(0).firstChild as HTMLSelectElement).value;
	}

	// FIXME: Not sure for that one.
	updateSelectValue(tr: HTMLTableRowElement, newValue: string) {
		(tr.children.item(0).firstChild as HTMLSelectElement).setAttribute(
			"value",
			newValue,
		);
		(tr.children.item(0).firstChild as HTMLSelectElement).value = newValue;
	}

	getLine(tr: HTMLTableRowElement) {
		return [
			(tr.children.item(0).firstChild as HTMLSelectElement).value, // we want the current value of the select element.
			(tr.children.item(1) as HTMLElement).innerText,
			(tr.children.item(2) as HTMLElement).innerText,
			(tr.children.item(3) as HTMLElement).innerText,
			(tr.children.item(4) as HTMLElement).innerText,
			"ACTION",
		];
	}

	addLine(lineData: string[]) {
		const trContent = this.contentEl.createEl("tr");

		lineData.forEach((el, idx) => {
			const td = this.contentEl.createEl("td");
			td.classList.add("findoc-line-data");
			if (idx === 0) {
				// DROPDOWN Column
				td.appendChild(this.dropdown(el));
			} else if (idx === 1 && this.plugin.settings.useAutocomplete) {
				// AUTOCOMPLETE Column
				td.appendChild(this.autocomplete(el, trContent));
			} else if (idx === 2) {
				// VALUE Column
				td.innerText = el;
				td.contentEditable = "true";
				td.onblur = (_) => {
					const input = td.innerText
						.replaceAll(/<.*?>/g, "")
						.replaceAll(/&(?:amp;)+nbsp;/g, "")
						.replaceAll(
							'&lt;br class="Apple-interchange-newline"&gt',
							"",
						);
					try {
						td.innerText = evaluate(input) ?? 0;
					} catch (_) {
						td.innerText = input;
					}
				};
			} else if (idx === lineData.length - 1) {
				td.appendChild(this.createBtnRemoveLine(trContent));
				td.appendChild(this.createBtnMoveUp(trContent));
				td.appendChild(this.createBtnMoveDown(trContent));
				td.appendChild(this.createBtnDuplicate(trContent));
			} else {
				td.innerText = el;
				td.contentEditable = "true";
			}
			trContent.appendChild(td);
		});
		this.table.appendChild(trContent);
	}

	setViewData(data: string, clear: boolean) {
		if (clear) this.clear();
		this.tableData = data.split("\n");

		if (this.plugin.settings.useAutocomplete) {
			// Extract Autocomplete Data
			this.autocompleteData = [
				...new Map(
					data
						.split("\n")
						.map((subcategory) => ({
							category: subcategory.split(
								this.plugin.settings.csvSeparator,
							)[0],
							subcategory: subcategory.split(
								this.plugin.settings.csvSeparator,
							)[1],
						}))
						.map(
							(item: {
								subcategory: string;
								category: string;
							}) => [item["subcategory"], item],
						),
				).values(),
			];
		}
		this.parent = this.contentEl.createDiv();
		this.createTable(this.tableData);

		// Margin to avoid having the iphone keyboard hide last lines
		this.parent.classList.add("findoc-csv-parent");
		this.refresh();
	}

	refresh() {
		this.table.oninput = debounce(() => {
			this.saveData();
		}, parseInt(this.plugin.settings.debounce) || 1000);
	}

	saveData() {
		this.tableData = this.getTableData()
			// Clear empty lines
			.filter((r) => r.length !== 0);

		this.tableData = [this.tableHeader, ...this.tableData];
		this.requestSave();

		// TODO: Replace this timeout with the proper and recommended way.
		new Notice("Saving in progress...", 2005);
		this.refreshAutocomplete();

		document.getElementById("information").remove();
		this.createSectionInformation();
	}

	clear() {
		this.tableData = [];
		if (this.div) this.div.empty();
		if (this.parent) this.parent.empty();
		this.contentEl.empty();
	}

	getViewType() {
		return VIEW_TYPE_CSV;
	}
}
