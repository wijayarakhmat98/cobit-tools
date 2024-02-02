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
			create_column(1, [
				create_p('Enterprise Strategy'),
				...mst_df1.map(d => create_details(d.dimension, d.explanation))
			]),
			...commit.slice().reverse().map(s => s == null ?
				create_column(
					create_change_sub_col({lo: trs_df1_lo, hi: trs_df1_hi}),
					[
						create_p('Change'),
						...mst_df1.map(d => create_change({
							name: `df1 ${d.id}`, lo: trs_df1_lo, hi: trs_df1_hi, checked: undefined, callback: callback
						}))
					]
				)
				:
				create_column(
					create_trace_sub_col(),
					[
						create_p(`Viewing commit ${s.id}`),
						...create_snapshot({commit: s, mst_df: mst_df1, trs_df_baseline: trs_df1_baseline}).map(d => create_trace({
							name: `df1 ${d.id}`, d: d, checked: true, callback: callback
						}))
					]
				)
			),
			create_column(1, [
				create_p('Baseline'),
				...trs_df1_baseline.map(d => create_p(d.value, ['baseline']))
			]),
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

function create_change({name, lo, hi, checked, callback, classes = [], style = {}} = {}) {
	return apply_style(apply_class(create_div(
		[
			...create_range(lo, hi).map(
				i => listener_change({element: create_radio(`${name} value`, `{"value": ${i}, "from": null}`, i, i == checked), callback})
			),
			create_textarea(`${name} note`, 1)
		],
		[], {
			...create_grid(undefined, 'subgrid')
		}
	), classes), style);
}

function create_trace_sub_col({} = {}) {
	return 6;
}

function create_trace({name, d, checked, callback, classes = [], style = {}} = {}) {
	return apply_style(apply_class(create_div(
		[
			listener_change({element: create_radio(
				`${name} value`, `{"value": ${d.value}, "from": "old"}`, d.value, checked,
				true, [], create_area(undefined, undefined, undefined, 2)
			), callback: callback}),
			create_p(d.note, ['expand']),
			create_p('by'),
			create_p(d.author, ['expand']),
			create_p('from'),
			create_p(d.commit, ['expand']),
			create_p(d.description, ['expand', 'description'], create_area(undefined, undefined, 5, undefined))
		],
		[], {
			...create_grid(2, 'subgrid')
		}
	), classes), style);
}

export default chart_sheet;
