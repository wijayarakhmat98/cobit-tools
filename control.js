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

	mode({} = {}) {
		return this.#state.mode;
	}

	description({} = {}) {
		return this.#state.description;
	}

	state_view({} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'view' ? _state : {
			mode: 'view'
		};
		this.#state = state;
	}

	state_modify({description} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'modify' ? _state : {
			mode: 'modify',
			description: undefined
		}
		for (const [k, v] of Object.entries({
			description
		}))
			if (typeof v !== 'undefined')
				state[k] = v;
		this.#state = state;
	}

	view({} = {}) {
		this.state_view();
		replace_content({
			element: this,
			children: [
				create_div({
					children: [
						bubble({element: create_button({text: 'Modify'}), listener: listener_click, event: 'control-modify'})
					],
					classes: ['flex-start']
				})
			]
		});
	}

	modify({parent, alter, merge, context, ...args} = {}) {
		this.state_modify({...args});
		const description = create_textarea({name: 'description', row: 1, value: this.#state.description});
		listener_change({
			element: description,
			callback: () => {
				this.#state.description = description.value;
			}
		});
		replace_content({
			element: this,
			children: [
				create_div({
					children: [
						bubble({element: create_toggle_radio({text: 'Parent', name: 'context', checked: context == 'parent'}), listener: listener_change, event: 'control-parent'}),
						create_p({text: parent === null ? 'None' : parent.id}),
						bubble({element: create_toggle_radio({text: 'Merge', name: 'context', checked: context == 'merge'}), listener: listener_change, event: 'control-merge'}),
						create_p({text: '[' + merge.map(m => m.id).join(', ') + ']'}),
						bubble({element: create_toggle_checkbox({text: 'New', checked: alter}), listener: listener_click, event: 'control-alter'})
					],
					classes: ['flex-start']
				}),
				create_div({
					children: [
						...apply_label({
							label: create_label({text: 'Description'}),
							input: description,
							order: 'label'
						}),
						bubble({element: create_button({text: 'Commit'}), listener: listener_click, event: 'control-save'}),
						bubble({element: create_button({text: 'Discard'}), listener: listener_click, event: 'control-discard'})
					],
					classes: ['flex-end']
				})
			]
		});
	}
}

export default control;
