import checkout from 'checkout';

function main(history, control_id, graph_id, sheet_id, gmo_id) {
	let view_control = document.getElementById(control_id);
	let view_graph = document.getElementById(graph_id);
	let view_sheet = document.getElementById(sheet_id);
	let view_gmo = document.getElementById(gmo_id);
	checkout([history[0]], history, view_control, view_graph, view_sheet, view_gmo);
};

export default main;
