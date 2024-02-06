import {
	bubble,
	listener_click,
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

function prepare({graph} = {}) {
	let C = graph.map(g => ({
		graph: g,
		id: g.id,
		description: g.description,
		timestamp: g.timestamp,
		i: undefined,
		j: undefined,
		parents: (g.parent == null ? [] : [g.parent]).concat(g.merge),
		merge_parent: [],
		children: [],
		merge_children: [],
		branch_children: [],
		explored: false
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

function chart_graph({view, graph} = {}) {
	let C = prepare({graph: graph});
	place_i({C: C});
	place_j({C: C});
	for (let c of C) {
		c.i += 1;
		c.j += 1;
	}
	const row = Math.max.apply(Math, C.map(c => c.i));
	const col = Math.max.apply(Math, C.map(c => c.j));
	for (let c of C)
		c.j = col - c.j + 1;
	const node = C.map(c => bubble({
		element: create_button({
			text: c.id,
			style: create_area(c.j, c.i, 1, 1)
		}),
		listener: listener_click,
		event: 'graph-select',
		detail: c.graph
	}));
	let subgrid = {
		...create_area(1, 1, col, row), ...create_grid('subgrid', 'subgrid')
	};
	let view_link = create_div({style: subgrid});
	replace_row({
		element: view,
		sub_row: row,
		children: [
			create_column({row: 'subgrid', sub_col: col, unit: '1fr', span: false, children: [view_link, create_div({children: node, style: subgrid})]}),
			create_column({sub_col: 1, children: C.map(c => create_p({text: c.description, classes: ['expand']}))})
		]
	});
	listener_resize({element: view_link, callback: () => chart_link({view: view_link, row: row, col: col, C: C, node: node})});
}

function chart_link({view, row, col, C, node} = {}) {
	const row_div = create_range({stop: row}).map(
		i => create_div({style: {width: 'auto', height: 'auto', ...create_area(1, undefined, col, undefined)}})
	);
	const col_div = create_range({stop: col}).map(
		i => create_div({style: {width: 'auto', height: 'auto', ...create_area(undefined, 1, undefined, row)}})
	);
	replace_content({element: view, children: col_div});
	const rw = col_div.map(div => div.getBoundingClientRect().width);
	replace_content({element: view, children: row_div});
	const rh = row_div.map(div => div.getBoundingClientRect().height);
	const nj = C.reduce((nj, c, i) => {
		const css = window.getComputedStyle(node[i]);
		nj[c.j - 1] = {
			ml: parseInt(css['margin-left']),
			bw: node[i].getBoundingClientRect().width,
			mr: parseInt(css['margin-right'])
		};
		return nj;
	}, []);
	const ni = C.reduce((ni, c, i) => {
		const css = window.getComputedStyle(node[i]);
		ni[c.i - 1] = {
			mt: parseInt(css['margin-top']),
			bh: node[i].getBoundingClientRect().height,
			mb: parseInt(css['margin-bottom'])
		};
		return ni;
	}, []);
	replace_content({
		element: view,
		children: [
			...C.flatMap(c => {
				const l = Math.min.apply(Math, [c, ...c.branch_children].map(d => d.j));
				const w = Math.max.apply(Math, [c, ...c.branch_children].map(d => d.j)) - l + 1;
				return w == 1 ? [] : create_horizontal_fit({x: l, y: c.i, w: w, h: 1, rw: rw, rh: rh, nj: nj, ni: ni});
			}),
			...C.flatMap(c => c.branch_children.map(d =>
				create_vertical_fit({x: d.j, y: d.i, w: 1, h: c.i - d.i + 1, rw: rw, rh: rh, nj: nj, ni: ni})
			)),
			...C.flatMap(c => {
				const l = Math.min.apply(Math, [c, ...c.merge_parent].map(d => d.j));
				const w = Math.max.apply(Math, [c, ...c.merge_parent].map(d => d.j)) - l + 1;
				return w == 1 ? [] : create_horizontal_fit({x: l, y: c.i, w: w, h: 1, rw: rw, rh: rh, nj: nj, ni: ni, dasharray: [4, 4]});
			}),
			...C.flatMap(c => c.merge_parent.map(d =>
				create_vertical_fit({x: d.j, y: c.i, w: 1, h: d.i - c.i + 1, rw: rw, rh: rh, nj: nj, ni: ni, dasharray: [4, 4]})
			)),
		]
	});
}

function create_svg_fit({x, y, w, h, sw, sh, children} = {}) {
	return create_div({
		children: [
			create_svg({
				viewbox: [0, 0, sw, sh],
				children: children,
				style: {
					'min-width': '100%',
					'min-height': '100%',
					width: 0,
					height: 0
				}
			})
		],
		style: {
			width: 'auto',
			height: 'auto',
			...create_area(x, y, w, h)
		}
	});
}

function create_horizontal_fit({x, y, w, h, rw, rh, nj, ni, width = 1.0, ...args} = {}) {
	const fx = x - 1, lx = x + w - 2;
	const fy = y - 1, ly = y + h - 2;
	return create_svg_fit({
		x: x, y: y, w: w, h: h,
		sw: rw.slice(fx, lx + 1).reduce((sum, x) => sum += x, 0.0),
		sh: rh.slice(fy, ly + 1).reduce((sum, x) => sum += x, 0.0),
		children: [create_polyline({
			points: [
				nj[fx].ml + 0.5 * nj[fx].bw - 0.5 * width,
				ni[fy].mt + 0.5 * ni[fy].bh,
				rw.slice(fx, lx).reduce((sum, x) => sum += x, 0.0) + nj[lx].ml + 0.5 * nj[lx].bw + 0.5 * width,
				ni[fy].mt + 0.5 * ni[fy].bh
			],
			...args
		})]
	});
}

function create_vertical_fit({x, y, w, h, rw, rh, nj, ni, width = 1.0, ...args} = {}) {
	const fx = x - 1, lx = x + w - 2;
	const fy = y - 1, ly = y + h - 2;
	return create_svg_fit({
		x: x, y: y, w: w, h: h,
		sw: rw.slice(fx, lx + 1).reduce((sum, x) => sum += x, 0.0),
		sh: rh.slice(fy, ly + 1).reduce((sum, x) => sum += x, 0.0),
		children: [create_polyline({
			points: [
				nj[fx].ml + 0.5 * nj[fx].bw,
				ni[fy].mt + 0.5 * ni[fy].bh - 0.5 * width,
				nj[fx].ml + 0.5 * nj[fx].bw,
				rh.slice(fy, ly).reduce((sum, x) => sum += x, 0.0) + ni[ly].mt + 0.5 * ni[ly].bh + 0.5 * width
			],
			...args
		})]
	});
}

function J({c, F} = {}) {
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

function place_i({C} = {}) {
	C.sort((c, d) => c.timestamp < d.timestamp ? 1 : -1);
	function dfs({c} = {}) {
		if (!c.explored) {
			c.explored = true;
			for (let d of c.children)
				dfs({c: d});
			c.i = i;
			i += 1;
		}
	}
	let i = 0;
	for (let c of C)
		dfs({c: c});
}

function place_j({C} = {}) {
	C.sort((c, d) => c.i > d.i ? 1 : -1);
	let F = [];
	let B = [];
	for (const c of C) {
		let  Jc = J({c: c, F: F});
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
