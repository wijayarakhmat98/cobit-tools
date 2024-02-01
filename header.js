import {
	apply_label,
	replace_content,
	create_div,
	create_label,
	create_details_proxy,
	create_textarea
}
from 'component';

function chart_header(view, view_graph) {
	replace_content(view, [
		create_div(
			[
				create_details_proxy('Tree', [], [view_graph], true)
			],
			['flex-start']
		),
		create_div(
			[
				...apply_label(
					create_label('Username'),
					create_textarea('username', 1)
				)
			],
			['flex-end']
		)
	]);
}

export default chart_header;
