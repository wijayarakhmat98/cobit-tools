import {
	mst_df1
}
from 'master';

import chart_control from 'control';
import chart_graph from 'graph';
import chart_sheet from 'sheet';
import chart_gmo from 'gmo';

function checkout(history, commit, view_control, view_graph, view_sheet, view_gmo) {
	chart_graph(view_graph, history);
	chart_sheet(view_sheet, commit, () => chart_gmo(view_gmo));
	chart_gmo(view_gmo);
	const callback = {
		'edit': () => checkout(history, [...commit, null], view_control, view_graph, view_sheet, view_gmo),
		'discard': () => checkout(history, [commit[0]], view_control, view_graph, view_sheet, view_gmo),
		'save': () => {
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
						'comment': document.querySelector(
							`textarea[name="df1 ${d.id} comment"]`
						).value
					});
					return c;
				}, []),
				'author': document.querySelector('textarea[name="username"]').value,
				'description': '',
				'timestamp': Date.now()
			};
			history.push(new_commit);
			checkout(history, [new_commit], view_control, view_graph, view_sheet, view_gmo);
		}
	};
	chart_control(view_control, view_graph, commit, callback);
}

export default checkout;
