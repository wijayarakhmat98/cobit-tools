function apply_callback(element, callback) {
	if (callback)
		element.onchange = () => callback(element);
	return element;
}

function apply_style(element, style) {
	for (const [name, value] of Object.entries(style))
		element.style[name] = value;
	return element;
}

function apply_class(element, classes) {
	if (classes.length)
		element.classList.add(...classes);
	return element;
}

function create_range(start, stop, step = 1) {
	return Array.from({'length': (stop - start) / step + 1}, (_, i) => start + i * step);
}

function create_grid(row, col, inline = false) {
	return {
		'display': inline ? 'inline-grid' : 'grid',
		...(row && {'grid-template-rows': row == 'subgrid' ? row : `repeat(${row}, auto)`}),
		...(col && {'grid-template-columns': col == 'subgrid' ? col : `repeat(${col}, auto)`})
	};
}

function create_area(x, y, w, h) {
	return {
		'grid-area': `${y} / ${x} / ${y + h} / ${x + w}`
	};
}

function replace_content(element, children = [], classes = [], style = {}) {
	element.innerHTML = '';
	for (const c of children)
		element.appendChild(c);
	return apply_style(apply_class(element, classes), style);
}

function create_div(children = [], classes = [], style = {}) {
	let div = document.createElement('div');
	for (const c of children)
		div.appendChild(c);
	return apply_style(apply_class(div, classes), style);
}

function create_p(text, classes = []) {
	let p = document.createElement('p');
	const t = document.createTextNode(text);
	p.appendChild(t);
	return apply_class(p, classes);
}

function create_details(text1, text2, classes = []) {
	let details = document.createElement('details');
	let summary = document.createElement('summary');
	let p = document.createElement('p');
	const t1 = document.createTextNode(text1);
	const t2 = document.createTextNode(text2);
	summary.appendChild(t1);
	p.appendChild(t2);
	details.appendChild(summary);
	details.appendChild(p);
	return apply_class(details, classes);
}

function create_radio(name, value, text, checked = false, callback = undefined, enabled = true, classes = []) {
	let div = document.createElement('div');
	let label = document.createElement('label');
	let input = document.createElement('input');
	const t = document.createTextNode(text);
	input.setAttribute('type', 'radio');
	input.setAttribute('name', name);
	input.setAttribute('value', value);
	input.id = `${name} ${value}`;
	if (checked)
		input.setAttribute('checked', '');
	if (!enabled)
		input.setAttribute('disabled', '');
	label.setAttribute('for', `${name} ${value}`);
	div.classList.add('radio');
	label.appendChild(t);
	div.appendChild(label);
	div.appendChild(input);
	apply_callback(input, callback);
	return apply_class(div, classes);
}

function create_textarea(name, value = undefined, enabled = true, classes = []) {
	let textarea = document.createElement('textarea');
	if (name)
		textarea.setAttribute('name', name);
	if (value) {
		const t = document.createTextNode(value);
		textarea.appendChild(t);
	}
	if (!enabled)
		textarea.setAttribute('disabled', '');
	return apply_class(textarea, classes);
}

export {
	create_range,
	create_grid,
	create_area,
	replace_content,
	create_div,
	create_p,
	create_details,
	create_radio,
	create_textarea
};
