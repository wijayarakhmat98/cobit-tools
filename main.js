function main() {

	const graph = [
		{'name': 'A', 'parent': []        , 'time':  1 },
		{'name': 'B', 'parent': ['A']     , 'time':  2 },
		{'name': 'C', 'parent': ['B']     , 'time':  3 },
		{'name': 'D', 'parent': ['C']     , 'time':  4 },
		{'name': 'E', 'parent': ['C']     , 'time':  5 },
		{'name': 'F', 'parent': ['D']     , 'time':  6 },
		{'name': 'G', 'parent': ['E']     , 'time':  7 },
		{'name': 'H', 'parent': ['F']     , 'time':  8 },
		{'name': 'I', 'parent': ['G']     , 'time':  9 },
		{'name': 'J', 'parent': ['G']     , 'time': 10 },
		{'name': 'K', 'parent': ['G']     , 'time': 11 },
		{'name': 'L', 'parent': ['H']     , 'time': 12 },
		{'name': 'M', 'parent': ['H']     , 'time': 13 },
		{'name': 'N', 'parent': ['J']     , 'time': 14 },
		{'name': 'O', 'parent': ['N']     , 'time': 15 },
		{'name': 'P', 'parent': ['I', 'M'], 'time': 16 },
		{'name': 'Q', 'parent': ['L', 'O'], 'time': 17 },
		{'name': 'R', 'parent': ['P', 'Q'], 'time': 18 },
		{'name': 'S', 'parent': ['R', 'K'], 'time': 19 },
		{'name': 'T', 'parent': ['S']     , 'time': 20 },
		{'name': 'U', 'parent': ['T']     , 'time': 21 }
	];

	let view_graph = document.getElementById('view graph');

	chart_graph(graph, view_graph);

}
