import {
	listener_resize,
	create_range,
	create_grid,
	create_area,
	replace_content,
	replace_row,
	create_div,
	create_column,
	create_p,
	create_button,
	create_svg,
	create_polyline
}
from 'component';

function prepare(graph) {
	let C = graph.map(g => ({
		'graph': g,
		'id': g.id,
		'description': g.description,
		'timestamp': g.timestamp,
		'i': undefined,
		'j': undefined,
		'parents': (g.parent == null ? [] : [g.parent]).concat(g.merge),
		'merge_parent': [],
		'children': [],
		'merge_children': [],
		'branch_children': [],
		'explored': false
	}));
	for (let c of C) {
		c.parents = c.parents.map(d => C[C.findIndex(e => e.id == d.id)]);
		c.merge_parent = c.graph.merge.map(d => C[C.findIndex(e => e.id == d.id)]);
	}
	for (let c of C) {
		c.children = C.filter(d => d.parents.includes(c));
		c.merge_children = c.children.filter(d => d.parents[0] != c);
		c.branch_children = c.children.filter(d => d.parents[0] == c)
			.sort((a, b) =>
				a.graph.merge.length < b.graph.merge.length ? 1 : a.graph.merge.length > b.graph.merge.length ? -1 : 0
			);
	}
	return C;
}

function chart_graph(view, graph, callback) {
	let C = prepare(graph);
	place_i(C);
	place_j(C);
	for (let c of C) {
		c.i += 1;
		c.j += 1;
	}
	const row = Math.max.apply(Math, C.map(c => c.i));
	const col = Math.max.apply(Math, C.map(c => c.j));
	for (let c of C)
		c.j = col - c.j + 1;
	const node = C.map(c => create_button(
		c.id, callback ? () => callback(c.graph) : undefined, true, [], create_area(c.j, c.i, 1, 1)
	));
	let subgrid = {
		...create_area(1, 1, col, row), ...create_grid('subgrid', 'subgrid')
	};
	let view_link = create_div([], [], subgrid);
	replace_row(view, row, true, [
		create_column(col, false, [view_link, create_div(node, [], subgrid)]),
		create_column(1, true, C.map(c => create_p(c.description, ['expand'])))
	]);
	listener_resize(view_link, () => chart_link(view_link, row, col, C, node));
}

function chart_link(view, row, col, C, node) {
	const row_div = create_range(1, row).map(i => create_div([], [],
		{'width': 'auto', 'height': 'auto', ...create_area(1, undefined, col, undefined)})
	);
	const col_div = create_range(1, col).map(i => create_div([], [],
		{'width': 'auto', 'height': 'auto', ...create_area(undefined, 1, undefined, row)})
	);
	replace_content(view, col_div);
	const rw = col_div.map(div => div.getBoundingClientRect().width);
	replace_content(view, row_div);
	const rh = row_div.map(div => div.getBoundingClientRect().height);
	const nj = C.reduce((nj, c, i) => {
		const css = window.getComputedStyle(node[i]);
		nj[c.j - 1] = {
			'ml': parseInt(css['margin-left']),
			'bw': node[i].getBoundingClientRect().width,
			'mr': parseInt(css['margin-right'])
		};
		return nj;
	}, []);
	const ni = C.reduce((ni, c, i) => {
		const css = window.getComputedStyle(node[i]);
		ni[c.i - 1] = {
			'mt': parseInt(css['margin-top']),
			'bh': node[i].getBoundingClientRect().height,
			'mb': parseInt(css['margin-bottom'])
		};
		return ni;
	}, []);
	replace_content(view, [
		...C.flatMap(c => {
			const l = Math.min.apply(Math, [c, ...c.branch_children].map(d => d.j));
			const w = Math.max.apply(Math, [c, ...c.branch_children].map(d => d.j)) - l + 1;
			return w == 1 ? [] : create_horizontal_fit(l, c.i, w, 1, rw, rh, nj, ni);
		}),
		...C.flatMap(c => c.branch_children.map(d =>
			create_vertical_fit(d.j, d.i, 1, c.i - d.i + 1, rw, rh, nj, ni)
		)),
		...C.flatMap(c => {
			const l = Math.min.apply(Math, [c, ...c.merge_parent].map(d => d.j));
			const w = Math.max.apply(Math, [c, ...c.merge_parent].map(d => d.j)) - l + 1;
			return w == 1 ? [] : create_horizontal_fit(l, c.i, w, 1, rw, rh, nj, ni, 'black', 1.0, [1, 1]);
		}),
		...C.flatMap(c => c.merge_parent.map(d =>
			create_vertical_fit(d.j, c.i, 1, d.i - c.i + 1, rw, rh, nj, ni, 'black', 1.0, [1, 1])
		)),
	]);
}

