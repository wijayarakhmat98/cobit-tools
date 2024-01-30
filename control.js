import {
	create_grid,
	replace_content,
	create_div,
	create_p,
	create_textarea,
	create_button
}
from 'component';

function chart_control(view, commit, callback) {
	replace_content(view, [...(commit.length == 1 ?
		[create_button('Modify', callback.edit)]
			:
		[
			create_description(),
			create_button('Commit', callback.save),
			create_button('Discard', callback.discard)
		]
	)]);
}

function create_description() {
	return create_div(
		[
			create_p('Description'),
			create_textarea('description', 1)
		],
		[], create_grid(undefined, 2, true)
	);
}

export default chart_control;
