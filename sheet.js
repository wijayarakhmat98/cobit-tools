import {
	mst_df1,
	trs_df1_baseline,
	trs_df1_dm,
	trs_df1_lo,
	trs_df1_hi,
	trs_df1_ra
}
from 'master';

import chart_graph from 'graph';
import chart_gmo from 'gmo';

function grid_place(o, r, c, h, w) {
	o.style['grid-row-start'] = r;
	o.style['grid-row-end'] = r + h;
	o.style['grid-column-start'] = c;
	o.style['grid-column-end'] = c + w;
}

function checkout(history, commit, edit, merge, view, graph, gmo) {

	chart_graph(history, graph, view, edit, commit, gmo);

	view.innerHTML = '';
	view.style['display'] = 'inline-grid';

	let snapshot = {};

	if (edit) {

		let tem_col = 'auto';
		merge.forEach(() => tem_col = tem_col.concat(' auto auto auto auto'));
		tem_col = tem_col.concat(` repeat(${trs_df1_ra}, auto) auto`);
		tem_col = tem_col.concat(' auto auto auto auto');
		tem_col = tem_col.concat(' auto');

		let width = 1;
		merge.forEach(() => width += 1);
		width += trs_df1_ra + 1;
		width += 4;
		width += 1;

		view.style['grid-template-rows'] = `repeat(${4 + (1 + trs_df1_dm) * 3}, auto)`;
		view.style['grid-template-columns'] = tem_col;

		horizontal_bar(view, 4, width);

		snapshot['old'] = build_snapshot(commit);
		merge.forEach((m) => { snapshot[`${-m.id - 1}`] = build_snapshot(m); });

		let col = 1;
		col = dimension_view(view, col);
		merge.forEach((m) => {
			col = snapshot_view(view, col, 'Merging commit', commit, snapshot[`${-m.id - 1}`], snapshot, -m.id - 1, true, gmo);
		});
		col = change_view(view, col, (merge.length > 0) ? 'Resolution' : 'Change', gmo, snapshot);
		col = snapshot_view(view, col, 'Editing commit', commit, snapshot['old'], snapshot, 'old', true, gmo);
		baseline_view(view, col);
		commit_view(view, history, commit, merge, graph, gmo);

	}
	else {

		view.style['grid-template-rows'] = `repeat(${2 + (1 + trs_df1_dm) * 3}, auto)`;
		view.style['grid-template-columns'] = `auto auto auto auto auto auto`;

		horizontal_bar(view, 4, 6);

		snapshot['old'] = build_snapshot(commit);

		let col = 1;
		col = dimension_view(view, col);
		col = snapshot_view(view, col, 'Viewing commit', commit, snapshot['old'], snapshot, 'old', false, gmo);
		baseline_view(view, col);
		edit_view(view, history, commit, graph, gmo);

	}

	chart_gmo(gmo, snapshot);

}

function horizontal_bar(view, row, width) {
	let p = document.createElement('p');
	const hr = document.createElement('hr');
	grid_place(p, row, 1, 1, width);
	p.style['margin'] = 0;
	p.appendChild(hr);
	view.appendChild(p);
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
		grid_place(p1, d.id * 3 + 3, col, 2, 1);
		s.appendChild(t1);
		p2.appendChild(t2);
		e.appendChild(s);
		e.appendChild(p2);
		p1.appendChild(e);
		view.appendChild(p1);
	});
	return col + 1;
}

function change_view(view, col, header, view_gmo, all_snapshot) {
	{
		let p = document.createElement('p');
		const t = document.createTextNode(header);
		grid_place(p, 1, col, 1, trs_df1_ra + 1);
		p.appendChild(t);
		view.appendChild(p);
	}
	mst_df1.forEach((d) => {
		for (let v = trs_df1_lo; v <= trs_df1_hi; ++v) {
			let p = document.createElement('p');
			let L = document.createElement('label');
			let I = document.createElement('input');
			const t = document.createTextNode(` ${v}`);
			grid_place(p, d.id * 3 + 3, col + v - trs_df1_lo, 1, 1);
			I.setAttribute('type', 'radio');
			I.setAttribute('name', `df1 ${d.id} value`);
			I.setAttribute('value', v);
			I.onclick = () => { chart_gmo(view_gmo, all_snapshot); };
			L.appendChild(I);
			L.appendChild(t);
			p.appendChild(L);
			view.appendChild(p);
		}
	});
	mst_df1.forEach((d) => {
		let p = document.createElement('p');
		let I = document.createElement('textarea');
		grid_place(p, d.id * 3 + 3, col + trs_df1_ra, 1, 1);
		I.setAttribute('rows', 1);
		I.style['width'] = '6rem';
		I.setAttribute('name', `df1 ${d.id} comment`);
		p.appendChild(I);
		view.appendChild(p);
	});
	return col + trs_df1_ra + 1;
}

