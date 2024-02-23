import {
	listener_toggle,
	create_area,
	replace_content,
	create_element,
	create_text,
	create_div,
	create_row,
	create_column,
	create_p,
	create_legend
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

	view({aspect, x, w} = {}) {
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
								children: [create_row({
									sub_row: aspect.length,
									col: 2,
									children: [
										create_legend({
											aspect: aspect,
											style: create_area({x: 1})
										}),
										create_column({
											sub_col: w,
											span: false,
											children: aspect.map((d, i) => create_p({
												text: x[i][0],
												style: {
													...create_area({y: d.id}),
													...(x[i][0] == 0 ? create_area({x: 1, w: w}) : create_area({x: 1, w: x[i][0]})),
													'background-color': x[i][0] == 0 ? 'rgb(0, 0, 0, 0)' : 'lightgray',
													'padding-left': '0.5rem',
													'height': 'min-content'
												}
											})),
											style: {
												width: '40rem',
												...create_area({x: 2})
											}
										}),
										create_div({
											style: {
												width: '40rem',
												'border-right': '1px solid black',
												'border-left': '1px solid black',
												...create_area({x: 2, h: aspect.length})
											}
										})
									],
									style: {
										gap: '0.5rem',
										width: 'fit-content'
									}
								})],
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
