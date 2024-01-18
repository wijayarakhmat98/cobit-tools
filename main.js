function main() {

	let history = [
		{
			'id': 0,
			'parent': null,
			'merge': [],
			'change': trs_df1_baseline.map((d) => ({
				'id': d.id, 'inherit': false, 'value': d.value, 'comment': 'Baseline'
			})),
			'author': 'System',
			'description': 'Initial commit',
			'timestamp': 0
		}
	];

	let view_graph = document.getElementById('view graph');
	let view_input = document.getElementById('view input');

	checkout(history, history[0], view_input, view_graph);

}
