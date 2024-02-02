import {
	mst_df1
}
from 'master';

import chart_header from 'header';
import chart_graph from 'graph';
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
			merge: merge ?? [],
			alter: alter ?? true,
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
		listen('graph-select')(this.graph, ({detail: commit}) => {
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
		});
		listen('control-modify')(this.control, () => this.modify());
		listen('control-parent')(this.control, () => this.state.context = 'parent');
		listen('control-merge')(this.control, () => this.state.context = 'merge');
		listen('control-save')(this.control, () => this.save());
		listen('control-discard')(this.control, () => this.view());
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
		chart_graph({view: this.graph, graph: this.history});
		chart_sheet({view: this.sheet, commit: [this.state.commit], callback: () => this.gmo(this.gmo)});
		chart_gmo({view: this.gmo});
		chart_header({view: this.header, view_graph: this.graph});
		this.control.view();
	}

	modify({parent, merge, alter, context} = {}) {
		if (this.state.mode == 'view')
			this.state = checkout.state_modify({parent: this.state.commit});
		if (parent) this.state.parent = parent;
		if (merge) this.state.merge = merge;
		if (alter) this.state.alter = alter;
		if (context) this.state.context = context;
		chart_graph({view: this.graph, graph: this.history});
		chart_sheet({view: this.sheet, commit: [this.state.parent, ...(this.state.alter ? [null] : []), ...this.state.merge], callback: () => chart_gmo({view: this.gmo})});
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
