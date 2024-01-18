function chart_graph(graph, view, input) {

		let C = graph.map((g) => ({
			'name': g.id,
			'timestamp': g.timestamp,
			'i': undefined,
			'j': undefined,
			'parents': ((g.parent == null) ? [] : [g.parent]),
			'children': [],
			'merge': [],
			'branch': [],
			'explored': false
		}));

		C.forEach((c) => {
			c.parents = c.parents.map((d) => C[C.findIndex((e) => e.name == d.id)]);
		});

		C.forEach((c) => {
			c.children = C.filter((d) => d.parents.includes(c));
			c.branch = c.children.filter((d) => d.parents[0] == c);
			c.merge = c.children.filter((d) => d.parents[0] != c);
		});

		C.sort((c, d) => (c.timestamp < d.timestamp) ? 1 : -1);

		{
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

		C.sort((c, d) => (c.i > d.i) ? 1 : -1);
		let F = [];

		function J(c) {
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

		let B = [];
		C.forEach((c) => {
			let  Jc = J(c);
			let nJc = c.branch.filter((d) => !Jc.includes(d.j));
			let  D_ = [];
			if (nJc.length > 0) {
				d = nJc[0];
				D_.push(d);
				B[B.findIndex((e) => e == d)] = c;
			} else {
				B.push(c);
			}
			let nD_ = c.branch.filter((d) => !D_.includes(d));
			nD_.forEach((d_) => B[d_.j] = null);
			c.j = B.findIndex((d) => d == c);

			F.push(B.map((b) => (b == null) ? null : b.name));
			F_col = Math.max.apply(Math, F.map((f) => f.length));
			F.forEach((f) => {
				while (f.length < F_col)
					f.push(null);
			});
		});

		C.forEach((c) => {
			let tmp = c.i;
			c.i = c.j;
			c.j = tmp;
		});

		const row = Math.max.apply(Math, C.map((c) => c.i)) + 1;
		const col = Math.max.apply(Math, C.map((c) => c.j)) + 1;

		C.forEach((c) => {c.j = col - c.j - 1; c.i = row - c.i - 1;});

		view.innerHTML = '';
		view.style['width'] = 'fit-content';
		view.style['display'] = 'grid';
		view.style['grid-template-rows'] = `repeat(${row}, 1fr)`;
		view.style['grid-template-columns'] = `repeat(${col}, 1fr)`;

		C.forEach((c) => {
			let I = document.createElement('button');
			let t = document.createTextNode(c.name);
			I.appendChild(t);
			I.style['text-align'] = 'center';
			I.style['grid-row-start'] = c.i + 1;
			I.style['grid-row-end'] = c.i + 2;
			I.style['grid-column-start'] = c.j + 1;
			I.style['grid-column-end'] = c.j + 2;
			I.setAttribute('type', 'button');
			I.onclick = () => {
				checkout(graph,
					graph[graph.findIndex((g) => g.id == c.name)],
				input, view);
			};
			view.appendChild(I);
		});

		C.forEach((c) => {c.children.forEach((b) => {
			const p = {
				'l': Math.min(c.j, b.j) + 1,
				'r': Math.max(c.j, b.j) + 2,
				't': Math.min(c.i, b.i) + 1,
				'b': Math.max(c.i, b.i) + 2
			};
			let d = document.createElement('div');
			d.style['grid-row-start'] = p.t;
			d.style['grid-row-end'] = p.b;
			d.style['grid-column-start'] = p.l;
			d.style['grid-column-end'] = p.r;
			d.style['z-index'] = -10;
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
			if (c.i == b.i)
				l.setAttribute('points', `${0.5 * a.w} ${0.5 * a.h} ${(m.w - 0.5) * a.w} ${0.5 * a.h}`);
			else
				if (c.branch.includes(b))
					if (c.i < b.i)
						l.setAttribute('points', `${0.5 * a.w} ${0.5 * a.h} ${0.5 * a.w} ${(m.h - 0.5) * a.h} ${(m.w - 0.5) * a.w} ${(m.h - 0.5) * a.h}`);
					else
						l.setAttribute('points', `${0.5 * a.w} ${(m.h - 0.5) * a.h} ${0.5 * a.w} ${0.5 * a.h} ${(m.w - 0.5) * a.w} ${0.5 * a.h}`);
				else
					if (c.i < b.i)
						l.setAttribute('points', `${0.5 * a.w} ${0.5 * a.h} ${(m.w - 0.5) * a.w} ${0.5 * a.h} ${(m.w - 0.5) * a.w} ${(m.h - 0.5) * a.h}`);
					else
						l.setAttribute('points', `${0.5 * a.w} ${(m.h - 0.5) * a.h} ${(m.w - 0.5) * a.w} ${(m.h - 0.5) * a.h} ${(m.w - 0.5) * a.w} ${0.5 * a.h}`);
			s.appendChild(l);
			d.appendChild(s);
		})});

}
