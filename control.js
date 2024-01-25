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

function chart_control(view, view_graph, commit, callback) {
	replace_content(view, [
		create_details_proxy('Tree', [], [view_graph]),
		...(commit.length == 1
			? [create_button('Edit', callback.edit)]
			: [
				create_button('Discard', callback.discard),
				create_button('Save', callback.save)
			])
		, create_username()
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

export default chart_control;
