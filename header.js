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
		create_details_proxy('Tree', [], [view_graph], true),
		create_username()
	]);
}

function create_username() {
	return create_div(
		[
			create_p('Username'),
			create_textarea('username', 1)
		],
		['username'], create_grid(undefined, 2, true)
	);
}

export default chart_header;
