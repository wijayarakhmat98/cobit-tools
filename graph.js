import {
	create_grid,
	create_area,
	replace_content,
	create_div,
	create_p,
	create_button
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
	const row = Math.max.apply(Math, C.map((c) => c.i));
	const col = Math.max.apply(Math, C.map((c) => c.j));
	replace_content(view,
		[
			...C.map(c => create_button(c.id, callback ? () => callback(c.graph) : undefined, true, [], create_area(c.j, c.i, 1, 1))),
			...C.map(c => create_p(c.description, ['expand'], create_area(col + 1, c.i, 1, 1)))
		],
		[], create_grid(row, col + 1)
	);
	draw_line(view, C);
}

function prepare(graph) {
	let C = graph.map((g) => ({
		'graph': g,
		'id': g.id,
		'description': g.description,
		'timestamp': g.timestamp,
		'i': undefined,
		'j': undefined,
		'parents': ((g.parent == null) ? [] : [g.parent]).concat(g.merge),
		'children': [],
		'merge': [],
		'branch': [],
		'explored': false
	}));

	C.forEach((c) => {
		c.parents = c.parents.map((d) => C[C.findIndex((e) => e.id == d.id)]);
	});

	C.forEach((c) => {
		c.children = C.filter((d) => d.parents.includes(c));
		c.branch = c.children.filter((d) => d.parents[0] == c)
			.sort((a, b) =>
				(a.graph.merge.length < b.graph.merge.length) ? 1 : ((a.graph.merge.length > b.graph.merge.length) ? -1 : 0)
			);
		c.merge = c.children.filter((d) => d.parents[0] != c);
	});

	return C;
}

function J(c, F) {
	if (c.merge.length == 0)
		return [];
	let Jc = [];
	let di = Math.min.apply(Math, c.merge.map((m) => m.i));
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
			c.children.forEach((d) => dfs(d));
			c.i = i;
			i += 1;
		}
	}

	let i = 0;
	C.forEach((c) => dfs(c));
}

function place_j(C) {
	C.sort((c, d) => (c.i > d.i) ? 1 : -1);

	let F = [];
	let B = [];

	C.forEach((c) => {
		let  Jc = J(c, F);
		let nJc = c.branch.filter((d) => !Jc.includes(d.j));
		let  D_ = [];
		if (nJc.length > 0) {
			const d = nJc[0];
			D_.push(d);
			B[B.findIndex((e) => e == d)] = c;
		} else {
			B.push(c);
		}
		let nD_ = c.branch.filter((d) => !D_.includes(d));
		nD_.forEach((d_) => B[d_.j] = null);
		c.j = B.findIndex((d) => d == c);

		F.push(B.map((b) => (b == null) ? null : b.name));
		const F_col = Math.max.apply(Math, F.map((f) => f.length));
		F.forEach((f) => {
			while (f.length < F_col)
				f.push(null);
		});
	});
}

function draw_line(view, C) {
	C.forEach((c) => {c.children.forEach((b) => {
		const p = {
			'l': Math.min(c.j, b.j) + 0,
			'r': Math.max(c.j, b.j) + 1,
			't': Math.min(c.i, b.i) + 0,
			'b': Math.max(c.i, b.i) + 1
		};
		let d = create_div([], [], {
			...create_area(p.l, p.t, p.r - p.l, p.b - p.t),
			'z-index': -10,
			'width': 'auto',
			'height': 'auto'
		});
		view.appendChild(d);
		const m = {
			'w': p.r - p.l,
			'h': p.b - p.t
		};
		const a = (() => {
			const r = d.getBoundingClientRect();
			const w = r.width / m.w;
			const h = r.height / m.h;
			if (w < h) return {'w': 1, 'h': h / w};
			if (w > h) return {'w': w / h, 'h': 1};
			return {'w': 1, 'h': 1};
		})();
		let s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		s.style['width'] = 0;
		s.style['height'] = 0;
		s.style['min-width'] = '100%';
		s.style['min-height'] = '100%';
		s.setAttribute('viewBox', `0 0 ${m.w * a.w} ${m.h * a.h}`);
		let l = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		l.setAttribute('fill', 'none');
		l.setAttribute('stroke', 'black');
		l.setAttribute('stroke-width', '0.05');
		if (c.j == b.j)
			l.setAttribute('points', `${0.5 * a.w} ${(m.h - 0.5) * a.h} ${0.5 * a.w} ${0.5 * a.h}`);
		else
			if (c.branch.includes(b))
				if (c.j < b.j)
					l.setAttribute('points', `${0.5 * a.w} ${(m.h - 0.5) * a.h} ${(m.w - 0.5) * a.w} ${(m.h - 0.5) * a.h} ${(m.w - 0.5) * a.w} ${0.5 * a.h}`);
				else
					l.setAttribute('points', `${(m.w - 0.5) * a.w} ${(m.h - 0.5) * a.h} ${0.5 * a.w} ${(m.h - 0.5) * a.h} ${0.5 * a.w} ${0.5 * a.h}`);
			else
				if (c.j < b.j)
					l.setAttribute('points', `${0.5 * a.w} ${(m.h - 0.5) * a.h} ${0.5 * a.w} ${0.5 * a.h} ${(m.w - 0.5) * a.w} ${0.5 * a.h}`);
				else
					l.setAttribute('points', `${(m.w - 0.5) * a.w} ${(m.h - 0.5) * a.h} ${(m.w - 0.5) * a.w} ${0.5 * a.h} ${0.5 * a.w} ${0.5 * a.h}`);
		s.appendChild(l);
		d.appendChild(s);
	})});
}

export default chart_graph;
