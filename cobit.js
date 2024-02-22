import {
	asp_class,
	aspect,
	asp_desc,
	map,
	baseline
}
from 'master';

import {
	matrix_create,
	matrix_sum_element,
	matrix_reciprocal,
	matrix_scalar_multiply,
	matrix_multiply,
	matrix_element_multiply,
	matrix_element_map
}
from 'matrix';

function create_aspect({facet} = {}) {
	return aspect
		.filter(r => r.fct_id == facet)
		.map(r => ({
			id: r.id,
			code: r.code,
			name: r.name,
			desc: asp_desc
				.filter(e => e.fct_id == r.fct_id && e.asp_id == r.id)
				.map(e => ({
					bullet: e.bullet,
					description: e.description
				})),
			class: asp_class
				.filter(c => c.fct_id == r.fct_id && c.id == r.cls_id)
				.map(c => ({
					name: c.name,
					description: c.description
				}))
		}))
	;
}

function create_map({facet} = {}) {
	const ms = [];
	let focus = facet;
	for (;;) {
		const m = map.filter(r => r.src_fct_id == focus);
		if (m.length == 0)
			break;
		focus = m[0].dst_fct_id;
		ms.push(m);
	}
	for (const [i, m] of ms.entries()) {
		const row = Math.max.apply(Math, m.map(r => r.dst_asp_id));
		const col = Math.max.apply(Math, m.map(r => r.src_asp_id));
		const A = matrix_create({row: row, col: col});
		for (const r of m)
			A[r.dst_asp_id - 1][r.src_asp_id - 1] = r.relevance;
		ms[i] = A;
	};
	const M = ms.reverse().reduce((M, m) => matrix_multiply({A: M, B: m}));
	return M;
}

function create_baseline({facet} = {}) {
	const fct_baseline = baseline.reduce((a, r) => {
		if (r.fct_id == facet && r.inp_id == 1)
			a.push({
				id: r.asp_id,
				value: r.baseline
			})
		return a;
	}, []);
	return fct_baseline;
}

function gmo_calculate({x, x_base, M} = {}) {
	const c = matrix_sum_element({A: x_base}) / matrix_sum_element({A: x});
	const y = matrix_multiply({A: M, B: x});
	const y_base = matrix_multiply({A: M, B: x_base});
	const r = matrix_scalar_multiply({c: c, A: matrix_element_multiply({A: y, B: matrix_reciprocal({A: y_base})})});
	const r_hat = matrix_element_map({A: r, callback: e => Math.round(20 * e) * 5 - 100});
	return r_hat;
}

export {
	create_aspect,
	create_map,
	create_baseline,
	gmo_calculate
};
