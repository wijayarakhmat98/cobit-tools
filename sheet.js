import {
	trs_df1_lo,
	trs_df1_hi
}
from 'master';

import {
	notify,
	listen,
	bubble,
	listener_click,
	listener_change,
	create_range,
	create_grid,
	create_area,
	replace_row,
	create_div,
	create_column,
	create_p,
	create_details,
	create_radio,
	create_textarea,
	create_button
}
from 'component';

class sheet extends HTMLElement {
	#state = {};
	#prop = {};
	#cache = {};

	constructor({} = {}) {
		super();
		listen({
			element: this,
			event: 'sheet-note',
			callback: ({detail} = {}) => {
				this.#state.note[detail.id - 1] = detail.note;
			}
		});
		listen({
			element: this,
			event: 'sheet-select-x',
			callback: ({detail} = {}) => {
				const i = this.#state.selection.findIndex(s => s.id == detail.id);
				if (detail.from == 'new') {
					const j = this.#state.value.findIndex(v => v.id == detail.id);
					let v;
					if (j == -1) {
						v = {id: detail.id};
						this.#state.value.push(v);
					}
					else
						v = this.#state.value[j];
					v.value = detail.value;
				}
				if (detail.from == 'clear')
					for (const r of document.getElementsByName(`${detail.id} value`))
						r.checked = false;
				if ((detail.from == 'parent' || detail.from == 'clear') && i != -1)
					this.#state.selection.splice(i, 1);
				else {
					const s = i != -1 ? this.#state.selection[i] : {id: detail.id};
					s.from = detail.from;
					if (i == -1)
						this.#state.selection.push(s);
				}
				notify({
					element: this,
					event: 'sheet-select',
					detail: {
						id: detail.id,
						value: detail.value
					},
					options: {
						bubbles: true
					}
				});
			}
		});
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

	state_view({} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'view' ? _state : {
			mode: 'view'
		};
		this.#state = state;
	}

	state_modify({selection, value, note} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'modify' ? _state : {
			mode: 'modify',
			selection: [],
			value: [],
			note: []
		};
		for (const [k, v] of Object.entries({
			selection, value, note
		}))
			if (typeof v !== 'undefined')
				state[k] = v;
		this.#state = state;
	}

	prop_view({commit, aspect, baseline} = {}) {
		const _prop = this.#prop;
		const prop = _prop.mode == 'view' ? _prop : {
			mode: 'view'
		};
		if (_prop.mode == 'modify') {
			prop.commit = _prop.parent;
			prop.aspect = _prop.aspect;
			prop.baseline = _prop.baseline;
		}
		for (const [k, v] of Object.entries({
			commit, aspect, baseline
		}))
			prop[k] = v;
		this.#prop = prop;
	}

	prop_modify({parent, alter, merge, aspect, baseline} = {}) {
		const _prop = this.#prop;
		const prop = _prop.mode == 'modify' ? _prop : {
			mode: 'modify'
		};
		if (_prop.mode == 'view') {
			prop.parent = _prop.commit;
			prop.aspect = _prop.aspect;
			prop.baseline = _prop.baseline;
		}
		for (const [k, v] of Object.entries({
			parent, alter, merge, aspect, baseline
		}))
			prop[k] = v;
		this.#prop = prop;
	}

	cache_view({} = {}) {
		const _cache = this.#cache;
		const cache = _cache.mode == 'view' ? _cache : {
			mode: 'view'
		}
		cache.snapshot = Object.fromEntries(
			[this.#prop.commit ?? []]
				.flat().map(c => [
					c.id,
					create_snapshot({
						commit: c,
						aspect: this.#prop.aspect,
						baseline: this.#prop.baseline
					})
				])
		);
		this.#cache = cache;
	}

	cache_modify({} = {}) {
		const _cache = this.#cache;
		const cache = _cache.mode == 'modify' ? _cache : {
			mode: 'modify'
		}
		cache.snapshot = Object.fromEntries(
			[this.#prop.parent ?? [], this.#prop.merge]
				.flat().map(c => [
					c.id,
					create_snapshot({
						commit: c,
						aspect: this.#prop.aspect,
						baseline: this.#prop.baseline
					})
				])
		);
		this.#cache = cache;
	}

	view({...args} = {}) {
		this.state_view();
		this.prop_view({...args});
		this.cache_view();
		replace_row({
			element: this,
			sub_row: 1 + this.#prop.aspect.length,
			children: [
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Enterprise Strategy'}),
						...this.#prop.aspect.map(d => create_details({summary: d.dimension, detail: d.explanation}))
					]
				}),
				...(this.#prop.commit === null ? [] : [create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Viewing commit ${this.#prop.commit.id}`}),
						...create_snapshot({
							commit: this.#prop.commit,
							aspect: this.#prop.aspect,
							baseline: this.#prop.baseline,
						}).map(d => create_trace({
							id: d.id,
							d: d,
							checked: true
						}))
					]
				})]),
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Baseline'}),
						...this.#prop.baseline.map(d => create_p({text: d.value, classes: ['baseline']}))
					]
				}),
			]
		});
	}

	modify({...args} = {}) {
		this.state_modify({...args});
		this.prop_modify({...args});
		this.cache_modify();
		const context = this.context();
		replace_row({
			element: this,
			sub_row: 1 + this.#prop.aspect.length,
			children: [
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Enterprise Strategy'}),
						...this.#prop.aspect.map(d => create_details({summary: d.dimension, detail: d.explanation}))
					]
				}),
				...this.#prop.merge.map(s => create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Merging commit ${s.id}`}),
						...this.#cache.snapshot[s.id].map(d => create_trace({
							from: s.id,
							d: d,
							checked: context[d.id - 1] == s.id
						}))
					]
				})),
				...(!this.#prop.alter ? [] : [create_column({
					sub_col: create_change_sub_col({lo: trs_df1_lo, hi: trs_df1_hi}),
					children: [
						create_p({text: 'Change'}),
						...this.#prop.aspect.map(d => create_change({
							d: d,
							lo: trs_df1_lo,
							hi: trs_df1_hi,
							checked: context[d.id - 1] == 'new' ? this.#state.value[this.#state.value.findIndex(v => v.id == d.id)].value : undefined,
							note_value: this.#state.note[d.id - 1]
						}))
					]
				})]),
				...(this.#prop.parent === null ? [] : [create_column({
					sub_col: create_trace_sub_col(),
					children: [
						create_p({text: `Parent commit ${this.#prop.parent.id}`}),
						...this.#cache.snapshot[this.#prop.parent.id].map(d => create_trace({
							from: 'this.#prop.parent',
							d: d,
							checked: context[d.id - 1] == this.#prop.parent.id
						}))
					]
				})]),
				create_column({
					sub_col: 1,
					children: [
						create_p({text: 'Baseline'}),
						...this.#prop.baseline.map(d => create_p({text: d.value, classes: ['baseline']}))
					]
				}),
				...(this.#prop.parent !== null || !this.#prop.alter && !this.#prop.merge.length ? [] : [create_column({
					sub_col: 1,
					children: [
						create_p({text: ''}),
						...this.#prop.aspect.map(d => bubble({
							element: create_button({
								text: 'Clear',
								style: {
									height: 'min-content',
									padding: '0 0.25rem'
								}
							}),
							listener: listener_click,
							event: 'sheet-select-x',
							detail: {
								value: this.#prop.baseline[d.id - 1].value,
								id: d.id,
								from: 'clear'
							}
						}))
					]
				})])
			]
		});
	}

	context({} = {}) {
		if (this.#state.mode == 'view')
			return this.#prop.aspect.map(d =>
				this.#prop.commit === null ? 'baseline' : this.#prop.commit.id
			);
		if (this.#state.mode == 'modify')
			return this.#prop.aspect.map(d => {
				const i = this.#state.selection.findIndex(s => s.id == d.id);
				if (i != -1) {
					const s = this.#state.selection[i];
					if (this.#prop.alter && s.from == 'new')
						return s.from;
					if (this.#prop.merge.findIndex(m => m.id == s.from) != -1)
						return s.from;
				}
				if (this.#prop.parent !== null)
					return this.#prop.parent.id;
				return 'baseline';
			});
	}

	x({} = {}) {
		const context = this.context();
		return this.#prop.aspect.map(d => {
			if (context[d.id - 1] == 'new')
				return [this.#state.value[this.#state.value.findIndex(v => v.id == d.id)].value];
			if (context[d.id - 1] == 'baseline')
				return [this.#prop.baseline[d.id - 1].value];
			if (this.#cache.snapshot[context[d.id - 1]][d.id - 1].commit == 'baseline')
				return [this.#prop.baseline[d.id - 1].value];
			return [this.#cache.snapshot[context[d.id - 1]][d.id - 1].value];
		});
	}

	note({} = {}) {
		return this.#state.note;
	}
}

function create_snapshot({commit, aspect, baseline} = {}) {
	return aspect.map(d => {
		let p, c;
		for (p = commit; p !== null;)
			if (c = p.change.find(e => e.id == d.id))
				if (c.inherit)
					p = c.from;
				else
					break;
			else
				p = p.parent;
		if (p === null)
			return {
				id: d.id,
				commit: 'baseline'
			};
		else
			return {
				id: d.id,
				value: c ? c.value : baseline.find(e => e.id == d.id).value,
				note: c ? c.note : 'Baseline',
				author: p.author,
				commit: p.id,
				description: p.description
			};
	});
}

function create_change_sub_col({lo, hi} = {}) {
	return hi - lo + 2;
}

function create_change({d, lo, hi, checked, note_value, style = {}, ...args} = {}) {
	const note = create_textarea({row: 1, value: note_value});
	listener_change({
		element: note,
		callback: () => {
			notify({
				element: note,
				event: 'sheet-note',
				detail: {
					id: d.id,
					note: note.value
				},
				options: {
					bubbles: true
				}
			});
		}
	});
	return create_div({
		children: [
			...create_range({start: lo, stop: hi}).map(
				i => bubble({
					element: create_radio({
						text: i,
						checked: i == checked,
						name: `${d.id} value`,
					}),
					listener: listener_change,
					event: 'sheet-select-x',
					detail: {
						from: 'new',
						id: d.id,
						value: i
					}
				})
			),
			note
		],
		style: {
			...create_grid({col: 'subgrid'}),
			...style
		},
		...args
	});
}

function create_trace_sub_col({} = {}) {
	return 6;
}

function create_trace({from, d, checked, style = {}, ...args} = {}) {
	return create_div({
		children: d.commit == 'baseline' ? [] : [
			bubble({
				element: create_radio({
					text: d.value,
					checked: checked,
					name: `${d.id} value`,
					style: create_area({h: 2})
				}),
				listener: listener_change,
				event: 'sheet-select-x',
				detail: {
					from: from,
					id: d.id,
					value: d.value
				}
			}),
			create_p({text: d.note, classes: ['expand']}),
			create_p({text: 'by'}),
			create_p({text: d.author, classes: ['expand']}),
			create_p({text: 'from'}),
			create_p({text: d.commit, classes: ['expand']}),
			create_p({text: d.description, classes: ['expand', 'description'], style: create_area({w: 5})})
		],
		style: {
			...create_grid({row: 2, col: 'subgrid'}),
			...style
		},
		...args
	});
}

export default sheet;
