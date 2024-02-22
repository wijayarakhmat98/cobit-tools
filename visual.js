import {
	listener_toggle,
	create_area,
	replace_content,
	create_element,
	create_text,
	create_div,
	create_p
}
from 'component';

class visual extends HTMLElement {
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

	state_view({open} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'view' ? _state : {
			mode: 'view',
			open: true
		};
		for (const [k, v] of Object.entries({
			open
		}))
			if (typeof v !== 'undefined')
				state[k] = v;
		this.#state = state;
	}

	view({mst_df, x} = {}) {
		this.state_view();
		replace_content({
			element: this,
			children: [
				listener_toggle({
					element: create_element({
						tag: 'details',
						children: [
							create_element({
								tag: 'summary',
								children: [create_text({text: 'Visual'})]
							}),
							create_div({
								children: [
									create_div({
										children: mst_df.map((d, i) => [
											create_p({
												text: d.dimension,
												style: {
													...create_area({x: 1}),
													padding: '0 1rem 0.5rem 0.5rem',
													'border-right': 'solid black 1px',
													'width': 'max-content',
													'max-width': '16rem'
												}
											}),
											create_p({
												text: x[i][0],
												style: {
													...create_area({x: 2, w: x[i][0]}),
													'background-color': 'lightgray',
													'margin-bottom': '0.5rem',
													'padding-left': '0.5rem',
													'height': 'min-content'
												}
											}),
											create_div({
												style: {
													...create_area({x: 7, w: 1}),
													'border-left': 'solid black 1px'
												}
											})
										]).flat(),
										style: {
											display: 'grid',
											'grid-template-columns': 'auto repeat(5, 8rem) auto'
										},
									})
								],
								style: {
									display: 'flex',
									'justify-content': 'center'
								}
							})
						],
						attribute: {
							...(this.#state.open && {open: ''})
						}
					}),
					callback: e => this.#state.open = e.target.hasAttribute('open') ? true : false
				})
			]
		})
	}
}

export default visual;
