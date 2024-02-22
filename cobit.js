import {
	facet,
	asp_class,
	aspect,
	asp_desc,
	map,
	input,
	baseline,
	inp_collapse
}
from 'master';

import {
	matrix_create,
	matrix_sum_element,
	matrix_reciprocal,
	matrix_transpose,
	matrix_scalar_multiply,
	matrix_multiply,
	matrix_element_multiply,
	matrix_element_map
}
from 'matrix';

function create_facet({id, code}) {
	if (typeof id !== 'undefined')
		return facet.find(f => f.id == id);
	if (typeof code !== 'undefined')
		return facet.find(f => f.code == code);
}

function create_aspect({facet} = {}) {
	return aspect
		.filter(r => r.fct_id == facet.id)
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
		}));
}

function create_map({facet} = {}) {
	const ms = [];
	let focus = facet.id;
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

function create_input({facet} = {}) {
	return input
		.filter(i => i.fct_id == facet.id)
		.map(i => ({
			id: i.id,
			type: i.type,
			lo: i.lo,
			hi: i.hi,
			step: i.step,
			name: i.name
		}));
}

function create_baseline({facet} = {}) {
	return baseline
		.filter(b => b.fct_id == facet.id)
		.reduce((a, r) => {
			if (typeof a[r.inp_id - 1] === 'undefined')
				a[r.inp_id - 1] = [];
			a[r.inp_id - 1][r.asp_id - 1] = r.baseline;
			return a;
		}, []);
}

function create_collapse({facet} = {}) {
	const c = inp_collapse.find(c => c.fct_id == facet.id);
	return {
		strategy: c.strategy,
		name: c.name
	};
}

function map_calculate({x, x_base, M} = {}) {
	const c = matrix_sum_element({A: x_base}) / matrix_sum_element({A: x});
	const y = matrix_multiply({A: M, B: x});
	const y_base = matrix_multiply({A: M, B: x_base});
	const r = matrix_scalar_multiply({c: c, A: matrix_element_multiply({A: y, B: matrix_reciprocal({A: y_base})})});
	const r_hat = matrix_element_map({A: r, callback: e => Math.round(20 * e) * 5 - 100});
	return r_hat;
}

function collapse_calculate({xs, collapse}) {
	return matrix_transpose({A: xs})
		.map(x => {
			if (collapse.strategy == 'sum')
				return x.reduce((a, v) => a += v);
			if (collapse.strategy == 'product')
				return x.reduce((a, v) => a *= v);
		})
		.map(x => [x]);
}

export {
	create_facet,
	create_aspect,
	create_map,
	create_input,
	create_baseline,
	create_collapse,
	map_calculate,
	collapse_calculate
};
