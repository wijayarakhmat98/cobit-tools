import {
	create_facet,
	create_aspect
}
from 'cobit';

import {
	matrix_flatten
}
from 'matrix';

import {
	create_grid,
	create_area,
	replace_row,
	create_div,
	create_p,
	create_legend
}
from 'component';

const mst_gmo = create_aspect({facet: create_facet({code: 'GMO'})});

class gmo extends HTMLElement {
	#state = {};

	constructor({} = {}) {
		super();
	}

	restore({state} = {}) {
		this.#state = state;
	}

	capture({} = {}) {
		return this.#state;
	}

	state_view({} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'view' ? _state : {
			state: 'view'
		};
		this.#state = state;
	}

	view({r_hat} = {}) {
		this.state_view();
		replace_row({
			sub_row: mst_gmo.length,
			col: 2,
			element: this,
			children: [
				create_legend({aspect: mst_gmo}),
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
			]
		});
	}
}

export default gmo;
