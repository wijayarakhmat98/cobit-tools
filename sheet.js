import {
	trs_df1_lo,
	trs_df1_hi
}
from 'master';

import {
	notify,
	listen,
	bubble,
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
	create_textarea
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
						v = {
							id: detail.id,
							value: detail.value
						};
						this.state.value.push(v);
					}
					else
						v = this.state.value[j];
				}
				if (detail.from == 'parent' && i != -1)
					this.state.selection.splice(i, 1);
				else {
					const s = i != -1 ? this.state.selection[i] : {id: detail.id};
					s.from = detail.from;
					if (i == -1)
						this.state.selection.push(s);
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
		const context = create_context({
			parent: parent,
			alter: alter,
			merge: merge,
			aspect: aspect,
			selection: this.state.selection
		})
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
						...create_snapshot({
							commit: s,
							aspect: aspect,
							baseline: baseline,
						}).map(d => create_trace({
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
						...create_snapshot({
							commit: parent,
							aspect: aspect,
							baseline: baseline,
						}).map(d => create_trace({
							from: parent.id,
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
			]
		});
	}
}

function create_context({parent, alter, merge, aspect, selection} = {}) {
	return aspect.map(d => {
		const i = selection.findIndex(s => s.id == d.id);
		if (i != -1) {
			const s = selection[i];
			if (alter && s.from == 'new')
				return s.from;
			if (merge.findIndex(m => m.id == s.from) != -1)
				return s.from;
		}
		if (parent !== null)
			return parent.id;
		return 'baseline';
	});
}

function create_snapshot({commit, aspect, baseline} = {}) {
	return aspect.map(d => {
		let p, c;
		for (p = commit;;)
			if (c = p.change.find(e => e.id == d.id))
				if (c.inherit)
					p = c.from;
				else
					break;
			else
				if (p.parent)
					p = p.parent;
				else
					break;
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
		children: [
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
