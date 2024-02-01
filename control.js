import {
	listener_click,
	apply_label,
	replace_content,
	create_div,
	create_p,
	create_label,
	create_toggle_radio,
	create_toggle_checkbox,
	create_textarea,
	create_button
}
from 'component';

function chart_control(view, commit, callback) {
	replace_content(view, [...(commit.length == 1 ?
		[
			create_div(
				[
					listener_click(create_button('Modify'), callback.edit)
				],
				['flex-start']
			)
		]
			:
		[
			create_div(
				[
					create_toggle_radio('mode', 'parent', 'Parent', true),
					create_p(commit[0].id),
					create_toggle_radio('mode', 'merge', 'Merge'),
					create_p('[' + commit.slice(2).map(c => c.id).join(', ') + ']'),
					create_toggle_checkbox('new', 'new', 'New', true)
				],
				['flex-start']
			),
			create_div(
				[
					...apply_label(
						create_label('Description'),
						create_textarea('description', 1)
					),
					listener_click(create_button('Commit'), callback.save),
					listener_click(create_button('Discard'), callback.discard)
				],
				['flex-end']
			)
		]
	)]);
}

export default chart_control;
