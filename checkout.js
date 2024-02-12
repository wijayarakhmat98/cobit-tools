import {
	mst_df1
}
from 'master';

import {
	listen
}
from 'component';

class checkout {
	static state_view({commit, focus} = {}) {
		return {
			mode: 'view',
			commit: commit ?? null,
			focus: focus ?? 'DF1'
		};
	}

	static state_modify({parent, merge, alter, context, focus} = {}) {
		return {
			mode: 'modify',
			parent: parent ?? null,
			alter: alter ?? true,
			merge: merge ?? [],
			context: context ?? 'parent',
			focus: focus ?? 'DF1'
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
		this.state = undefined;
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
				this.state.focus = focus
			}
		});
	}

	restore({state, load = true} = {}) {
		this.state = state;
		if (load) {
			if (this.state.mode == 'view')
				this.view();
			if (this.state.mode == 'modify')
				this.modify();
		}
	}

	view({commit, focus} = {}) {
		if (!this.state)
			this.state = checkout.state_view();
		if (this.state.mode == 'modify')
			this.state = checkout.state_view({
				commit: this.state.parent,
				focus: this.state.focus
			});
		if (typeof commit !== 'undefined') this.state.commit = commit;
		if (typeof focus !== 'undefined') this.state.focus = focus;
		this.header.view({view_graph: this.graph});
		this.graph.view({graph: this.history});
		this.control.view();
		this.focus.view({focus: this.state.focus});
		this.sheet.view({
			commit: this.state.commit,
			callback: () => this.gmo(this.gmo)
		});
		this.gmo.view();
	}

	modify({parent, alter, merge, context, focus} = {}) {
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
		this.header.view({view_graph: this.graph});
		this.graph.view({graph: this.history});
		this.control.modify({parent: this.state.parent, alter: this.state.alter, merge: this.state.merge, context: this.state.context});
		this.focus.view({focus: this.state.focus});
		this.sheet.modify({
			parent: this.state.parent,
			alter: this.state.alter,
			merge: this.state.merge,
			callback: () => this.gmo.view()
		});
		this.gmo.view();
	}

	save({} = {}) {
		const new_commit = {
			id: this.history.length,
			parent: this.state.parent,
			merge: this.state.merge,
			change: mst_df1.reduce((c, d) => {
				const v = JSON.parse(document.querySelector(
					`input[name="df1 ${d.id} value"]:checked`
				).value);
				if (v.from != null)
					return c;
				c.push({
					id: d.id,
					inherit: false,
					value: v.value,
					note: document.querySelector(
						`textarea[name="df1 ${d.id} note"]`
					).value
				});
				return c;
			}, []),
			author: document.querySelector('textarea[name="username"]').value,
			description: document.querySelector('textarea[name="description"]').value,
			timestamp: Date.now()
		};
		this.history.push(new_commit);
		this.view({commit: new_commit})
	}
}

export default checkout;
