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

class gmo extends HTMLElement {
	constructor({} = {}) {
		super();
	}

	view({} = {}) {
		const x = mst_df1.map(d => {
			const v = document.querySelector(`input[name="df1 ${d.id} value"]:checked`);
			if (v !== null)
				return [JSON.parse(v.value).value];
			else
				return [trs_df1_baseline.find(e => e.id == d.id).value];
		});
		const x_base = trs_df1_baseline.map((d) => [d.value]);
		const r_hat = calculate_gmo({x: x, x_base: x_base});
		draw_gmo({view: this, r_hat: r_hat});
	}
}

function calculate_gmo({x, x_base} = {}) {
	const c = matrix_sum_element({A: x_base}) / matrix_sum_element({A: x});
	const y = matrix_multiply({A: trs_df1_map_matrix, B: x});
	const y_base = matrix_multiply({A: trs_df1_map_matrix, B: x_base});
	const r = matrix_scalar_multiply({c: c, A: matrix_element_multiply({A: y, B: matrix_reciprocal({A: y_base})})});
	const r_hat = matrix_element_map({A: r, callback: e => Math.round(20 * e) * 5 - 100});
	return r_hat;
}

function draw_gmo({view, r_hat} = {}) {
	replace_content({
		element: view,
		children: [
			create_div({
				children: mst_gmo.map(d => {
					const x = create_p({text: d.explanation, classes: ['details'], style: create_area({x: 1, w: 2})});
					const y = create_p({text: d.dimension, classes: ['summary']});
					const z = create_details_proxy({summary: d.code, surrogate_summary: [y], surrogate_detail: [x]});
					return create_div({
						children: [z, y, x],
						style: {
							...create_area({x: 1, w: 2}),
							...create_grid({row: 2, col: 'subgrid'})
						}
					});
				}),
				style: {
					...create_area({x: 1, y: 1, w: 1, h: mst_gmo.length}),
					...create_grid({row: 'subgrid', col: 2})
				}
			}),
			create_div({classes: ['view_gmo_bar'], style: create_area({x: 2, y: 1, w: 1, h: mst_gmo.length})}),
			create_div({
				children: matrix_flatten({A: r_hat}).map(r => {
					let bar;
					if (r < 0)
						bar = create_p({text: r, classes: ['neg'], style: create_area({x: 101 + r, y: 1, w: -r, h: 1})});
					if (r == 0)
						bar = create_p({text: r, classes: ['zer'], style: create_area({x: 1, y: 1, w: 200, h: 1})});
					if (r > 0)
						bar = create_p({text: r, classes: ['pos'], style: create_area({x: 101, y: 1, w: r, h: 1})})
					return create_div({
						children: [bar],
						style: {
							...create_area({x: 1, w: 200}),
							...create_grid({row: 1, col: 'subgrid'})
						}
					});
				}),
				classes: ['view_gmo_bar'],
				style: {
					...create_area({x: 2, y: 1, w: 1, h: mst_gmo.length}),
					display: 'grid',
					'grid-template-rows': 'subgrid',
					'grid-template-columns': 'repeat(200, 1fr)'
				}
			})
		],
		style: create_grid({row: mst_gmo.length, col: 2})
	});
}

export default gmo;
