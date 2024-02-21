import {
	facet,
	aspect,
	map,
	baseline
}
from 'master';

import {
	matrix_create,
	matrix_sum_element,
	matrix_reciprocal,
	matrix_scalar_multiply,
	matrix_multiply,
	matrix_element_multiply,
	matrix_element_map
}
from 'matrix';

import {
	listen
}
from 'component';

class checkout {
	static state_view({commit, focus} = {}) {
		return {
			mode: 'view',
			commit: commit ?? null,
			focus: focus ?? 2
		};
	}

	static state_modify({parent, merge, alter, context, focus} = {}) {
		return {
			mode: 'modify',
			parent: parent ?? null,
			alter: alter ?? true,
			merge: merge ?? [],
			context: context ?? 'parent',
			focus: focus ?? 2
		};
	}

	constructor({
		history, header, graph, control, focus, visual, sheet, gmo
	} = {}) {
		this.history = history;
		this.header = header;
		this.graph = graph;
		this.control = control;
		this.focus = focus;
		this.visual = visual;
		this.sheet = sheet;
		this.gmo = gmo;
		listen({element: this.graph, event: 'graph-select', callback: ({detail: commit} = {}) => {
			if (this.state.mode == 'view') {
				if (this.state.commit === commit)
					this.view({commit: null});
				else
					this.view({commit: commit});
			}
			if (this.state.mode == 'modify') {
				if (this.state.context == 'parent')
					if (this.state.parent == commit)
						this.modify({parent: null});
					else {
						if (!this.state.merge.includes(commit))
							this.modify({parent: commit});
					}
				if (this.state.context == 'merge') {
					let merge = this.state.merge;
					const i = merge.indexOf(commit);
					if (i == -1) {
						if (this.state.parent != commit)
							merge.push(commit)
					} else
						merge.splice(i, 1);
					this.modify({merge: merge});
				}
			}
		}});
		listen({element: this.control})
			({event: 'control-modify', callback: () => this.modify()})
			({event: 'control-parent', callback: () => this.state.context = 'parent'})
			({event: 'control-alter', callback: () => this.modify({'alter': !this.state.alter})})
			({event: 'control-merge', callback: () => this.state.context = 'merge'})
			({event: 'control-save', callback: () => this.save()})
			({event: 'control-discard', callback: () => this.view()});
		listen({
			element: this.focus,
			event: 'focus-change',
			callback: ({detail: focus} = {}) => {
				this.state.focus = focus;
				this.restore({state: this.state});
				this.modify();
			}
		});
		listen({
			element: this.sheet,
			event: 'sheet-select',
			callback: () => this.gmo_view()
		});
	}

	restore({state} = {}) {
		this.state = state;
	}

	capture({} = {}) {
		return this.state;
	}

	mode({} = {}) {
		return this.state.mode;
	}

	state_view({commit, focus} = {}) {
		if (!this.state)
			this.state = checkout.state_view();
		if (this.state.mode == 'modify')
			this.state = checkout.state_view({
				commit: this.state.parent,
				focus: this.state.focus
			});
		if (typeof commit !== 'undefined') this.state.commit = commit;
		if (typeof focus !== 'undefined') this.state.focus = focus;
	}

	state_modify({parent, alter, merge, context, focus} = {}) {
		if (!this.state)
			this.state = checkout.state_modify();
		if (this.state.mode == 'view')
			this.state = checkout.state_modify({
				parent: this.state.commit,
				focus: this.state.focus
			});
		if (typeof parent !== 'undefined') this.state.parent = parent;
		if (typeof alter !== 'undefined') this.state.alter = alter;
		if (typeof merge !== 'undefined') this.state.merge = merge;
		if (typeof context !== 'undefined') this.state.context = context;
		if (typeof focus !== 'undefined') this.state.focus = focus;
	}

