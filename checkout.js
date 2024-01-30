import {
	mst_df1
}
from 'master';

import chart_header from 'header';
import chart_graph from 'graph';
import chart_control from 'control';
import chart_sheet from 'sheet';
import chart_gmo from 'gmo';

function checkout(commit, history, view_header, view_graph, view_control, view_sheet, view_gmo) {
	const views = [view_header, view_graph, view_control, view_sheet, view_gmo];
	chart_graph(view_graph, history, commit.length == 1 ? commit => view(commit, history, ...views) : undefined);
	chart_sheet(view_sheet, commit, () => chart_gmo(view_gmo));
	chart_gmo(view_gmo);
	chart_header(view_header, view_graph);
	chart_control(view_control, commit, {
		'edit': () => edit(commit, history, ...views),
		'discard': () => discard(commit, history, ...views),
		'save': () => save(commit, history, ...views)
	});
}

function view(commit, ...argv) {
	checkout([commit], ...argv)
}

function edit(commit, ...argv) {
	checkout([...commit, null], ...argv);
}

function discard(commit, ...argv) {
	checkout([commit[0]], ...argv);
}

function save(commit, history, ...argv) {
	const new_commit = {
		'id': history.length,
		'parent': commit[0],
		'merge': [],
		'change': mst_df1.reduce((c, d) => {
			const v = JSON.parse(document.querySelector(
				`input[name="df1 ${d.id} value"]:checked`
			).value);
			if (v.from != null)
				return c;
			c.push({
				'id': d.id,
				'inherit': false,
				'value': v.value,
				'note': document.querySelector(
					`textarea[name="df1 ${d.id} note"]`
				).value
			});
			return c;
		}, []),
		'author': document.querySelector('textarea[name="username"]').value,
		'description': document.querySelector('textarea[name="description"]').value,
		'timestamp': Date.now()
	};
	history.push(new_commit);
	checkout([new_commit], history, ...argv);
}

export default checkout;
