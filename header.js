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
	replace_content(view, [
		create_div({
			children: [
				create_details_proxy({summary: 'Tree', surrogate_detail: [view_graph], open: true})
			],
			classes: ['flex-start']
		}),
		create_div({
			children: [
				...apply_label(
					create_label({text: 'Username'}),
					create_textarea('username', 1)
				)
			],
			classes: ['flex-end']
		})
	]);
}

export default chart_header;
