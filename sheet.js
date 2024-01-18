const mst_df1 = [
	{'id': 1, 'dimension': 'Growth/Acquisition', 'explanation': 'The enterprise has a focus on growing (revenues).'},
	{'id': 2, 'dimension': 'Innovation/Differentiation', 'explanation': 'The enterprise has a focus on offering different and/or innovative products and services to their clients.'},
	{'id': 3, 'dimension': 'Cost Leadership', 'explanation': 'The enterprise has a focus on short-term cost minimization.'},
	{'id': 4, 'dimension': 'Client Service/Stability', 'explanation': 'The enterprise has a focus on providing stable and client-oriented service.'}
];

const trs_df1_dm = mst_df1.length;
const trs_df1_lo = 1;
const trs_df1_hi = 5;
const trs_df1_ra = trs_df1_hi - trs_df1_lo + 1;

const trs_df1_baseline = [
	{'id': 1, 'value': 3,},
	{'id': 2, 'value': 3,},
	{'id': 3, 'value': 3,},
	{'id': 4, 'value': 3,}
];

function grid_place(o, r, c, h, w) {
	o.style['grid-row-start'] = r;
	o.style['grid-row-end'] = r + h;
	o.style['grid-column-start'] = c;
	o.style['grid-column-end'] = c + w;
}

function checkout(history, commit, edit, merge, view, graph) {

	chart_graph(history, graph, view);

	view.innerHTML = '';
	view.style['display'] = 'grid';
	view.style['overflow-x'] = 'auto';

	if (edit) {

		let tem_col = '12fr';
		merge.forEach(() => tem_col += ' 2fr 6fr 5fr 3fr');
		tem_col += `repeat(${trs_df1_ra}, 2fr) 6fr`;
		tem_col += ' 2fr 6fr 5fr 3fr';

		view.style['grid-template-rows'] = `repeat(${4 + trs_df1_dm * 2}, auto)`;
		view.style['grid-template-columns'] = tem_col;

		let col = 1;
		col = dimension_view(view, col);
		merge.forEach((m) => {
			col = snapshot_view(view, col, 'Merging commit', history, m, -m.id, true);
		});
		col = change_view(view, col);
		col = snapshot_view(view, col, 'Editing commit', history, commit, 'old', true);
		baseline_view(view, col);
		commit_view(view, history, commit, graph);

	}
	else {

		view.style['grid-template-rows'] = `repeat(${5 + trs_df1_dm * 2}, auto)`;
		view.style['grid-template-columns'] = `12fr 2fr 6fr 5fr 3fr 2fr`;

		let col = 1;
		col = dimension_view(view, col);
		col = snapshot_view(view, col, 'Viewing commit', history, commit, 'old', false);
		baseline_view(view, col);
		edit_view(view, history, commit, graph);

	}

}

function dimension_view(view, col) {
	{
		let p = document.createElement('p');
		const t = document.createTextNode('Dimensions');
		grid_place(p, 1, col, 1, 1);
		p.appendChild(t);
		view.appendChild(p);
	}
	mst_df1.forEach((d) => {
		let p1 = document.createElement('p');
		let e = document.createElement('details');
		let s = document.createElement('summary');
		let p2 = document.createElement('p');
		const t1 = document.createTextNode(d.dimension);
		const t2 = document.createTextNode(d.explanation);
		grid_place(p1, d.id * 2 + 1, col, 2, 1);
		s.appendChild(t1);
		p2.appendChild(t2);
		e.appendChild(s);
		e.appendChild(p2);
		p1.appendChild(e);
		view.appendChild(p1);
	});
	return col + 1;
}

function change_view(view, col) {
	{
		let p = document.createElement('p');
		const t = document.createTextNode('Change');
		grid_place(p, 1, col, 1, trs_df1_ra + 1);
		p.appendChild(t);
		view.appendChild(p);
	}
	mst_df1.forEach((d) => {
		for (let v = trs_df1_lo; v <= trs_df1_hi; ++v) {
			let p = document.createElement('p');
			let L = document.createElement('label');
			let I = document.createElement('input');
			const t = document.createTextNode(v);
			grid_place(p, d.id * 2 + 1, col + v - trs_df1_lo, 1, 1);
			I.setAttribute('type', 'radio');
			I.setAttribute('name', `df1 ${d.id} value`);
			I.setAttribute('value', v);
			L.appendChild(I);
			L.appendChild(t);
			p.appendChild(L);
			view.appendChild(p);
		}
	});
	mst_df1.forEach((d) => {
		let p = document.createElement('p');
		let I = document.createElement('textarea');
		grid_place(p, d.id * 2 + 1, col + trs_df1_ra, 1, 1);
		I.setAttribute('rows', 1);
		I.style['width'] = 'calc(100% - 1rem)';
		I.style['min-width'] = '6rem';
		I.setAttribute('name', `df1 ${d.id} comment`);
		p.appendChild(I);
		view.appendChild(p);
	});
	return col + trs_df1_ra + 1;
}

