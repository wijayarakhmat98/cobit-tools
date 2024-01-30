import {
	create_grid,
	replace_content,
	create_div,
	create_p,
	create_details_proxy,
	create_textarea
}
from 'component';

function chart_header(view, view_graph) {
	replace_content(view, [
		create_div(
			[
				create_details_proxy('Tree', [], [view_graph], true)
			],
			['flex-start']
		),
		create_div(
			[
				create_p('Username'),
				create_textarea('username', 1)
			],
			['flex-end']
		)
	]);
}

function create_username() {
}

export default chart_header;
