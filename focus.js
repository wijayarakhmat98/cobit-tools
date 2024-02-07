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

	view({focus} = {}) {
		replace_content({
			element: this,
			children: [
				create_div({
					children: [
						bubble({
							element: create_toggle_radio({text: 'DF1', name: 'focus', checked: focus == 'DF1'}),
							listener: listener_change, event: 'focus-change', detail: 'DF1'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF2', name: 'focus', checked: focus == 'DF2'}),
							listener: listener_change, event: 'focus-change', detail: 'DF2'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF3', name: 'focus', checked: focus == 'DF3'}),
							listener: listener_change, event: 'focus-change', detail: 'DF3'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF4', name: 'focus', checked: focus == 'DF4'}),
							listener: listener_change, event: 'focus-change', detail: 'DF4'
						}),
						bubble({
							element: create_toggle_radio({text: 'S2', name: 'focus', checked: focus == 'S2'}),
							listener: listener_change, event: 'focus-change', detail: 'S2'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF5', name: 'focus', checked: focus == 'DF5'}),
							listener: listener_change, event: 'focus-change', detail: 'DF5'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF6', name: 'focus', checked: focus == 'DF6'}),
							listener: listener_change, event: 'focus-change', detail: 'DF6'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF7', name: 'focus', checked: focus == 'DF7'}),
							listener: listener_change, event: 'focus-change', detail: 'DF7'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF8', name: 'focus', checked: focus == 'DF8'}),
							listener: listener_change, event: 'focus-change', detail: 'DF8'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF9', name: 'focus', checked: focus == 'DF9'}),
							listener: listener_change, event: 'focus-change', detail: 'DF9'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF10', name: 'focus', checked: focus == 'DF10'}),
							listener: listener_change, event: 'focus-change', detail: 'DF10'
						}),
						bubble({
							element: create_toggle_radio({text: 'S3', name: 'focus', checked: focus == 'S3'}),
							listener: listener_change, event: 'focus-change', detail: 'S3'
						}),
						bubble({
							element: create_toggle_radio({text: 'S4', name: 'focus', checked: focus == 'S4'}),
							listener: listener_change, event: 'focus-change', detail: 'S4'
						})
					],
					classes: ['flex-start']
				})
			]
		});
	}
}

export default focus;
