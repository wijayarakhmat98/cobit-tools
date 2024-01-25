import {
	create_grid,
	replace_content,
	create_div,
	create_p,
	create_details_proxy,
	create_textarea,
	create_button
}
from 'component';

function chart_control(view, view_graph, commit) {
	replace_content(view, [
		create_details_proxy('Tree', [], [view_graph]),
		create_button('Edit'),
		create_div(
			[
				create_p('Username'),
				create_textarea('user', 1)
			],
			['username'], create_grid(undefined, 2, true)
		),
	]);
}

export default chart_control;
