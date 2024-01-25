import {
	mst_df1,
	trs_df1_baseline,
	trs_df1_lo,
	trs_df1_hi
}
from 'master';

import {
	apply_style,
	apply_class,
	create_range,
	create_grid,
	create_area,
	replace_content,
	create_div,
	create_p,
	create_details,
	create_radio,
	create_textarea
}
from 'component';

import chart_gmo from 'gmo';

function checkout(history, commit, edit, merge, view, graph, gmo) {
	const snapshot = create_snapshot(commit, mst_df1, trs_df1_baseline);
	replace_content(view,
		[
			create_column(1, mst_df1, [
				create_p('Enterprise Strategy'),
				...mst_df1.map(d => create_details(d.dimension, d.explanation))
			]),
			create_column(2, mst_df1,
				[
					create_p('Change', [], create_change_area(trs_df1_lo, trs_df1_hi)),
					...mst_df1.map(d => create_change(
						`df1 ${d.id}`, trs_df1_lo, trs_df1_hi, undefined, () => chart_gmo(gmo)
					))
				],
				[], create_change_grid(trs_df1_lo, trs_df1_hi)
			),
			create_column(3, mst_df1,
				[
					create_p(`Viewing commit ${commit.id}`, [], create_trace_area()),
					...snapshot.map(d => create_trace(`df1 ${d.id}`, d, true))
				],
				[], create_trace_grid()
			),
			create_column(4, mst_df1, [
				create_p('Baseline'),
				...trs_df1_baseline.map(d => create_p(d.value, ['baseline']))
			]),
		],
		[], create_grid(1 + mst_df1.length, 4, true)
	);
	chart_gmo(gmo);
}

function create_snapshot(commit, mst_df, trs_df_baseline, classes = [], style = {}) {
	return apply_style(apply_class(mst_df.map(d => {
		let p = commit;
		let c = undefined;
		for (; p.parent; p = p.parent)
			if (c = p.change.find(e => e.id == d.id))
				break;
		return {
			'id': d.id,
			'value': c ? c.value : trs_df_baseline.find(e => e.id == d.id).value,
			'note': c ? c.comment : 'Baseline',
			'author': p.author,
			'commit': p.id,
			'description': p.description
		};
	}), classes), style);
}

function create_column(col, df, children = [], classes = [], style = {}) {
	return apply_style(apply_class(create_div(
		children,
		[], {
			...create_area(col, 1, 1, df.length + 1),
			...create_grid('subgrid', undefined)
		}
	), classes), style);
}

function create_change_grid(lo, hi) {
	return create_grid(undefined, hi - lo + 2)
}

function create_change_area(lo, hi) {
	return create_area(undefined, undefined, hi - lo + 2, undefined);
}

function create_change(name, lo, hi, checked, callback, classes = [], style = {}) {
	return apply_style(apply_class(create_div(
		[
			...create_range(lo, hi).map(
				i => create_radio(`${name} value`, `{"value": ${i}, "from": "new"}`, i, i == checked, callback)
			),
			create_textarea(`${name} comment`)
		],
		[], {
			...create_change_area(lo, hi),
			...create_grid(undefined, 'subgrid')
		}
	), classes), style);
}

function create_trace_grid() {
	return create_grid(undefined, 6);
}

function create_trace_area() {
	return create_area(undefined, undefined, 6, undefined);
}

function create_trace(name, d, checked, callback, classes = [], style = {}) {
	return apply_style(apply_class(create_div(
		[
			create_radio(`${name} value`, `{"value": ${d.value}, "from": "old"}`, d.value, checked, callback),
			create_p(d.note, ['expand']),
			create_p('by'),
			create_p(d.author, ['expand']),
			create_p('from'),
			create_p(d.commit, ['expand']),
		],
		[], {
			...create_trace_area(),
			...create_grid(undefined, 'subgrid')
		}
	), classes), style);
}

export default checkout;
