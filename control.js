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
		[
			create_div(
				[
					create_button('Modify', callback.edit)
				],
				['flex-start']
			)
		]
			:
		[
			create_div(
				[
					create_p('Parent'),
					create_p(commit[0].id, ['expand']),
					create_p('Merge'),
					create_p(commit.slice(2).map(c => c.id).join(', '), ['expand']),
				],
				['flex-start']
			),
			create_div(
				[
					create_p('Description'),
					create_textarea('description', 1),
					create_button('Commit', callback.save),
					create_button('Discard', callback.discard)
				],
				['flex-end']
			)
		]
	)]);
}

export default chart_control;
