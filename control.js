import {
	bubble,
	listener_click,
	listener_change,
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

class control extends HTMLElement {
	constructor({} = {}) {
		super();
	}

	view({} = {}) {
		replace_content(this, [
			create_div(
				[
					bubble(listener_click, create_button('Modify'), 'control-modify')
				],
				['flex-start']
			)
		]);
	}

	modify({parent, alter, merge, context} = {}) {
		replace_content(this, [
				create_div(
					[
						bubble(listener_change, create_toggle_radio('mode', 'parent', 'Parent', context == 'parent'), 'control-parent'),
						create_p(parent.id),
						bubble(listener_change, create_toggle_radio('mode', 'merge', 'Merge', context == 'merge'), 'control-merge'),
						create_p('[' + merge.map(m => m.id).join(', ') + ']'),
						create_toggle_checkbox('new', 'new', 'New', alter)
					],
					['flex-start']
				),
				create_div(
					[
						...apply_label(
							create_label('Description'),
							create_textarea('description', 1)
						),
						bubble(listener_click, create_button('Commit'), 'control-save'),
						bubble(listener_click, create_button('Discard'), 'control-discard')
					],
					['flex-end']
				)
		]);
	}
}

export default control;
