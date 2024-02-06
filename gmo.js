import {
	mst_gmo,
	mst_df1,
	trs_df1_baseline,
	trs_df1_map_matrix
}
from 'master';

import {
	matrix_sum_element,
	matrix_flatten,
	matrix_reciprocal,
	matrix_scalar_multiply,
	matrix_multiply,
	matrix_element_multiply,
	matrix_element_map
}
from 'matrix';

import {
	create_grid,
	create_area,
	replace_content,
	create_div,
	create_p,
	create_details_proxy
}
from 'component';

function chart_gmo({view} = {}) {
	const x = mst_df1.map(d => {
		const v = document.querySelector(`input[name="df1 ${d.id} value"]:checked`);
		if (v !== null)
			return [JSON.parse(v.value).value];
		else
			return [trs_df1_baseline.find(e => e.id == d.id).value];
	});
	const x_base = trs_df1_baseline.map((d) => [d.value]);
	const r_hat = calculate_gmo({x: x, x_base: x_base});
	draw_gmo({view: view, r_hat: r_hat});
}

function calculate_gmo({x, x_base} = {}) {
	const c = matrix_sum_element(x_base) / matrix_sum_element(x);
	const y = matrix_multiply(trs_df1_map_matrix, x);
	const y_base = matrix_multiply(trs_df1_map_matrix, x_base);
	const r = matrix_scalar_multiply(c, matrix_element_multiply(y, matrix_reciprocal(y_base)));
	const r_hat = matrix_element_map(r, e => Math.round(20 * e) * 5 - 100);
	return r_hat;
}

function draw_gmo({view, r_hat} = {}) {
	replace_content(view,
		[
			create_div({
				children: mst_gmo.map(d => {
					const x = create_p({text: d.explanation, classes: ['details'], style: create_area(1, undefined, 2, undefined)});
					const y = create_p({text: d.dimension, classes: ['summary']});
					const z = create_details_proxy({summary: d.code, surrogate_summary: [y], surrogate_detail: [x]});
					return create_div({
						children: [z, y, x],
						style: {
							...create_area(1, undefined, 2, undefined),
							...create_grid(2, 'subgrid')
						}
					});
				}),
				style: {
					...create_area(1, 1, 1, mst_gmo.length),
					...create_grid('subgrid', 2)
				}
			}),
			create_div({classes: ['view_gmo_bar'], style: create_area(2, 1, 1, mst_gmo.length)}),
			create_div({
				children: matrix_flatten(r_hat).map(r => {
					let bar;
					if (r < 0)
						bar = create_p({text: r, classes: ['neg'], style: create_area(101 + r, 1, -r, 1)});
					if (r == 0)
						bar = create_p({text: r, classes: ['zer'], style: create_area(1, 1, 200, 1)});
					if (r > 0)
						bar = create_p({text: r, classes: ['pos'], style: create_area(101, 1, r, 1)})
					return create_div({
						children: [bar],
						style: {
							...create_area(1, undefined, 200, undefined),
							...create_grid(1, 'subgrid')
						}
					});
				}),
				classes: ['view_gmo_bar'],
				style: {
					...create_area(2, 1, 1, mst_gmo.length),
					display: 'grid',
					'grid-template-rows': 'subgrid',
					'grid-template-columns': 'repeat(200, 1fr)'
				}
			})
		],
		[], create_grid(mst_gmo.length, 2)
	);
}

export default chart_gmo;