	view({...args} = {}) {
		this.state_view({...args});
		this.header.view({view_graph: this.graph});
		this.graph.view({graph: this.history});
		this.control.view();
		this.build_focus();
		this.sheet.view({commit: this.state.commit, aspect: this.mst_df(), baseline: this.trs_df_baseline()});
		this.gmo_view();
	}

	modify({...args} = {}) {
		this.state_modify({...args});
		this.header.view({view_graph: this.graph});
		this.graph.view({graph: this.history});
		this.control.modify({parent: this.state.parent, alter: this.state.alter, merge: this.state.merge, context: this.state.context});
		this.build_focus();
		this.sheet.modify({
			parent: this.state.parent,
			alter: this.state.alter,
			merge: this.state.merge,
			aspect: this.mst_df(),
			baseline: this.trs_df_baseline()
		});
		this.gmo_view();
	}

	build_focus({} = {}) {
		const id = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12];
		const list = facet
			.filter(f => id.includes(f.id))
			.map(f => ({
				text: f.code,
				value: f.id
			}))
		;
		this.focus.view({list: list, focus: this.state.focus});
	}

	mst_df({} = {}) {
		const mst_df = aspect.reduce((a, r) => {
			if (r.fct_id == this.state.focus)
				a.push({
					id: r.id,
					dimension: r.name,
					explanation: 'place holder'
				})
			return a;
		}, []);
		return mst_df;
	}

	trs_df_baseline({} = {}) {
		const trs_df_baseline = baseline.reduce((a, r) => {
			if (r.fct_id == this.state.focus && r.inp_id == 1)
				a.push({
					id: r.asp_id,
					value: r.baseline
				})
			return a;
		}, []);
		return trs_df_baseline;
	}

	trs_df_map_matrix({} = {}) {
		let ms = [];
		let focus = this.state.focus;
		for (;;) {
			let m = map.filter(r => r.src_fct_id == focus);
			if (m.length == 0)
				break;
			focus = m[0].dst_fct_id;
			ms.push(m);
		}
		ms = ms.map(m => {
			const row = Math.max.apply(Math, m.map(r => r.dst_asp_id));
			const col = Math.max.apply(Math, m.map(r => r.src_asp_id));
			let A = matrix_create({row: row, col: col});
			for (const r of m)
				A[r.dst_asp_id - 1][r.src_asp_id - 1] = r.relevance;
			return A;
		});
		const M = ms.reverse().reduce((M, m) => matrix_multiply({A: M, B: m}));
		return M;
	}

	gmo_view({} = {}) {
		const x = this.sheet.x;
		const x_base = this.trs_df_baseline().map(d => [d.value]);
		const r_hat = this.gmo_calculate({x: x, x_base: x_base});
		// this.visual.view({mst_df: this.mst_df(), x: x});
		this.gmo.view({r_hat: r_hat});
	}

	gmo_calculate({x, x_base} = {}) {
		const M = this.trs_df_map_matrix();
		const c = matrix_sum_element({A: x_base}) / matrix_sum_element({A: x});
		const y = matrix_multiply({A: M, B: x});
		const y_base = matrix_multiply({A: M, B: x_base});
		const r = matrix_scalar_multiply({c: c, A: matrix_element_multiply({A: y, B: matrix_reciprocal({A: y_base})})});
		const r_hat = matrix_element_map({A: r, callback: e => Math.round(20 * e) * 5 - 100});
		return r_hat;
	}

	save({} = {}) {
		const new_commit = {
			id: this.history.length,
			parent: this.state.parent,
			merge: this.state.merge,
			change: this.mst_df().reduce((c, d) => {
				const v = this.sheet.x[d.id - 1][0];
				// if (v.from !== null)
				// 	return c;
				c.push({
					id: d.id,
					inherit: false,
					value: v,
					note: this.sheet.state.note[d.id - 1] ?? ''
				});
				return c;
			}, []),
			author: this.header.state.username ?? '',
			description: this.control.state.description ?? '',
			timestamp: Date.now()
		};
		this.history.push(new_commit);
		this.view({commit: new_commit})
	}
}

export default checkout;
