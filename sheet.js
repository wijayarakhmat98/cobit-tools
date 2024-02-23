import {
	listen,
	notify,
	listener_change,
	create_area,
	replace_column,
	create_row,
	create_column,
	create_p,
	create_toggle_radio_clear,
	create_textarea,
	create_legend,
	create_scale,
	create_percentage,
	create_trace
}
from 'component';

class sheet extends HTMLElement {
	#state = {};
	#prop = {};
	#cache = {};

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

	context({} = {}) {
		if (this.#state.mode == 'view')
			return this.#prop.input.map(_ => this.#prop.aspect.map(_ => {
				if (this.#prop.commit === null)
					return 'baseline';
				return this.#prop.commit.id;
			}));
		if (this.#state.mode == 'modify')
			return this.#prop.input.map(i => this.#prop.aspect.map(r => {
				const s = (this.#state.selection[i.id - 1] ?? [])[r.id - 1];
				if (this.#prop.alter && s == 'alter')
					return s;
				if (this.#prop.merge.find(m => m.id == s))
					return s;
				if (this.#prop.parent === null)
					return 'baseline';
				return this.#prop.parent.id;
			}));
	}

	x({} = {}) {
		const context = this.context();
		return this.#prop.input.map(i => this.#prop.aspect.map(r => {
			const c = context[i.id - 1][r.id - 1];
			if (c == 'alter') {
				if (typeof this.#state.value[i.id - 1] === 'undefined')
					return this.#prop.baseline[i.id - 1][r.id - 1];
				else
					return this.#state.value[i.id - 1][r.id - 1];
			}
			if (c == 'baseline')
				return this.#prop.baseline[i.id - 1][r.id - 1];
			const s = this.#cache.snapshot[c][i.id - 1][r.id - 1];
			if (s.commit == 'baseline')
				return this.#prop.baseline[i.id - 1][r.id - 1];
			return s.value;
		}));
	}

	note({} = {}) {
		return this.#state.note;
	}

	#prop_common({prop} = {}) {
		const _prop = this.#prop;
		prop.facet = _prop.facet;
		prop.aspect = _prop.aspect;
		prop.input = _prop.input;
		prop.baseline = _prop.baseline;
	}

	#prop_view({facet, aspect, input, baseline, commit} = {}) {
		const _prop = this.#prop;
		const prop = _prop.mode == 'view' ? _prop : {
			mode: 'view'
		};
		this.#prop_common({prop: prop});
		if (_prop.mode == 'modify')
			prop.commit = _prop.parent;
		for (const [k, v] of Object.entries({
			facet, aspect, input, baseline, commit
		}))
			prop[k] = v;
		this.#prop = prop;
	}

	#prop_modify({facet, aspect, input, baseline, parent, alter, merge} = {}) {
		const _prop = this.#prop;
		const prop = _prop.mode == 'modify' ? _prop : {
			mode: 'modify'
		};
		this.#prop_common({prop: prop});
		if (_prop.mode == 'view')
			prop.parent = _prop.commit;
		for (const [k, v] of Object.entries({
			facet, aspect, input, baseline, parent, alter, merge
		}))
			prop[k] = v;
		this.#prop = prop;
	}

	state_view({} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'view' ? _state : {
			mode: 'view'
		};
		this.#state = state;
	}

	state_modify({value, note, selection} = {}) {
		const _state = this.#state;
		const state = _state.mode == 'modify' ? _state : {
			mode: 'modify',
			value: [],
			note: [],
			selection: []
		};
		for (const [k, v] of Object.entries({
			value, note, selection
		}))
			if (typeof v !== 'undefined')
				state[k] = v;
		this.#state = state;
	}

	#cache_view({} = {}) {
		const _cache = this.#cache;
		const cache = _cache.mode == 'view' ? _cache : {
			mode: 'view'
		}
		cache.snapshot = Object.fromEntries(
			[this.#prop.commit ?? []]
				.flat().map(c => [c.id, this.create_snapshot({commit: c})])
		);
		this.#cache = cache;
	}

	#cache_modify({} = {}) {
		const _cache = this.#cache;
		const cache = _cache.mode == 'modify' ? _cache : {
			mode: 'modify'
		}
		cache.snapshot = Object.fromEntries(
			[this.#prop.parent ?? [], this.#prop.merge]
				.flat().map(c => [c.id, this.create_snapshot({commit: c})])
		);
		this.#cache = cache;
	}

	view({...args} = {}) {
		this.#prop_view({...args});
		this.state_view();
		this.#cache_view();
		const context = this.context();
		replace_column({
			element: this,
			sub_col:
				1 +
				(this.#prop.commit === null ? 0 : 1) +
				1
			,
			children: [
				create_row({
					children: [
						create_p({text: this.#prop.facet.name}),
						this.#prop.commit === null ? [] : create_p({text: `Viewing commit ${this.#prop.commit.id}`}),
						create_p({text: 'Baseline'})
					].flat()
				}),
				create_row({
					sub_row: this.#prop.aspect.length,
					children: [
						create_legend({aspect: this.#prop.aspect}),
						this.create_trace({commit: this.#prop.commit, context: context}),
						this.create_baseline()
					].flat()
				})
			]
		});
	}

	modify({...args} = {}) {
		this.#prop_modify({...args});
		this.state_modify({...args});
		this.#cache_modify();
		const context = this.context();
		replace_column({
			element: this,
			sub_col:
				1 +
				1 +
				this.#prop.merge.length +
				(this.#prop.alter ? 2 : 0) +
				(this.#prop.parent === null ? 0 : 1) +
				1 +
				(this.#prop.parent === null || this.#cache.snapshot[this.#prop.parent.id].flat().find(s => s.commit == 'baseline') ? 1 : 0)
			,
			row: 2,
			children: [
				create_row({
					children: [
						create_p({text: this.#prop.facet.name, style: create_area({w: 2})}),
						this.#prop.merge.map(s => create_p({text: `Merging commit ${s.id}`})),
						this.#prop.alter ? [create_p({text: 'Change'}), create_p({text: 'Note'})] : [],
						this.#prop.parent === null ? [] : create_p({text: `Parent commit ${this.#prop.parent.id}`}),
						create_p({text: 'Baseline'})
					].flat()
				}),
				create_row({
					sub_row: this.#prop.aspect.length * this.#prop.input.length,
					children: [
						create_legend({aspect: this.#prop.aspect, h: this.#prop.input.length}),
						this.create_input(),
						this.#prop.merge.map(m => this.create_trace({commit: m, context: context})),
						this.create_alter({context: context}),
						this.create_note(),
						this.create_trace({commit: this.#prop.parent, context: context}),
						this.create_baseline(),
						this.create_clear()
					].flat()
				})
			]
		});
	}

	create_input({} = {}) {
		return create_column({
			children: this.#prop.aspect.map(_ => this.#prop.input.map(i => i.name)).flat()
				.map(n => create_p({text: n}))
		});
	}

	create_alter({context} = {}) {
		if (!this.#prop.alter)
			return [];
		return create_column({
			sub_col: Math.max.apply(Math, this.#prop.input.map(i => {
				if (i.type == 'scale')
					return i.hi - i.lo + 1;
				if (i.type == 'percentage')
					return 2;
			})),
			children: this.#prop.aspect.map(r => this.#prop.input.map(i => {
				let input;
				if (i.type == 'scale')
					input = create_scale({lo: i.lo, hi: i.hi, step: i.step, name: `facet ${this.#prop.facet.id} aspect ${r.id} input ${i.id} value`});
				if (i.type == 'percentage')
					input = create_percentage({lo: i.lo, hi: i.hi, step: i.step, name: `facet ${this.#prop.facet.id} aspect ${r.id} input ${i.id} value`});
				listen({
					element: input,
					event: 'x-change',
					callback: ({detail}) => this.change_value({i: i, r: r, v: Number(detail)})
				});
				listener_change({
					element: input,
					callback: () => this.change_selection({i: i, r: r, v: 'alter'})
				});
				return input;
			})).flat()
		});
	}

	create_note() {
		if (!this.#prop.alter)
			return [];
		return create_column({
			children: this.#prop.aspect.map(r => this.#prop.input.map(i => {
				const note = create_textarea({row: 1});
				return listener_change({
					element: note,
					callback: () => this.change_note({i: i, r: r, v: note.value})
				})
			})).flat()
		});
	}

	create_trace({commit, context} = {}) {
		if (commit === null)
			return [];
		return create_column({
			sub_col: 6,
			children: this.#prop.aspect.map(r => this.#prop.input.map(i => {
				const c = this.#cache.snapshot[commit.id][i.id - 1][r.id - 1];
				if (c.commit == 'baseline')
					return [];
				return listen({
					element: create_trace({
						r: c,
						name: `facet ${this.#prop.facet.id} aspect ${r.id} input ${i.id} value`,
						style: create_area({y: (r.id - 1) * this.#prop.input.length + i.id})
					}),
					event: 'x-change',
					callback: () => this.change_selection({i: i, r: r, v: commit.id})
				})
			})).flat(2)
		});
	}

	create_baseline({} = {}) {
		return create_column({
			children: this.#prop.aspect.map(r => this.#prop.baseline.map(b => b[r.id - 1])).flat()
				.map(b => create_p({text: b, classes: ['baseline']}))
		});
	}

	create_clear({} = {}) {
		return create_column({
			children: this.#prop.aspect.map(r => this.#prop.input.map(i => {
				if (this.#prop.parent !== null && this.#cache.snapshot[this.#prop.parent.id][i.id - 1][r.id - 1].commit !== 'baseline')
					return [];
				return listener_change({
					element: create_toggle_radio_clear({
						text: 'Clear',
						name: `facet ${this.#prop.facet.id} aspect ${r.id} input ${i.id} value`,
						style: create_area({y: (r.id - 1) * this.#prop.input.length + i.id})
					}),
					callback: () => this.change_selection({i: i, r: r, v: undefined})
				});
			})).flat(2)
		});
	}

	create_snapshot({commit} = {}) {
		return this.#prop.input.map(i => this.#prop.aspect.map(r => {
			let p, c;
			for (p = commit; p !== null;)
				if (c = p.change.find(s =>
					s.fct_id == this.#prop.facet.id
					&& s.inp_id == i.id
					&& s.asp_id == r.id
				))
					if (c.inherit)
						p = c.from;
					else
						break;
				else
					p = p.parent;
			return (p === null)
				? {
					id: r.id,
					commit: 'baseline'
				}
				: {
					id: r.id,
					value: c.value,
					note: c.note,
					author: p.author,
					commit: p.id,
					description: p.description
				};
		}));
	}

	change_value({i, r, v} = {}) {
		if (typeof this.#state.value[i.id - 1] === 'undefined')
			this.#state.value[i.id - 1] = [];
		this.#state.value[i.id - 1][r.id - 1] = v;
	}

	change_note({i, r, v} = {}) {
		if (typeof this.#state.note[i.id - 1] === 'undefined')
			this.#state.note[i.id - 1] = [];
		this.#state.note[i.id - 1][r.id - 1] = v;
	}

	change_selection({i, r, v} = {}) {
		if (typeof this.#state.selection[i.id - 1] === 'undefined')
			this.#state.selection[i.id - 1] = [];
		if (this.#prop.parent !== null && v == this.#prop.parent.id)
			this.#state.selection[i.id - 1][r.id - 1] = undefined;
		else
			this.#state.selection[i.id - 1][r.id - 1] = v;
		notify({
			element: this,
			event: 'sheet-update',
			options: {
				bubbles: true
			}
		});
	}
}

export default sheet;
