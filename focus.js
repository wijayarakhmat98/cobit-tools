import {
	bubble,
	listener_change,
	replace_content,
	create_div,
	create_toggle_radio
}
from 'component';

class focus extends HTMLElement {
	constructor({} = {}) {
		super();
	}

	view({list, focus} = {}) {
		replace_content({
			element: this,
			children: [
				create_div({
					children: list.map(f => bubble({
						element: create_toggle_radio({
							text: f.code,
							name: 'focus',
							checked: focus.id == f.id
						}),
						listener: listener_change,
						event: 'focus-change',
						detail: f
					})),
					classes: ['flex-start']
				})
			]
		});
	}
}

export default focus;
