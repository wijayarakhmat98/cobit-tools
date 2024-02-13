import {
	trs_df1_baseline,
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

	static state_modify({aspect, note} = {}) {
		return {
			mode: 'modify',
			note: note ?? aspect.map(() => undefined)
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

	view({commit, aspect} = {}) {
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
							trs_df_baseline: trs_df1_baseline
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
						...trs_df1_baseline.map(d => create_p({text: d.value, classes: ['baseline']}))
					]
				}),
			]
		});
	}

	modify({parent, alter, merge, aspect} = {}) {
		if (!this.state)
			this.state = sheet.state_modify({aspect: aspect});
		if (this.state.mode == 'view')
			this.state = sheet.state_modify({aspect: aspect});
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
							trs_df_baseline: trs_df1_baseline
						}).map(d => create_trace({
							d: d,
							checked: true
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
							checked: undefined,
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
							trs_df_baseline: trs_df1_baseline
						}).map(d => create_trace({
							d: d,
							checked: true
						}))
					]
				})]),
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Baseline'}),
						...trs_df1_baseline.map(d => create_p({text: d.value, classes: ['baseline']}))
					]
				}),
			]
		});
	}
}

function create_snapshot({commit, aspect, trs_df_baseline} = {}) {
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
			value: c ? c.value : trs_df_baseline.find(e => e.id == d.id).value,
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
					event: 'sheet-select',
					detail: {
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

function create_trace({d, checked, style = {}, ...args} = {}) {
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
				event: 'sheet-select',
				detail: {
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
