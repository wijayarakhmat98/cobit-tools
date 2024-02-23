import {
	listener_change,
	listener_toggle,
	apply_label,
	replace_content,
	create_div,
	create_label,
	create_details_proxy,
	create_textarea
}
from 'component';

class header extends HTMLElement {
	#state = {};

	constructor({} = {}) {
		super();
	}

	restore({state} = {}) {
		this.#state = state;
	}

	capture({} = {}) {
		return this.#state;
	}

	username({} = {}) {
		return this.#state.username;
	}

	state_view({state_graph, username} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'view' ? _state : {
			mode: 'view',
			state_graph: 'closed',
			username: undefined
		};
		for (const [k, v] of Object.entries({
			state_graph, username
		}))
			if (typeof v !== 'undefined')
				state[k] = v;
		this.#state = state;
	}

	view({view_graph, ...args} = {}) {
		this.state_view({...args});
		const details = create_details_proxy({
			summary: 'Tree',
			surrogate_detail: [view_graph],
			open: this.#state.state_graph == 'open'
		});
		const textarea = create_textarea({
			name: 'username',
			row: 1,
			...(this.#state.username && {value: this.#state.username})
		});
		listener_toggle({
			element: details,
			callback: () => this.#state.state_graph = details.hasAttribute('open') ? 'open' : 'closed'
		});
		listener_change({
			element: textarea,
			callback: () => this.#state.username = textarea.value
		});
		replace_content({
			element: this,
			children: [
				create_div({
					children: [details],
					classes: ['flex-start']
				}),
				create_div({
					children: apply_label({label: create_label({text: 'Username'}), input: textarea}),
					classes: ['flex-end']
				})
			]
		});
	}
}

export default header;
