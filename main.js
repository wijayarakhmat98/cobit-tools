import checkout from 'checkout';
import header from 'header';
import graph from 'graph';
import control from 'control';
import focus from 'focus';
import visual from 'visual';
import sheet from 'sheet';
import gmo from 'gmo';

function main({
	history,
	header_id,
	graph_id,
	control_id,
	focus_id,
	visual_id,
	sheet_id,
	gmo_id
} = {}) {
	const commit_0 = history[0];
	const commit_1 = {
		id: 1,
		parent: commit_0,
		merge: [],
		change: [
			{id: 1, inherit: false, value: 3, note: 'page 13'},
			{id: 2, inherit: false, value: 5, note: 'page 14'},
			{id: 3, inherit: false, value: 1, note: 'page 15'},
			{id: 4, inherit: false, value: 2, note: 'page 16'}
		],
		author: 'Mr A',
		description: 'Document Q',
		timestamp: 1
	};
	const commit_2 = {
		id: 2,
		parent: commit_0,
		merge: [],
		change: [
			{id: 1, inherit: false, value: 5, note: 'page 2'},
			{id: 2, inherit: false, value: 1, note: 'page 1'},
			{id: 3, inherit: false, value: 2, note: 'page 4'},
			{id: 4, inherit: false, value: 4, note: 'page 9'}
		],
		author: 'Ms B',
		description: 'Document R',
		timestamp: 2
	};
	const commit_3 = {
		id: 3,
		parent: commit_0,
		merge: [commit_1, commit_2],
		change: [
			{id: 1, inherit: true, from: commit_2},
			{id: 2, inherit: false, value: 3, note: 'average\nQ-14, R-1'},
			{id: 3, inherit: true, from: commit_1},
			{id: 4, inherit: false, value: 4, note: 'maximum\nQ-16, R-9'}
		],
		author: 'PIC',
		description: 'Document Q, R',
		timestamp: 4
	};
	const commit_4 = {
		id: 4,
		parent: commit_1,
		merge: [],
		change: [
			{id: 1, inherit: false, value: 3, note: 'Q-13, T-82'},
		],
		author: 'Mr A',
		description: 'Document Q, T',
		timestamp: 3
	};
	history.push(commit_1, commit_2, commit_3, commit_4);

	customElements.define('x-header', header);
	customElements.define('x-graph', graph);
	customElements.define('x-control', control);
	customElements.define('x-focus', focus);
	customElements.define('x-visual', visual);
	customElements.define('x-sheet', sheet);
	customElements.define('x-gmo', gmo);

	new checkout({
		history: history,
		header: document.getElementById(header_id),
		graph: document.getElementById(graph_id),
		control: document.getElementById(control_id),
		focus: document.getElementById(focus_id),
		visual: document.getElementById(visual_id),
		sheet: document.getElementById(sheet_id),
		gmo: document.getElementById(gmo_id),
	}).modify();
};

export default main;