function snapshot_view(view, col, header, commit, snapshot, all_snapshot, value, active, view_gmo) {
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
			I.style['width'] = '4rem';
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
			I.onclick = () => {
				let details = document.getElementById(`${commit.id} header details`);
				if (details.style['display'] == 'none')
					details.style['display'] = 'grid';
				else
					details.style['display'] = 'none';
			};
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
		{
			let div = document.createElement('div');
			let tmp = document.createElement('div');
			let p = document.createElement('p');
			grid_place(div, 3, col, 1, 4);
			div.setAttribute('id', `${commit.id} header details`);
			div.style['display'] = 'none';
			div.style['grid-template-columns'] = 'subgrid';
			tmp.style['background-color'] = 'cyan';
			grid_place(tmp, 1, 1, 1, 2);
			tmp.append(p);
			div.appendChild(tmp);
			view.appendChild(div);
		}
	}
	snapshot.forEach((d) => {
		let div1 = document.createElement('div');
		let div2 = document.createElement('div');
		grid_place(div1, d.id * 3 + 3, col, 2, 4);
		div1.style['padding'] = '0.5rem';
		div2.style['width'] = '100%';
		div2.style['height'] = '100%';
		if (d.change == 'new')
			div2.style['background-color'] = 'lightgreen';
		if (d.change == 'inherit')
			div2.style['background-color'] = 'lightgray';
		div1.append(div2);
		view.appendChild(div1);
	});
	snapshot.forEach((d) => {
		let p = document.createElement('p');
		let L = document.createElement('label');
		let I = document.createElement('input');
		const t = document.createTextNode(` ${d.value}`);
		grid_place(p, d.id * 3 + 3, col, 1, 1);
		I.setAttribute('type', 'radio');
		I.setAttribute('name', `df1 ${d.id} value`);
		I.setAttribute('value', value);
		I.setAttribute('checked', '');
		if (!active)
			I.setAttribute('disabled', '');
		else
			I.onclick = () => { chart_gmo(view_gmo, all_snapshot); }
		L.appendChild(I);
		L.appendChild(t);
		p.appendChild(L);
		view.appendChild(p);
	});
	snapshot.forEach((d) => {
		let p = document.createElement('p');
		let I = document.createElement('textarea');
		const t = document.createTextNode(d.comment);
		grid_place(p, d.id * 3 + 3, col + 1, 1, 1);
		I.setAttribute('rows', 1);
		I.style['width'] = '6rem';
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
		grid_place(D, d.id * 3 + 3, col + 2, 1, 1);
		D.style['display'] = 'grid';
		D.style['grid-template-columns'] = 'auto auto';
		p1.style['white-space'] = 'pre';
		I.setAttribute('rows', 1);
		I.style['width'] = '4rem';
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
		grid_place(p, d.id * 3 + 3, col + 3, 1, 1);
		I.setAttribute('type', 'button');
		I.onclick = () => {
			let details = document.getElementById(`${commit.id} ${d.id} details`);
			if (details.style['display'] == 'none')
				details.style['display'] = 'grid';
			else
				details.style['display'] = 'none';
		};
		p.appendChild(t1);
		I.appendChild(t2);
		p.appendChild(I);
		view.appendChild(p);
	});
	snapshot.forEach((d) => {
		let p = document.createElement('p');
		let I = document.createElement('textarea');
		const t = document.createTextNode(d.description);
		grid_place(p, d.id * 3 + 3 + 1, col + 1, 1, 3);
		p.classList.add('reduced');
		I.setAttribute('rows', 1);
		I.style['width'] = 'calc(100% - 1rem)';
		I.setAttribute('disabled', '');
		I.appendChild(t);
		p.appendChild(I);
		view.appendChild(p);
	});
	snapshot.forEach((d) => {
		let div = document.createElement('div');
		let tmp = document.createElement('div');
		let p = document.createElement('p');
		grid_place(div, d.id * 3 + 3 + 2, col, 1, 4);
		div.setAttribute('id', `${commit.id} ${d.id} details`);
		div.style['display'] = 'none';
		div.style['grid-template-columns'] = 'subgrid';
		tmp.style['background-color'] = 'cyan';
		grid_place(tmp, 1, 1, 1, 2);
		tmp.append(p);
		div.appendChild(tmp);
		view.appendChild(div);
	});
	return col + 4;
}

