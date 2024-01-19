function main() {
	let history = [
		{
			'id': 0,
			'parent': null,
			'merge': [],
			'change': [],
			'author': 'System',
			'description': 'Initial commit',
			'timestamp': 0
		}
	];

	let view_graph = document.getElementById('view graph');
	let view_input = document.getElementById('view input');

	checkout(history, history[0], false, [], view_input, view_graph);

	view_gmo('view gmo', 'df.1.');

};
