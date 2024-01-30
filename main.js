import checkout from 'checkout';

function main(history, header_id, graph_id, control_id, sheet_id, gmo_id) {
	for (let i = 0; i < 100; ++i)
		history.push({
			'id': history.length,
			'parent': history[history.length - 1],
			'merge': [],
			'change': [],
			'author': '',
			'description': '',
			'timestamp': history.length
		});

	let view_header = document.getElementById(header_id);
	let view_graph = document.getElementById(graph_id);
	let view_control = document.getElementById(control_id);
	let view_sheet = document.getElementById(sheet_id);
	let view_gmo = document.getElementById(gmo_id);
	// checkout([history[0]], history, view_header, view_graph, view_control, view_sheet, view_gmo);
	checkout([history[0], null, ...history.slice(2, 5)], history, view_header, view_graph, view_control, view_sheet, view_gmo);
};

export default main;
