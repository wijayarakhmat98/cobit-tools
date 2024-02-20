import {
	trs_df1_lo,
	trs_df1_hi
}
from 'master';

import {
	notify,
	listen,
	bubble,
	listener_click,
	listener_change,
	create_range,
	create_grid,
	create_area,
	replace_row,
	create_div,
	create_column,
	create_p,
	create_details,
	create_radio,
	create_textarea,
	create_button
}
from 'component';

class sheet extends HTMLElement {
	static state_view({} = {}) {
		return {
			mode: 'view'
		};
	}

	static state_modify({selection, value, note} = {}) {
		return {
			mode: 'modify',
			selection: selection ?? [],
			value: value ?? [],
			note: note ?? []
		};
	}

	constructor({} = {}) {
		super();
		this.state = undefined;
		this.prop = {};
		this.cache = {};
		listen({
			element: this,
			event: 'sheet-note',
			callback: ({detail} = {}) => {
				this.state.note[detail.id - 1] = detail.note;
			}
		});
		listen({
			element: this,
			event: 'sheet-select-x',
			callback: ({detail} = {}) => {
				const i = this.state.selection.findIndex(s => s.id == detail.id);
				if (detail.from == 'new') {
					const j = this.state.value.findIndex(v => v.id == detail.id);
					let v;
					if (j == -1) {
						v = {id: detail.id};
						this.state.value.push(v);
					}
					else
						v = this.state.value[j];
					v.value = detail.value;
				}
				if (detail.from == 'clear')
					for (let r of document.getElementsByName(`${detail.id} value`))
						r.checked = false;
				if ((detail.from == 'parent' || detail.from == 'clear') && i != -1)
					this.state.selection.splice(i, 1);
				else {
					const s = i != -1 ? this.state.selection[i] : {id: detail.id};
					s.from = detail.from;
					if (i == -1)
						this.state.selection.push(s);
				}
				notify({
					element: this,
					event: 'sheet-select',
					detail: {
						id: detail.id,
						value: detail.value
					},
					options: {
						bubbles: true
					}
				});
			}
		});
	}

	restore({state, load = true} = {}) {
		this.state = state;
		if (load) {
			if (this.state.mode == 'view')
				this.view();
			if (this.state.mode == 'modify')
				this.modify();
		}
	}

