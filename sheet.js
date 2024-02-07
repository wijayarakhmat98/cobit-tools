import {
	mst_df1,
	trs_df1_baseline,
	trs_df1_lo,
	trs_df1_hi
}
from 'master';

import {
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
	}

	static state_modify({} = {}) {
	}

	constructor({} = {}) {
		super();
	}

	view({commit, callback} = {}) {
		replace_row({
			element: this,
			sub_row: 1 + mst_df1.length,
			children: [
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Enterprise Strategy'}),
						...mst_df1.map(d => create_details({summary: d.dimension, detail: d.explanation}))
					]
				}),
				...(commit === null ? [] : [create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Viewing commit ${commit.id}`}),
						...create_snapshot({
							commit: commit,
							mst_df: mst_df1,
							trs_df_baseline: trs_df1_baseline
						}).map(d => create_trace({
							name: `df1 ${d.id}`,
							d: d,
							checked: true,
							callback: callback
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

	modify({parent, alter, merge, callback} = {}) {
		replace_row({
			element: this,
			sub_row: 1 + mst_df1.length,
			children: [
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Enterprise Strategy'}),
						...mst_df1.map(d => create_details({summary: d.dimension, detail: d.explanation}))
					]
				}),
				...merge.map(s => create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Merging commit ${s.id}`}),
						...create_snapshot({
							commit: s,
							mst_df: mst_df1,
							trs_df_baseline: trs_df1_baseline
						}).map(d => create_trace({
							name: `df1 ${d.id}`,
							d: d,
							checked: true,
							callback: callback
						}))
					]
				})),
				...(!alter ? [] : [create_column({
					sub_col: create_change_sub_col({lo: trs_df1_lo, hi: trs_df1_hi}),
					children: [
						create_p({text: 'Change'}),
						...mst_df1.map(d => create_change({
							name: `df1 ${d.id}`,
							lo: trs_df1_lo,
							hi: trs_df1_hi,
							checked: undefined,
							callback: callback
						}))
					]
				})]),
				...(parent === null ? [] : [create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Parent commit ${parent.id}`}),
						...create_snapshot({
							commit: parent,
							mst_df: mst_df1,
							trs_df_baseline: trs_df1_baseline
						}).map(d => create_trace({
							name: `df1 ${d.id}`,
							d: d,
							checked: true,
							callback: callback
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

function create_snapshot({commit, mst_df, trs_df_baseline} = {}) {
	return mst_df.map(d => {
		let p, c;
		for (p = commit; p.parent;)
			if (c = p.change.find(e => e.id == d.id))
				if (c.inherit)
					p = c.from;
				else
					break;
			else
				p = p.parent
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

function create_change({name, lo, hi, checked, callback, style = {}, ...args} = {}) {
	return create_div({
		children: [
			...create_range({start: lo, stop: hi}).map(
				i => listener_change({
					element: create_radio({
						text: i,
						checked: i == checked,
						name: `${name} value`,
						value: `{"value": ${i}, "from": null}`
					}),
					callback: callback
				})
			),
			create_textarea({name: `${name} note`, row: 1})
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

function create_trace({name, d, checked, callback, style = {}, ...args} = {}) {
	return create_div({
		children: [
			listener_change({
				element: create_radio({
					text: d.value,
					checked: checked,
					name: `${name} value`,
					value: `{"value": ${d.value}, "from": "old"}`,
					style: create_area({h: 2})
				}),
				callback: callback
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