function snapshot_view(view, col, header, history, commit, value, active) {
	const snapshot = mst_df1.map((d) => {
		for (let p = commit, v = null;; p = p.parent) {
			const i = p.change.findIndex((e) => e.id == d.id);
			if (i == -1)
				continue;
			const c = p.change[i];
			return {
				'id': c.id,
				'value': c.value,
				'comment': c.comment,
				'commit': p.id,
				'author': p.author,
				'description': p.description
			}
		}
	});
	{
		{
			let p = document.createElement('p');
			const t = document.createTextNode(header);
			grid_place(p, 1, col, 1, 2);
			p.appendChild(t);
			view.appendChild(p);
		}
		{
			let D = document.createElement('div');
			let p1 = document.createElement('p');
			let p2 = document.createElement('p');
			let I = document.createElement('textarea');
			const t1 = document.createTextNode('by ');
			const t2 = document.createTextNode(commit.author);
			grid_place(D, 1, col + 2, 1, 1);
			D.style['display'] = 'grid';
			D.style['grid-template-columns'] = 'auto auto';
			p1.style['white-space'] = 'pre';
			I.setAttribute('rows', 1);
			I.style['width'] = 'calc(100% - 1rem)';
			I.style['min-width'] = '4rem';
			I.setAttribute('disabled', '');
			p1.appendChild(t1);
			I.appendChild(t2);
			p2.appendChild(I);
			D.appendChild(p1);
			D.appendChild(p2);
			view.appendChild(D);
		}
		{
			let p = document.createElement('p');
			let I = document.createElement('button');
			const t1 = document.createTextNode('from ');
			const t2 = document.createTextNode(commit.id);
			grid_place(p, 1, col + 3, 1, 1);
			I.setAttribute('type', 'button');
			p.appendChild(t1);
			I.appendChild(t2);
			p.appendChild(I);
			view.appendChild(p);
		}
		{
			let p = document.createElement('p');
			let I = document.createElement('textarea');
			const t = document.createTextNode(commit.description);
			grid_place(p, 2, col + 1, 1, 3);
			p.classList.add('reduced');
			I.setAttribute('rows', 1);
			I.style['width'] = 'calc(100% - 1rem)';
			I.setAttribute('disabled', '');
			I.appendChild(t);
			p.appendChild(I);
			view.appendChild(p);
		}
	}
	snapshot.forEach((d) => {
		let p = document.createElement('p');
		let L = document.createElement('label');
		let I = document.createElement('input');
		const t = document.createTextNode(d.value);
		grid_place(p, d.id * 2 + 1, col, 1, 1);
		I.setAttribute('type', 'radio');
		I.setAttribute('name', `df1 ${d.id} value`);
		I.setAttribute('value', value);
		I.setAttribute('checked', '');
		if (!active)
			I.setAttribute('disabled', '');
		L.appendChild(I);
		L.appendChild(t);
		p.appendChild(L);
		view.appendChild(p);
	});
	snapshot.forEach((d) => {
		let p = document.createElement('p');
		let I = document.createElement('textarea');
		const t = document.createTextNode(d.comment);
		grid_place(p, d.id * 2 + 1, col + 1, 1, 1);
		I.setAttribute('rows', 1);
		I.style['width'] = 'calc(100% - 1rem)';
		I.style['min-width'] = '6rem';
		I.setAttribute('disabled', '');
		I.appendChild(t);
		p.appendChild(I);
		view.appendChild(p);
	});
	snapshot.forEach((d) => {
		let D = document.createElement('div');
		let p1 = document.createElement('p');
		let p2 = document.createElement('p');
		let I = document.createElement('textarea');
		const t1 = document.createTextNode('by ');
		const t2 = document.createTextNode(d.author);
		grid_place(D, d.id * 2 + 1, col + 2, 1, 1);
		D.style['display'] = 'grid';
		D.style['grid-template-columns'] = 'auto auto';
		p1.style['white-space'] = 'pre';
		I.setAttribute('rows', 1);
		I.style['width'] = 'calc(100% - 1rem)';
		I.style['min-width'] = '4rem';
		I.setAttribute('disabled', '');
		p1.appendChild(t1);
		I.appendChild(t2);
		p2.appendChild(I);
		D.appendChild(p1);
		D.appendChild(p2);
		view.appendChild(D);
	});
	snapshot.forEach((d) => {
		let p = document.createElement('p');
		let I = document.createElement('button');
		const t1 = document.createTextNode('from ');
		const t2 = document.createTextNode(d.commit);
		grid_place(p, d.id * 2 + 1, col + 3, 1, 1);
		I.setAttribute('type', 'button');
		p.appendChild(t1);
		I.appendChild(t2);
		p.appendChild(I);
		view.appendChild(p);
	});
	snapshot.forEach((d) => {
		let p = document.createElement('p');
		let I = document.createElement('textarea');
		const t = document.createTextNode(d.description);
		grid_place(p, d.id * 2 + 1 + 1, col + 1, 1, 3);
		p.classList.add('reduced');
		I.setAttribute('rows', 1);
		I.style['width'] = 'calc(100% - 1rem)';
		I.setAttribute('disabled', '');
		I.appendChild(t);
		p.appendChild(I);
		view.appendChild(p);
	});
	return col + 4;
}

