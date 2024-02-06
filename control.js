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
			create_div({
				children: [
					bubble({element: create_button('Modify'), listener: listener_click, event: 'control-modify'})
				],
				classes: ['flex-start']
			})
		]);
	}

	modify({parent, alter, merge, context} = {}) {
		replace_content(this, [
				create_div({
					children: [
						bubble({element: create_toggle_radio({text: 'Parent', name: 'context', checked: context == 'parent'}), listener: listener_change, event: 'control-parent'}),
						create_p(parent == null ? 'None' : parent.id),
						bubble({element: create_toggle_radio({text: 'Merge', name: 'context', checked: context == 'merge'}), listener: listener_change, event: 'control-merge'}),
						create_p('[' + merge.map(m => m.id).join(', ') + ']'),
						bubble({element: create_toggle_checkbox({text: 'New', checked: alter}), listener: listener_click, event: 'control-alter'})
					],
					classes: ['flex-start']
				}),
				create_div({
					children: [
						...apply_label(
							create_label({text: 'Description'}),
							create_textarea('description', 1)
						),
						bubble({element: create_button('Commit'), listener: listener_click, event: 'control-save'}),
						bubble({element: create_button('Discard'), listener: listener_click, event: 'control-discard'})
					],
					classes: ['flex-end']
				})
		]);
	}
}

export default control;