	view({commit, aspect, baseline} = {}) {
		if (!this.state)
			this.state = sheet.state_view();
		if (this.state.mode == 'modify')
			this.state = sheet.state_view();
		replace_row({
			element: this,
			sub_row: 1 + aspect.length,
			children: [
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Enterprise Strategy'}),
						...aspect.map(d => create_details({summary: d.dimension, detail: d.explanation}))
					]
				}),
				...(commit === null ? [] : [create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Viewing commit ${commit.id}`}),
						...create_snapshot({
							commit: commit,
							aspect: aspect,
							baseline: baseline,
						}).map(d => create_trace({
							id: d.id,
							d: d,
							checked: true
						}))
					]
				})]),
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Baseline'}),
						...baseline.map(d => create_p({text: d.value, classes: ['baseline']}))
					]
				}),
			]
		});
	}

	modify({parent, alter, merge, aspect, baseline} = {}) {
		if (!this.state)
			this.state = sheet.state_modify();
		if (this.state.mode == 'view')
			this.state = sheet.state_modify();
		this.prop = {
			parent: parent,
			alter: alter,
			merge: merge,
			aspect: aspect,
			baseline: baseline,
			selection: this.state.selection
		};
		this.cache.snapshot = [...(parent === null ? [] : [parent]), ...merge].reduce((snapshot, s) => {
			snapshot[s.id] = create_snapshot({commit: s, aspect: aspect, baseline: baseline});
			return snapshot;
		}, {});
		const context = this.context();
		replace_row({
			element: this,
			sub_row: 1 + aspect.length,
			children: [
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Enterprise Strategy'}),
						...aspect.map(d => create_details({summary: d.dimension, detail: d.explanation}))
					]
				}),
				...merge.map(s => create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Merging commit ${s.id}`}),
						...this.cache.snapshot[s.id].map(d => create_trace({
							from: s.id,
							d: d,
							checked: context[d.id - 1] == s.id
						}))
					]
				})),
				...(!alter ? [] : [create_column({
					sub_col: create_change_sub_col({lo: trs_df1_lo, hi: trs_df1_hi}),
					children: [
						create_p({text: 'Change'}),
						...aspect.map(d => create_change({
							d: d,
							lo: trs_df1_lo,
							hi: trs_df1_hi,
							checked: context[d.id - 1] == 'new' ? this.state.value[this.state.value.findIndex(v => v.id == d.id)].value : undefined,
							note_value: this.state.note[d.id - 1]
						}))
					]
				})]),
				...(parent === null ? [] : [create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Parent commit ${parent.id}`}),
						...this.cache.snapshot[parent.id].map(d => create_trace({
							from: 'parent',
							d: d,
							checked: context[d.id - 1] == parent.id
						}))
					]
				})]),
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Baseline'}),
						...baseline.map(d => create_p({text: d.value, classes: ['baseline']}))
					]
				}),
				...(parent !== null || !alter && !merge.length ? [] : [create_column({
					sub_col: 1,
					children: [
						create_p({text: ''}),
						...aspect.map(d => bubble({
							element: create_button({
								text: 'Clear',
								style: {
									height: 'min-content',
									padding: '0 0.25rem'
								}
							}),
							listener: listener_click,
							event: 'sheet-select-x',
							detail: {
								value: baseline[d.id - 1].value,
								id: d.id,
								from: 'clear'
							}
						}))
					]
				})])
			]
		});
	}

	context({} = {}) {
		return this.prop.aspect.map(d => {
			const i = this.state.selection.findIndex(s => s.id == d.id);
			if (i != -1) {
				const s = this.state.selection[i];
				if (this.prop.alter && s.from == 'new')
					return s.from;
				if (this.prop.merge.findIndex(m => m.id == s.from) != -1)
					return s.from;
			}
			if (this.prop.parent !== null)
				return this.prop.parent.id;
			return 'baseline';
		});
	}

	get x() {
		const context = this.context();
		return this.prop.aspect.map(d => {
			if (context[d.id - 1] == 'new')
				return [this.state.value[this.state.value.findIndex(v => v.id == d.id)].value];
			if (context[d.id - 1] == 'baseline')
				return [this.prop.baseline[d.id - 1].value];
			if (this.cache.snapshot[context[d.id - 1]][d.id - 1].commit == 'baseline')
				return [this.prop.baseline[d.id - 1].value];
			return [this.cache.snapshot[context[d.id - 1]][d.id - 1].value];
		});
	}
}

function create_snapshot({commit, aspect, baseline} = {}) {
	return aspect.map(d => {
		let p, c;
		for (p = commit; p !== null;)
			if (c = p.change.find(e => e.id == d.id))
				if (c.inherit)
					p = c.from;
				else
					break;
			else
				p = p.parent;
		if (p === null)
			return {
				id: d.id,
				commit: 'baseline'
			};
		else
			return {
				id: d.id,
				value: c ? c.value : baseline.find(e => e.id == d.id).value,
				note: c ? c.note : 'Baseline',
				author: p.author,
				commit: p.id,
				description: p.description
			};
	});
}

function create_change_sub_col({lo, hi} = {}) {
	return hi - lo + 2;
}

function create_change({d, lo, hi, checked, note_value, style = {}, ...args} = {}) {
	const note = create_textarea({row: 1, value: note_value});
	listener_change({
		element: note,
		callback: () => {
			notify({
				element: note,
				event: 'sheet-note',
				detail: {
					id: d.id,
					note: note.value
				},
				options: {
					bubbles: true
				}
			});
		}
	});
	return create_div({
		children: [
			...create_range({start: lo, stop: hi}).map(
				i => bubble({
					element: create_radio({
						text: i,
						checked: i == checked,
						name: `${d.id} value`,
					}),
					listener: listener_change,
					event: 'sheet-select-x',
					detail: {
						from: 'new',
						id: d.id,
						value: i
					}
				})
			),
			note
		],
		style: {
			...create_grid({col: 'subgrid'}),
			...style
		},
		...args
	});
}

function create_trace_sub_col({} = {}) {
	return 6;
}

function create_trace({from, d, checked, style = {}, ...args} = {}) {
	return create_div({
		children: d.commit == 'baseline' ? [] : [
			bubble({
				element: create_radio({
					text: d.value,
					checked: checked,
					name: `${d.id} value`,
					style: create_area({h: 2})
				}),
				listener: listener_change,
				event: 'sheet-select-x',
				detail: {
					from: from,
					id: d.id,
					value: d.value
				}
			}),
			create_p({text: d.note, classes: ['expand']}),
			create_p({text: 'by'}),
			create_p({text: d.author, classes: ['expand']}),
			create_p({text: 'from'}),
			create_p({text: d.commit, classes: ['expand']}),
			create_p({text: d.description, classes: ['expand', 'description'], style: create_area({w: 5})})
		],
		style: {
			...create_grid({row: 2, col: 'subgrid'}),
			...style
		},
		...args
	});
}

export default sheet;
