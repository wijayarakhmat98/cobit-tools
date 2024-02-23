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