function baseline_view(view, col) {
	{
		let p = document.createElement('p');
		const t = document.createTextNode('Baseline');
		grid_place(p, 1, col, 1, 1);
		p.appendChild(t);
		view.appendChild(p);
	}
	trs_df1_baseline.forEach((d) => {
		let p = document.createElement('p');
		const t = document.createTextNode(d.value);
		grid_place(p, d.id * 3 + 3, col, 1, 1);
		p.style['text-align'] = 'center';
		p.appendChild(t);
		view.appendChild(p);
	});
	return col + 1;
}

function commit_view(view, history, commit, merge, graph, gmo) {
	const row = 3 + (1 + trs_df1_dm) * 3;
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
		I.onclick = () => { save(history, commit, merge, view, graph, gmo); };
		I.appendChild(t);
		p.appendChild(I);
		view.appendChild(p);
	}
	{
		let p = document.createElement('p');
		let I = document.createElement('button');
		const t = document.createTextNode('Discard');
		grid_place(p, row + 2, 2, 1, 6);
		I.setAttribute('type', 'button');
		I.onclick = () => {
			checkout(history, commit, false, [], view, graph, gmo);
		};
		I.appendChild(t);
		p.appendChild(I);
		view.appendChild(p);
	}
}

function edit_view(view, history, commit, graph, gmo) {
	const row = 3 + (1 + trs_df1_dm) * 3;
	let p = document.createElement('p');
	let I = document.createElement('button');
	const t = document.createTextNode('Edit');
	grid_place(p, row, 1, 1, 1);
	I.setAttribute('type', 'button');
	I.onclick = () => {
		const merge = [...document.querySelectorAll('input[name=merge]:checked')]
			.sort((a, b) => (a < b) ? 1 : -1)
			.map((f) => f.value)
			.map((v) => history[history.findIndex((c) => c.id == v)]);
		checkout(history, commit, true, merge, view, graph, gmo);
	};
	I.appendChild(t);
	p.appendChild(I);
	view.appendChild(p);
}

function build_snapshot(commit) {
	return mst_df1.map((d) => {
		let change = 'new';
		for (let p = commit;;) {
			const i = p.change.findIndex((e) => e.id == d.id);
			if (i == -1) {
				if (change == 'new')
					change = 'old';
				if (p.parent == null)
					return {
						'change': change,
						'id': d.id,
						'value': trs_df1_baseline[trs_df1_baseline.findIndex((e) => e.id == d.id)].value,
						'comment': 'Baseline',
						'commit': p.id,
						'author': p.author,
						'description': p.description
					};
				p = p.parent;
				continue;
			}
			const c = p.change[i];
			if (c.inherit) {
				if (change == 'new')
					change = 'inherit';
				p = c.from;
				continue;
			}
			return {
				'change': change,
				'id': c.id,
				'value': c.value,
				'comment': c.comment,
				'commit': p.id,
				'author': p.author,
				'description': p.description
			}
		}
	});
}

function save(history, commit, merge, view, graph, gmo) {
	const change = mst_df1.reduce((change, d) => {
		const v = document.querySelector(
			`input[name="df1 ${d.id} value"]:checked`
		).value;
		if (v == 'old')
			return change;
		if (v < 0) {

			const id = -v - 1;
			const m = merge[merge.findIndex((m) => m.id == id)];
			change.push({
				'id': d.id, 'inherit': true, 'from': m
			});

		}
		else {

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
		'merge': merge,
		'change': change,
		'author': author,
		'description': description,
		'timestamp': Date.now()
	};

	history.push(new_commit);

	checkout(history, new_commit, false, [], view, graph, gmo);
}

export default checkout;
