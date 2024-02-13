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
	static state_view({username, state_graph} = {}) {
		return {
			state_graph: state_graph ?? 'open',
			username: username ?? undefined
		};
	}

	constructor({} = {}) {
		super();
		this.state = undefined;
	}

	restore({state, load = true} = {}) {
		this.state = state;
		if (load)
			this.view();
	}

	view({view_graph, state_graph, username} = {}) {
		if (!this.state)
			this.state = header.state_view();
		if (typeof state_graph !== 'undefined')
			this.state.state_graph = state_graph;
		if (typeof username !== 'undefined')
			this.state.username = username;
		let details = create_details_proxy({
			summary: 'Tree',
			surrogate_detail: [view_graph],
			open: this.state.state_graph == 'open'
		});
		let textarea = create_textarea({
			name: 'username',
			row: 1,
			...(this.state.username && {value: this.state.username})
		});
		listener_toggle({
			element: details,
			callback: () => this.state.state_graph = details.hasAttribute('open') ? 'open' : 'closed'
		});
		listener_change({
			element: textarea,
			callback: () => this.state.username = textarea.value
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