function create_svg_fit(x, y, w, h, sw, sh, children) {
	return create_div(
		[create_svg([0, 0, sw, sh], children, [], {
			'min-width': '100%',
			'min-height': '100%',
			'width': 0,
			'height': 0
		})], [], {
			'width': 'auto',
			'height': 'auto',
			...create_area(x, y, w, h)
		}
	);
}

function create_horizontal_fit(x, y, w, h, rw, rh, nj, ni, color = 'black', width = 1.0, dasharray = []) {
	const fx = x - 1, lx = x + w - 2;
	const fy = y - 1, ly = y + h - 2;
	return create_svg_fit(
		x, y, w, h,
		rw.slice(fx, lx + 1).reduce((sum, x) => sum += x, 0.0),
		rh.slice(fy, ly + 1).reduce((sum, x) => sum += x, 0.0),
		[create_polyline([
			nj[fx].ml + 0.5 * nj[fx].bw - 0.5 * width,
			ni[fy].mt + 0.5 * ni[fy].bh,
			rw.slice(fx, lx).reduce((sum, x) => sum += x, 0.0) + nj[lx].ml + 0.5 * nj[lx].bw + 0.5 * width,
			ni[fy].mt + 0.5 * ni[fy].bh
		], color, width, dasharray)]
	);
}

function create_vertical_fit(x, y, w, h, rw, rh, nj, ni, color = 'black', width = 1.0, dasharray = []) {
	const fx = x - 1, lx = x + w - 2;
	const fy = y - 1, ly = y + h - 2;
	return create_svg_fit(
		x, y, w, h,
		rw.slice(fx, lx + 1).reduce((sum, x) => sum += x, 0.0),
		rh.slice(fy, ly + 1).reduce((sum, x) => sum += x, 0.0),
		[create_polyline([
			nj[fx].ml + 0.5 * nj[fx].bw,
			ni[fy].mt + 0.5 * ni[fy].bh - 0.5 * width,
			nj[fx].ml + 0.5 * nj[fx].bw,
			rh.slice(fy, ly).reduce((sum, x) => sum += x, 0.0) + ni[ly].mt + 0.5 * ni[ly].bh + 0.5 * width
		], color, width, dasharray)]
	);
}

function J(c, F) {
	if (c.merge_children.length == 0)
		return [];
	let Jc = [];
	let di = Math.min.apply(Math, c.merge_children.map(m => m.i));
	for (let j = 0; j < F[0].length; ++j)
		for (let i = c.i - 1; i > di; --i)
			if (F[i][j] != null) {
				Jc.push(j);
				break;
			}
	return Jc;
}

function place_i(C) {
	C.sort((c, d) => c.timestamp < d.timestamp ? 1 : -1);
	function dfs(c) {
		if (!c.explored) {
			c.explored = true;
			for (let d of c.children)
				dfs(d);
			c.i = i;
			i += 1;
		}
	}
	let i = 0;
	for (let c of C)
		dfs(c);
}

function place_j(C) {
	C.sort((c, d) => c.i > d.i ? 1 : -1);
	let F = [];
	let B = [];
	for (const c of C) {
		let  Jc = J(c, F);
		let nJc = c.merge_children.length ? [] : c.branch_children.filter(d => !Jc.includes(d.j));
		let  D_ = [];
		if (nJc.length > 0) {
			const d = nJc[0];
			D_.push(d);
			B[B.findIndex(e => e == d)] = c;
		} else {
			B.push(c);
		}
		let nD_ = c.branch_children.filter(d => !D_.includes(d));
		for (const d_ of nD_)
			B[d_.j] = null;
		c.j = B.findIndex(d => d == c);

		F.push(B.map(b => b == null ? null : b.name));
		const F_col = Math.max.apply(Math, F.map(f => f.length));
		for (let f of F) {
			while (f.length < F_col)
				f.push(null);
		}
	}
}

export default chart_graph;