function baseline_view(view, col) {
	{
		let p = document.createElement('p');
		const t = document.createTextNode('Baseline');
		grid_place(p, 1, col, 1, 1);
		p.style['overflow-x'] = 'hidden';
		p.appendChild(t);
		view.appendChild(p);
	}
	trs_df1_baseline.forEach((d) => {
		let p = document.createElement('p');
		const t = document.createTextNode(d.value);
		grid_place(p, d.id * 2 + 1, col, 1, 1);
		p.style['text-align'] = 'center';
		p.appendChild(t);
		view.appendChild(p);
	});
	return col + 1;
}

function commit_view(view, history, commit, graph) {
	const row = 3 + trs_df1_dm * 2;
	{
		let p = document.createElement('p');
		const t = document.createTextNode('Author');
		grid_place(p, row, 1, 1, 1);
		p.appendChild(t);
		view.appendChild(p);
	}
	{
		let p = document.createElement('p');
		let I = document.createElement('textarea');
		grid_place(p, row + 1, 1, 1, 1);
		p.classList.add('reduced');
		I.style['width'] = 'calc(100% - 1rem)';
		I.setAttribute('rows', 2);
		I.setAttribute('name', 'author');
		p.appendChild(I);
		view.appendChild(p);
	}
	{
		let p = document.createElement('p');
		const t = document.createTextNode('Description');
		grid_place(p, row, 2, 1, trs_df1_ra + 1);
		p.appendChild(t);
		view.appendChild(p);
	}
	{
		let p = document.createElement('p');
		let I = document.createElement('textarea');
		grid_place(p, row + 1, 2, 1, trs_df1_ra + 1);
		p.classList.add('reduced');
		I.style['width'] = 'calc(100% - 1rem)';
		I.setAttribute('rows', 4);
		I.setAttribute('name', 'description');
		p.appendChild(I);
		view.appendChild(p);
	}
	{
		let p = document.createElement('p');
		let I = document.createElement('button');
		const t = document.createTextNode('Commit');
		grid_place(p, row + 2, 1, 1, 1);
		I.setAttribute('type', 'button');
		I.onclick = () => {

			const change = mst_df1.reduce((change, d) => {
				const v = document.querySelector(
					`input[name="df1 ${d.id} value"]:checked`
				).value;
				if (v != 'old') {
					const C = document.querySelector(
						`textarea[name="df1 ${d.id} comment"]`
					).value;
					change.push({
						'id': d.id, 'inherit': false, 'value': v, 'comment': C
					});
				}
				return change;
			}, []);

			const author = document.querySelector('textarea[name="author"]').value;
			const description = document.querySelector('textarea[name="description"]').value;

			const new_commit = {
				'id': history.length,
				'parent': commit,
				'merge': [],
				'change': change,
				'author': author,
				'description': description,
				'timestamp': Date.now()
			};

			history.push(new_commit);

			checkout(history, new_commit, false, [], view, graph);

		};
		I.appendChild(t);
		p.appendChild(I);
		view.appendChild(p);
	}
	{
	const row = 3 + trs_df1_dm * 2;
	let p = document.createElement('p');
	let I = document.createElement('button');
	const t = document.createTextNode('Discard');
		grid_place(p, row + 2, 2, 1, 1);
		I.setAttribute('type', 'button');
		I.onclick = () => {
			checkout(history, commit, false, [], view, graph);
		};
		I.appendChild(t);
		p.appendChild(I);
		view.appendChild(p);
	}
}

function edit_view(view, history, commit, graph) {
	const row = 3 + trs_df1_dm * 2;
	let p = document.createElement('p');
	let I = document.createElement('button');
	const t = document.createTextNode('Edit');
	grid_place(p, row + 2, 1, 1, 1);
	I.setAttribute('type', 'button');
	I.onclick = () => {
		checkout(history, commit, true, [], view, graph);
	};
	I.appendChild(t);
	p.appendChild(I);
	view.appendChild(p);
}
