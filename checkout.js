import {
	mst_df1
}
from 'master';

import chart_header from 'header';
import chart_sheet from 'sheet';
import chart_gmo from 'gmo';

import {
	listen
}
from 'component';

class checkout {
	static state_view({commit} = {}) {
		return {
			mode: 'view',
			commit: commit ?? null
		};
	}

	static state_modify({parent, merge, alter, context} = {}) {
		return {
			mode: 'modify',
			parent: parent ?? null,
			alter: alter ?? true,
			merge: merge ?? [],
			context: context ?? 'parent'
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
		this.state = checkout.state_view();
		listen({element: this.graph, event: 'graph-select', callback: ({detail: commit} = {}) => {
			if (this.state.mode == 'view') {
				this.view({commit: commit});
			}
			if (this.state.mode == 'modify') {
				if (this.state.context == 'parent')
					this.modify({parent: commit});
				if (this.state.context == 'merge') {
					let merge = this.state.merge;
					const i = merge.indexOf(commit);
					if (i == -1)
						merge.push(commit)
					else
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
	}

	restore({state} = {}) {
		this.state = state;
		if (this.state.mode == 'view')
			this.view();
		if (this.state.mode == 'modify')
			this.modify();
	}

	view({commit} = {}) {
		if (this.state.mode == 'modify')
			this.state = checkout.state_view({commit: this.state.parent});
		if (commit) this.state.commit = commit;
		this.graph.view({graph: this.history});
		chart_sheet({view: this.sheet, commit: this.state.commit === null ? [] : [this.state.commit], callback: () => this.gmo(this.gmo)});
		chart_gmo({view: this.gmo});
		chart_header({view: this.header, view_graph: this.graph});
		this.control.view();
	}

	modify({parent, alter, merge, context} = {}) {
		if (this.state.mode == 'view')
			this.state = checkout.state_modify({parent: this.state.commit});
		if (typeof parent !== 'undefined') this.state.parent = parent;
		if (typeof alter !== 'undefined') this.state.alter = alter;
		if (typeof merge !== 'undefined') this.state.merge = merge;
		if (typeof context !== 'undefined') this.state.context = context;
		this.graph.view({graph: this.history});
		chart_sheet({view: this.sheet, commit: [...(this.state.parent === null ? [] : [this.state.parent]), ...(this.state.alter ? [null] : []), ...this.state.merge], callback: () => chart_gmo({view: this.gmo})});
		chart_gmo({view: this.gmo});
		chart_header({view: this.header, view_graph: this.graph});
		this.control.modify({parent: this.state.parent, alter: this.state.alter, merge: this.state.merge, context: this.state.context});
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
		this.view(new_commit)
	}
}

export default checkout;
