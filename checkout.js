import {
	facet
}
from 'master';

import {
	create_aspect,
	create_map,
	create_baseline,
	gmo_calculate
}
from 'cobit';

import {
	listen
}
from 'component';

const mst_focus = facet
	.filter(f => [2, 3, 5, 6, 7, 8, 9, 10, 11, 12].includes(f.id))
	.map(f => ({text: f.code, value: f.id}))
;

class checkout {
	#state = {};

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
			callback: ({detail: focus} = {}) => {
				this.#state.focus = focus;
				this.restore({state: this.#state});
				if (this.#state.mode == 'view')
					this.view();
				if (this.#state.mode == 'modify')
					this.modify();
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
			focus: 2
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

	state_modify({parent, alter, merge, context, focus} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'modify' ? _state : {
			mode: 'modify',
			parent: null,
			alter: true,
			merge: [],
			context: 'parent',
			focus: 2
		};
		if (_state.mode == 'view') {
			state.parent = _state.commit,
			state.focus = _state.focus
		}
		for (const [k, v] of Object.entries({
			parent, alter, merge, context, focus
		}))
			if (typeof v !== 'undefined')
				state[k] = v;
		this.#state = state;
	}

	view({...args} = {}) {
		this.state_view({...args});
		this.header.view({view_graph: this.graph});
		this.graph.view({graph: this.history});
		this.control.view();
		this.focus.view({list: mst_focus, focus: this.#state.focus});
		this.sheet.view({
			facet: facet.find(f => f.id == this.#state.focus).name,
			commit: this.#state.commit,
			aspect: create_aspect({facet: this.#state.focus}),
			baseline: create_baseline({facet: this.#state.focus})
		});
		this.gmo_view();
	}

	modify({...args} = {}) {
		this.state_modify({...args});
		this.header.view({view_graph: this.graph});
		this.graph.view({graph: this.history});
		this.control.modify({parent: this.#state.parent, alter: this.#state.alter, merge: this.#state.merge, context: this.#state.context});
		this.focus.view({list: mst_focus, focus: this.#state.focus});
		this.sheet.modify({
			facet: facet.find(f => f.id == this.#state.focus).name,
			parent: this.#state.parent,
			alter: this.#state.alter,
			merge: this.#state.merge,
			aspect: create_aspect({facet: this.#state.focus}),
			baseline: create_baseline({facet: this.#state.focus})
		});
		this.gmo_view();
	}

	gmo_view({} = {}) {
		const x = this.sheet.x();
		const x_base = create_baseline({facet: this.#state.focus}).map(d => [d.value]);
		const M = create_map({facet: this.#state.focus});
		const r_hat = gmo_calculate({x: x, x_base: x_base, M: M});
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
