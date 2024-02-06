import {
	mst_df1,
	trs_df1_baseline,
	trs_df1_lo,
	trs_df1_hi
}
from 'master';

import {
	listener_change,
	apply_style,
	apply_class,
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

function chart_sheet({view, commit, callback} = {}) {
	replace_row(view, 1 + mst_df1.length,
		[
			create_column({
				sub_col: 1,
				children: [
					create_p({text: 'Enterprise Strategy'}),
					...mst_df1.map(d => create_details({summary: d.dimension, detail: d.explanation}))
				]
			}),
			...commit.slice().reverse().map(s => s == null ?
				create_column({
					sub_col: create_change_sub_col({lo: trs_df1_lo, hi: trs_df1_hi}),
					children: [
						create_p({text: 'Change'}),
						...mst_df1.map(d => create_change({
							name: `df1 ${d.id}`, lo: trs_df1_lo, hi: trs_df1_hi, checked: undefined, callback: callback
						}))
					]
				})
				:
				create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Viewing commit ${s.id}`}),
						...create_snapshot({commit: s, mst_df: mst_df1, trs_df_baseline: trs_df1_baseline}).map(d => create_trace({
							name: `df1 ${d.id}`, d: d, checked: true, callback: callback
						}))
					]
				})
			),
			create_column({
				sub_col: 1,
				children: [
					create_p({text: 'Baseline'}),
					...trs_df1_baseline.map(d => create_p({text: d.value, classes: ['baseline']}))
				]
			}),
		]
	);
}

function create_snapshot({commit, mst_df, trs_df_baseline, classes = [], style = {}} = {}) {
	return apply_style(apply_class(mst_df.map(d => {
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
	}), classes), style);
}

function create_change_sub_col({lo, hi} = {}) {
	return hi - lo + 2;
}

function create_change({name, lo, hi, checked, callback, style = {}, ...args} = {}) {
	return create_div({
		children: [
			...create_range(lo, hi).map(
				i => listener_change({element: create_radio(`${name} value`, `{"value": ${i}, "from": null}`, i, i == checked), callback})
			),
			create_textarea(`${name} note`, 1)
		],
		style: {
			...create_grid(undefined, 'subgrid'),
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
			listener_change({element: create_radio(
				`${name} value`, `{"value": ${d.value}, "from": "old"}`, d.value, checked,
				true, [], create_area(undefined, undefined, undefined, 2)
			), callback: callback}),
			create_p({text: d.note, classes: ['expand']}),
			create_p({text: 'by'}),
			create_p({text: d.author, classes: ['expand']}),
			create_p({text: 'from'}),
			create_p({text: d.commit, classes: ['expand']}),
			create_p({text: d.description, classes: ['expand', 'description'], style: create_area(undefined, undefined, 5, undefined)})
		],
		style: {
			...create_grid(2, 'subgrid'),
			...style
		},
		...args
	});
}

export default chart_sheet;
