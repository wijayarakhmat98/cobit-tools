import {
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
			return this.#prop.aspect.map(_ =>
				this.#prop.commit === null ? 'baseline' : this.#prop.commit.id
			);
		if (this.#state.mode == 'modify')
			return this.#prop.aspect.map(d => {
				const s = this.#state.selection[d.id - 1];
				if (this.#prop.alter && s == 'alter')
					return s;
				if (this.#prop.merge.find(m => m.id == s))
					return s;
				return this.#prop.parent === null ? 'baseline' : this.#prop.parent.id;
			});
	}

	x({} = {}) {
		return this.#prop.baseline;
		const context = this.context();
		return this.#prop.aspect.map(d => {
			const c = context[d.id - 1];
			if (c == 'alter')
				return this.#state.value[d.id - 1];
			if (c == 'baseline')
				return this.#prop.baseline[d.id - 1].value;
			const s = this.#cache.snapshot[c][d.id - 1];
			if (s.commit == 'baseline')
				return this.#prop.baseline[d.id - 1].value;
			return s.value;
		}).map(v => [v]);
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
						this.create_commit(),
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
						this.create_merge({context: context}),
						this.create_alter({context: context}),
						this.create_note(),
						this.create_parent({context: context}),
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

	create_commit({} = {}) {
		if (this.#prop.commit === null)
			return [];
		return create_column({
			sub_col: 6,
			children: this.#prop.aspect.map(r => this.#prop.input.map(i => {
				const c = this.#cache.snapshot[this.#prop.commit.id][i.id - 1][r.id - 1];
				if (c.commit == 'baseline')
					return [];
				return create_trace({
					r: c,
					style: create_area({y: (r.id - 1) * this.#prop.input.length + i.id})
				});
			})).flat(2)
		});
	}

	create_merge({context} = {}) {
		return this.#prop.merge.map(m => create_column({
			sub_col: 6,
			children: this.#prop.aspect.map(r => this.#prop.input.map(i => {
				const c = this.#cache.snapshot[m.id][i.id - 1][r.id - 1];
				console.log(c);
				if (c.commit == 'baseline')
					return [];
				return create_trace({
					r: c,
					name: `facet ${this.#prop.facet.id} aspect ${r.id} input ${i.id} value`,
					style: create_area({y: (r.id - 1) * this.#prop.input.length + i.id})
				});
			})).flat(2)
		}));
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
				if (i.type == 'scale')
					return create_scale({lo: i.lo, hi: i.hi, step: i.step, name: `facet ${this.#prop.facet.id} aspect ${r.id} input ${i.id} value`});
				if (i.type == 'percentage')
					return create_percentage({lo: i.lo, hi: i.hi, step: i.step, name: `facet ${this.#prop.facet.id} aspect ${r.id} input ${i.id} value`});
			})).flat()
		});
	}

	create_note() {
		if (!this.#prop.alter)
			return [];
		return create_column({
			children: this.#prop.aspect.map(r => this.#prop.input.map(i =>
				create_textarea({row: 1})
			)).flat()
		});
	}

	create_parent({context} = {}) {
		if (this.#prop.parent === null)
			return [];
		return create_column({
			sub_col: 6,
			children: this.#prop.aspect.map(r => this.#prop.input.map(i => {
				const c = this.#cache.snapshot[this.#prop.parent.id][i.id - 1][r.id - 1];
				if (c.commit == 'baseline')
					return [];
				return create_trace({
					r: c,
					name: `facet ${this.#prop.facet.id} aspect ${r.id} input ${i.id} value`,
					style: create_area({y: (r.id - 1) * this.#prop.input.length + i.id})
				});
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
				return create_toggle_radio_clear({
					text: 'Clear',
					name: `facet ${this.#prop.facet.id} aspect ${r.id} input ${i.id} value`,
					style: create_area({y: (r.id - 1) * this.#prop.input.length + i.id})
				})
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
}

export default sheet;
