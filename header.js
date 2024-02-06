import {
	apply_label,
	replace_content,
	create_div,
	create_label,
	create_details_proxy,
	create_textarea
}
from 'component';

function chart_header({view, view_graph} = {}) {
	replace_content({
		element: view,
		children: [
			create_div({
				children: [
					create_details_proxy({summary: 'Tree', surrogate_detail: [view_graph], open: true})
				],
				classes: ['flex-start']
			}),
			create_div({
				children: [
					...apply_label({
						label: create_label({text: 'Username'}),
						input: create_textarea({text: 'username', row: 1}),
						order: 'label'
					})
				],
				classes: ['flex-end']
			})
		]
	});
}

export default chart_header;
