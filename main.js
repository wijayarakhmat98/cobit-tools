import checkout from 'checkout';

function main(
	history,
	header_id,
	control_id,
	graph_id,
	focus_id,
	visual_id,
	sheet_id,
	gmo_id
) {
	const commit_0 = history[0];
	const commit_1 = {
		'id': 1,
		'parent': commit_0,
		'merge': [],
		'change': [
			{'id': 1, 'inherit': false, 'value': 3, 'note': 'page 13'},
			{'id': 2, 'inherit': false, 'value': 5, 'note': 'page 14'},
			{'id': 3, 'inherit': false, 'value': 1, 'note': 'page 15'},
			{'id': 4, 'inherit': false, 'value': 2, 'note': 'page 16'}
		],
		'author': 'Mr A',
		'description': 'Document Q',
		'timestamp': 1
	};
	const commit_2 = {
		'id': 2,
		'parent': commit_0,
		'merge': [],
		'change': [
			{'id': 1, 'inherit': false, 'value': 5, 'note': 'page 2'},
			{'id': 2, 'inherit': false, 'value': 1, 'note': 'page 1'},
			{'id': 3, 'inherit': false, 'value': 2, 'note': 'page 4'},
			{'id': 4, 'inherit': false, 'value': 4, 'note': 'page 9'}
		],
		'author': 'Ms B',
		'description': 'Document R',
		'timestamp': 2
	};
	const commit_3 = {
		'id': 3,
		'parent': commit_0,
		'merge': [commit_1, commit_2],
		'change': [
			{'id': 1, 'inherit': true, 'from': commit_2},
			{'id': 2, 'inherit': false, 'value': 3, 'note': 'average\nQ-14, R-1'},
			{'id': 3, 'inherit': true, 'from': commit_1},
			{'id': 4, 'inherit': false, 'value': 4, 'note': 'maximum\nQ-16, R-9'}
		],
		'author': 'PIC',
		'description': 'Document Q, R',
		'timestamp': 4
	};
	const commit_4 = {
		'id': 4,
		'parent': commit_1,
		'merge': [],
		'change': [
			{'id': 1, 'inherit': false, 'value': 3, 'note': 'Q-13, T-82'},
		],
		'author': 'Mr A',
		'description': 'Document Q, T',
		'timestamp': 3
	};
	history.push(commit_1, commit_2, commit_3, commit_4);

	let view_header = document.getElementById(header_id);
	let view_control = document.getElementById(control_id);
	let view_graph = document.getElementById(graph_id);
	let view_focus = document.getElementById(focus_id);
	let view_visual = document.getElementById(visual_id);
	let view_sheet = document.getElementById(sheet_id);
	let view_gmo = document.getElementById(gmo_id);
	checkout(
		[history[0]],
		history,
		view_header,
		view_control,
		view_graph,
		view_focus,
		view_visual,
		view_sheet,
		view_gmo
	);
};

export default main;
