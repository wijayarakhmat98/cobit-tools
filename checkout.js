import {
	create_facet,
	create_aspect,
	create_map,
	create_baseline,
	create_input,
	create_collapse,
	map_calculate,
	collapse_calculate
}
from 'cobit';

import {
	listen
}
from 'component';

const mst_focus = ['DF1', 'DF2', 'DF3', 'DF4', 'DF5', 'DF6', 'DF7', 'DF8', 'DF9', 'DF10']
	.map(code => create_facet({code: code}));

class checkout {
	#state = {};
	#cache = {};

	constructor({
		history, header, graph, control, focus, visual, sheet, gmo
	} = {}) {
		for (const [k, v] of Object.entries({
			history, header, graph, control, focus, visual, sheet, gmo
		}))
			this[k] = v;
		listen({element: this.graph, event: 'graph-select', callback: ({detail: commit} = {}) => {
			if (this.#state.mode == 'view') {
				if (this.#state.commit == commit)
					this.view({commit: null});
				else
					this.view({commit: commit});
			}
			if (this.#state.mode == 'modify') {
				if (this.#state.context == 'parent')
					if (this.#state.parent == commit)
						this.modify({parent: null});
					else {
						if (!this.#state.merge.includes(commit))
							this.modify({parent: commit});
					}
				if (this.#state.context == 'merge') {
					const merge = this.#state.merge;
					const i = merge.indexOf(commit);
					if (i == -1) {
						if (this.#state.parent != commit)
							merge.push(commit)
					} else
						merge.splice(i, 1);
					this.modify({merge: merge});
				}
			}
		}});
		listen({element: this.control})
			({event: 'control-modify', callback: () => this.modify()})
			({event: 'control-parent', callback: () => this.#state.context = 'parent'})
			({event: 'control-alter', callback: () => this.modify({'alter': !this.#state.alter})})
			({event: 'control-merge', callback: () => this.#state.context = 'merge'})
			({event: 'control-save', callback: () => this.save()})
			({event: 'control-discard', callback: () => this.view()});
		listen({
			element: this.focus,
			event: 'focus-change',
			callback: ({detail} = {}) => {
				if (this.#state.mode == 'view')
					this.view({focus: detail});
				if (this.#state.mode == 'modify')
					this.modify({focus: detail});
			}
		});
		listen({
			element: this.sheet,
			event: 'sheet-update',
			callback: () => this.gmo_view()
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

	state_view({commit, focus} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'view' ? _state : {
			mode: 'view',
			commit: null,
			focus: create_facet({code: 'DF1'})
		};
		if (_state.mode == 'modify') {
			state.commit = _state.parent,
			state.focus = _state.focus
		}
		for (const [k, v] of Object.entries({
			commit, focus
		}))
			if (typeof v !== 'undefined')
				state[k] = v;
		this.#state = state;
	}

	state_modify({parent, alter, merge, context, focus, sheet} = {}) {
		const _state = this.#state;
		if (_state.mode == 'modify')
			_state.sheet[_state.focus.code] = this.sheet.capture();
		const state = _state.mode == 'modify' ? _state : {
			mode: 'modify',
			parent: null,
			alter: true,
			merge: [],
			context: 'parent',
			focus: create_facet({code: 'DF1'}),
			sheet: {}
		};
		if (_state.mode == 'view') {
			state.parent = _state.commit,
			state.focus = _state.focus
		}
		for (const [k, v] of Object.entries({
			parent, alter, merge, context, focus, sheet
		}))
			if (typeof v !== 'undefined')
				state[k] = v;
		this.#state = state;
	}

	#cache_common({cache} = {}) {
		cache.aspect = create_aspect({facet: this.#state.focus});
		cache.map = create_map({facet: this.#state.focus});
		cache.input = create_input({facet: this.#state.focus});
		cache.baseline = create_baseline({facet: this.#state.focus});
		cache.collapse = create_collapse({facet: this.#state.focus});
	}

	#cache_view({} = {}) {
		const _cache = this.#cache;
		const cache = _cache.mode == 'view' ? _cache : {
			mode: 'view'
		};
		this.#cache_common({cache: cache});
		this.#cache = cache;
	}

	#cache_modify({} = {}) {
		const _cache = this.#cache;
		const cache = _cache.mode == 'modify' ? _cache : {
			mode: 'modify'
		};
		this.#cache_common({cache: cache});
		this.#cache = cache;
	}

	view({...args} = {}) {
		this.state_view({...args});
		this.#cache_view();
		this.header.view({view_graph: this.graph});
		this.graph.view({graph: this.history});
		this.control.view();
		this.focus.view({list: mst_focus, focus: this.#state.focus});
		this.sheet.view({
			facet: this.#state.focus,
			aspect: this.#cache.aspect,
			input: this.#cache.input,
			baseline: this.#cache.baseline,
			commit: this.#state.commit
		});
		this.gmo_view();
	}

	modify({...args} = {}) {
		this.state_modify({...args});
		console.log(this.#state.sheet);
		this.#cache_modify();
		this.header.view({view_graph: this.graph});
		this.graph.view({graph: this.history});
		this.control.modify({parent: this.#state.parent, alter: this.#state.alter, merge: this.#state.merge, context: this.#state.context});
		this.focus.view({list: mst_focus, focus: this.#state.focus});
		this.sheet.restore({
			state: this.#state.sheet[this.#state.focus.code]
		});
		this.sheet.modify({
			facet: this.#state.focus,
			aspect: this.#cache.aspect,
			input: this.#cache.input,
			baseline: this.#cache.baseline,
			parent: this.#state.parent,
			alter: this.#state.alter,
			merge: this.#state.merge
		});
		this.gmo_view();
	}

	gmo_view({} = {}) {
		const x = collapse_calculate({xs: this.sheet.x(), collapse: this.#cache.collapse});
		const x_base = collapse_calculate({xs: this.#cache.baseline, collapse: this.#cache.collapse});
		const M = this.#cache.map;
		const r_hat = map_calculate({x: x, x_base: x_base, M: M});
		this.visual.view({aspect: create_aspect({facet: this.#state.focus}), x: x});
		this.gmo.view({r_hat: r_hat});
	}

	save({} = {}) {
		const x = this.sheet.x();
		const note = this.sheet.note();
		const new_commit = {
			id: this.history.length,
			parent: this.#state.parent,
			merge: this.#state.merge,
			change: create_aspect({facet: this.#state.focus}).reduce((c, d) => {
				const v = x[d.id - 1][0];
				// if (v.from !== null)
				// 	return c;
				c.push({
					id: d.id,
					inherit: false,
					value: v,
					note: note[d.id - 1]
				});
				return c;
			}, []),
			author: this.header.username(),
			description: this.control.description(),
			timestamp: Date.now()
		};
		this.history.push(new_commit);
		this.view({commit: new_commit})
	}
}

export default checkout;
