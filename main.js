import checkout from 'sheet';

function main(history, graph_id, input_id, gmo_id) {
	let view_graph = document.getElementById(graph_id);
	let view_input = document.getElementById(input_id);
	let view_gmo = document.getElementById(gmo_id);
	checkout(history, history[0], false, [], view_input, view_graph, view_gmo);
};

export default main;
