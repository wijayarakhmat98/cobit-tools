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
					bubble({element: create_button('Modify'), listener: listener_click, event: 'control-modify'})
				],
				['flex-start']
			)
		]);
	}

	modify({parent, alter, merge, context} = {}) {
		replace_content(this, [
				create_div(
					[
						bubble({element: create_toggle_radio({text: 'Parent', checked: context == 'parent'}), listener: listener_change, event: 'control-parent'}),
						create_p(parent == null ? 'None' : parent.id),
						bubble({element: create_toggle_radio({text: 'Merge', checked: context == 'merge'}), listener: listener_change, event: 'control-merge'}),
						create_p('[' + merge.map(m => m.id).join(', ') + ']'),
						bubble({element: create_toggle_checkbox({text: 'New', checked: alter}), listener: listener_click, event: 'control-alter'})
					],
					['flex-start']
				),
				create_div(
					[
						...apply_label(
							create_label({text: 'Description'}),
							create_textarea('description', 1)
						),
						bubble({element: create_button('Commit'), listener: listener_click, event: 'control-save'}),
						bubble({element: create_button('Discard'), listener: listener_click, event: 'control-discard'})
					],
					['flex-end']
				)
		]);
	}
}

export default control;
