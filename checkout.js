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
	static state_view(commit) {
		return {
			mode: 'view',
			commit: commit ?? null
		};
	}

	static state_modify(parent, merge, alter, context) {
		return {
			mode: 'modify',
			parent: parent ?? null,
			merge: merge ?? [],
			alter: alter ?? true,
			context: context ?? 'parent'
		};
	}

	constructor(
		history, header, control, graph, focus, visual, sheet, gmo,
		state = undefined
	) {
		this.history = history;
		this.header = header;
		this.control = control;
		this.graph = graph;
		this.focus = focus;
		this.visual = visual;
		this.sheet = sheet;
		this.gmo = gmo;
		this.state = state ?? checkout.state_view();
		if (this.state.mode == 'view')
			this.view();
		else
			this.modify();
		listen('control-modify')(this.control, () => this.modify());
		listen('control-parent')(this.control, () => this.state.context = 'parent');
		listen('control-merge')(this.control, () => this.state.context = 'merge');
		listen('control-save')(this.control, () => this.save());
		listen('control-discard')(this.control, () => this.view());
		listen('graph-select')(this.graph, ({detail: commit}) => {
			if (this.state.mode == 'view') {
				this.view(commit);
			}
			if (this.state.mode == 'modify') {
				if (this.state.context == 'parent')
					this.state.parent = commit;
				if (this.state.context == 'merge') {
					const i = this.state.merge.indexOf(commit);
					if (i == -1)
						this.state.merge.push(commit);
					else
						this.state.merge.splice(i, 1);
				}
				this.modify();
			}
		});
	}

	view(commit) {
		if (this.state.mode == 'modify')
			this.state = checkout.state_view(this.state.parent);
		if (commit) this.state.commit = commit;
		chart_graph(this.graph, this.history);
		chart_sheet(this.sheet, [this.state.commit], () => this.gmo(this.gmo));
		chart_gmo(this.gmo);
		chart_header(this.header, this.graph);
		this.control.view();
	}

	modify(parent, merge, alter, context) {
		if (this.state.mode == 'view')
			this.state = checkout.state_modify(this.state.commit);
		if (parent) this.state.parent = parent;
		if (merge) this.state.merge = merge;
		if (alter) this.state.alter = alter;
		if (context) this.state.context = context;
		chart_graph(this.graph, this.history);
		chart_sheet(this.sheet, [this.state.parent, ...(this.state.alter ? [null] : []), ...this.state.merge], () => chart_gmo(this.gmo));
		chart_gmo(this.gmo);
		chart_header(this.header, this.graph);
		this.control.modify(this.state.parent, this.state.merge, this.state.alter, this.state.context);
	}

	save() {
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
