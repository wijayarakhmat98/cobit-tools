import {
	create_grid,
	create_area,
	replace_content,
	create_div,
	create_p,
	create_button,
	create_svg,
	create_polyline
}
from 'component';

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
	replace_content(view,
		[
			...C.map(c => create_button(c.id, callback ? () => callback(c.graph) : undefined, true, [], create_area(c.j, c.i, 1, 1))),
			...C.map(c => create_p(c.description, ['expand'], create_area(col + 1, c.i, 1, 1)))
		],
		[], create_grid(row, col + 1)
	);
	draw_branch(view, C);
}

function prepare(graph) {
	let C = graph.map(g => ({
		'graph': g,
		'id': g.id,
		'description': g.description,
		'timestamp': g.timestamp,
		'i': undefined,
		'j': undefined,
		'parents': ((g.parent == null) ? [] : [g.parent]).concat(g.merge),
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
				(a.graph.merge.length < b.graph.merge.length) ? 1 : ((a.graph.merge.length > b.graph.merge.length) ? -1 : 0)
			);
	}
	return C;
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
	C.sort((c, d) => (c.timestamp < d.timestamp) ? 1 : -1);
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
	C.sort((c, d) => (c.i > d.i) ? 1 : -1);
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

		F.push(B.map(b => (b == null) ? null : b.name));
		const F_col = Math.max.apply(Math, F.map(f => f.length));
		for (let f of F) {
			while (f.length < F_col)
				f.push(null);
		}
	}
}

function draw_branch(view, C) {
	for (const c of C) {
		for (const d of c.branch_children)
			create_vertical_line(view, d.j, d.i, 1, c.i - d.i + 1);
		const l = Math.min.apply(Math, [c, ...c.branch_children].map(d => d.j));
		const w = Math.max.apply(Math, [c, ...c.branch_children].map(d => d.j)) - l + 1;
		if (w == 1)
			continue;
		create_horizontal_line(view, l, c.i, w, 1);
	}
}

function get_aspect_ratio(element, w, h) {
	const rect = element.getBoundingClientRect();
	const rw = rect.width / w;
	const rh = rect.height / h;
	return [
		(rw > rh) ? rw / rh : 1.0,
		(rw < rh) ? rh / rw : 1.0
	];
}

function create_svg_area(view, x, y, w, h, children_callback) {
	let div = create_div([], [], {
		...create_area(x, y, w, h),
		'z-index': -100,
		'width': 'auto',
		'height': 'auto'
	});
	view.appendChild(div);
	const [ar_w, ar_h] = get_aspect_ratio(div, w, h);
	div.appendChild(
		create_svg(
			[0, 0, w * ar_w, h * ar_h],
			children_callback(ar_w, ar_h),
			[], {
				'min-width': '100%',
				'min-height': '100%',
				'width': 0,
				'height': 0
			}
		)
	);
	return div;
}

function create_horizontal_line(view, x, y, w, h) {
	return create_svg_area(view, x, y, w, h, (ar_w, ar_h) => [
		create_polyline([0.475 * ar_w, 0.5 * h * ar_h, (w - 0.475) * ar_w, 0.5 * h * ar_h])
	]);
}

function create_vertical_line(view, x, y, w, h) {
	return create_svg_area(view, x, y, w, h, (ar_w, ar_h) => [
		create_polyline([0.5 * w * ar_w, 0.5 * ar_h, 0.5 * w * ar_w, (h - 0.5) * ar_h])
	]);
}

export default chart_graph;
