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
							element: create_toggle_radio({text: 'DF1', name: 'focus', checked: focus == 'df1'}),
							listener: listener_change, event: 'focus-change', detail: 'df1'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF2', name: 'focus', checked: focus == 'df2'}),
							listener: listener_change, event: 'focus-change', detail: 'df2'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF3', name: 'focus', checked: focus == 'df3'}),
							listener: listener_change, event: 'focus-change', detail: 'df3'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF4', name: 'focus', checked: focus == 'df4'}),
							listener: listener_change, event: 'focus-change', detail: 'df4'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF5', name: 'focus', checked: focus == 'df5'}),
							listener: listener_change, event: 'focus-change', detail: 'df5'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF6', name: 'focus', checked: focus == 'df6'}),
							listener: listener_change, event: 'focus-change', detail: 'df6'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF7', name: 'focus', checked: focus == 'df7'}),
							listener: listener_change, event: 'focus-change', detail: 'df7'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF8', name: 'focus', checked: focus == 'df8'}),
							listener: listener_change, event: 'focus-change', detail: 'df8'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF9', name: 'focus', checked: focus == 'df9'}),
							listener: listener_change, event: 'focus-change', detail: 'df9'
						}),
						bubble({
							element: create_toggle_radio({text: 'DF10', name: 'focus', checked: focus == 'df10'}),
							listener: listener_change, event: 'focus-change', detail: 'df10'
						}),
					],
					classes: ['flex-start']
				})
			]
		});
	}
}

export default focus;
