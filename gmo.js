import {
	mst_gmo
}
from 'master';

import {
	matrix_flatten
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

	view({r_hat} = {}) {
		replace_content({
			element: this,
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
}

export default gmo;
