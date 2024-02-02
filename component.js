function random_token(length = 32) {
	let R = '';
	let S = '';
	let T = '';
	while (R.length < length)
		R += Math.random().toString(36).substring(2);
	while (S.length < length)
		S += Math.random().toString(2).substring(2);
	for (let i = 0; T.length < length; ++i)
		if (S.charAt(i) == 0)
			T += R.charAt(i);
		else
			T += R.charAt(i).toUpperCase();
	return T;
}

function notify(element, event, detail, options = {}) {
	return element.dispatchEvent(new CustomEvent(event, {detail: detail, ...options}));
}

function listen(event) {
	return (element, callback) => {
		if (callback)
			element.addEventListener(event, callback);
		return element;
	};
}

function bubble(listener, element, event, detail, options = {}) {
	listener(element, () => notify(element, event, detail, {bubbles: true, ...options}));
	return element;
}

function listener_click(element, callback) {
	return listen('click')(element, callback);
}

function listener_toggle(element, callback) {
	return listen('toggle')(element, callback);
}

function listener_change(element, callback) {
	return listen('change')(element, callback);
}

function listener_resize(element, callback) {
	if (callback)
		new ResizeObserver(
			(...args) => {
				if (element.isConnected)
					callback(...args);
			}
		).observe(element);
	return element;
}

function apply_attribute(element, attribute) {
	for (const [name, value] of Object.entries(attribute))
		element.setAttribute(name, value);
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

function apply_label(element1, element2) {
	const id = random_token();
	if (element1.nodeName == 'LABEL') {
		apply_attribute(element1, {for: id});
		apply_attribute(element2, {id: id});
	}
	else {
		apply_attribute(element1, {id: id});
		apply_attribute(element2, {for: id});
	}
	return [element1, element2]
}

function create_range(start, stop, step = 1) {
	return Array.from({length: (stop - start) / step + 1}, (_, i) => start + i * step);
}

function create_grid(row, col, unit = 'auto') {
	return {
		display: 'grid',
		...(row && {'grid-template-rows': row == 'subgrid' ? row : `repeat(${row}, ${unit})`}),
		...(col && {'grid-template-columns': col == 'subgrid' ? col : `repeat(${col}, ${unit})`})
	};
}

function create_area(x, y, w, h) {
	return {
		...(x && {'grid-column-start': x}),
		...(y && {'grid-row-start': y}),
		...(w && {'grid-column-end': `span ${w}`}),
		...(h && {'grid-row-end': `span ${h}`})
	};
}

function replace_content(element, children = [], classes = [], style = {}, attribute = {}) {
	element.replaceChildren(...children);
	return apply_attribute(apply_style(apply_class(element, classes), style), attribute);
}

function replace_row(element, sub_row, children = [], span = true, col = undefined, unit = 'auto', classes = [], style = {}, attribute = {}) {
	if (span) {
		const col_style = create_area(undefined, 1, undefined, sub_row);
		for (let c of children)
			apply_style(c, col_style);
	}
	return replace_content(element, children, classes, {
		...create_grid(sub_row, col, unit), ...style
	}, attribute);
}

function replace_col(element, sub_col, children = [], span = true, row = undefined, unit = 'auto', classes = [], style = [], attribute = {}) {
	if (span) {
		const row_style = create_area(1, undefined, sub_col, undefined);
		for (let c of children)
			apply_style(c, row_style);
	}
	return replace_content(element, children, classes, {
		...create_grid(row, sub_col, unit), ...style
	}, attributes);
}

function create_element(tag, children = [], classes = [], style = {}, attribute = {}) {
	let element = document.createElement(tag);
	if (children.length)
		element.replaceChildren(...children);
	return apply_attribute(apply_style(apply_class(element, classes), style), attribute);
}

function create_text(text) {
	return document.createTextNode(text);
}

function create_div(children = [], classes = [], style = {}, attribute = {}) {
	let div = document.createElement('div');
	for (const c of children)
		div.appendChild(c);
	return apply_attribute(apply_style(apply_class(div, classes), style), attribute);
}

function create_row(sub_row, children = [], span = true, col = 'subgrid', unit = 'auto', classes = [], style = {}, attribute = {}) {
	if (span) {
		const col_style = create_area(undefined, 1, undefined, sub_row);
		for (let c of children)
			apply_style(c, col_style);
	}
	return create_div(children, classes, {
		...create_grid(sub_row, col, unit), ...style
	}, attribute);
}

function create_column(sub_col, children = [], span = true, row = 'subgrid', unit = 'auto', classes = [], style = {}, attribute = {}) {
	if (span) {
		const row_style = create_area(1, undefined, sub_col, undefined);
		for (let c of children)
			apply_style(c, row_style);
	}
	return create_div(children, classes, {
		...create_grid(row, sub_col, unit), ...style
	}, attribute);
}

function create_p(text, classes = [], style = {}, attribute = {}) {
	let p = document.createElement('p');
	const t = document.createTextNode(text);
	p.appendChild(t);
	return apply_attribute(apply_style(apply_class(p, classes), style), attribute);
}

function create_label(text, ...args) {
	return create_element('lable', [create_text(text)], ...args);
}

function create_details(text1, text2, open = false, classes = [], style = {}, attribute = {}) {
	let details = document.createElement('details');
	let summary = document.createElement('summary');
	let p = document.createElement('p');
	const t1 = document.createTextNode(text1);
	const t2 = document.createTextNode(text2);
	if (open)
		details.setAttribute('open', '');
	summary.appendChild(t1);
	p.appendChild(t2);
	details.appendChild(summary);
	details.appendChild(p);
	return apply_attribute(apply_style(apply_class(details, classes), style), attribute);
}

function create_details_proxy(text, surrogate, element, open = false, classes = [], style = {}, attribute = {}) {
	let details = document.createElement('details');
	let summary = document.createElement('summary');
	const t = document.createTextNode(text);
	if (open)
		details.setAttribute('open', '');
	summary.appendChild(t);
	details.appendChild(summary);
	for (let s of surrogate)
		listener_click(s, () => {
			if (details.hasAttribute('open'))
				details.removeAttribute('open');
			else
				details.setAttribute('open', '');
		});
	let link = element.map(e => ({
		element: e,
		display: e.style.display
	}));
	for (let e of element)
		if (!open)
			e.style.display = 'none';
	listener_toggle(details, () => {
		for (let l of link)
			if (details.hasAttribute('open'))
				l.element.style.display = l.display;
			else
				l.element.style.display = 'none';
	});
	return apply_attribute(apply_style(apply_class(details, classes), style), attribute);
}

function create_radio(name, value, text, checked = false, classes = [], style = {}, attribute = {}) {
	let div = document.createElement('div');
	let label = document.createElement('label');
	let input = document.createElement('input');
	const t = document.createTextNode(text);
	input.setAttribute('type', 'radio');
	input.setAttribute('name', name);
	input.setAttribute('value', value);
	if (checked)
		input.setAttribute('checked', '');
	apply_label(label, input);
	div.classList.add('radio');
	label.appendChild(t);
	div.appendChild(label);
	div.appendChild(input);
	return apply_attribute(apply_style(apply_class(div, classes), style), attribute);
}

function create_toggle_radio(name, value, text, checked = false, classes = [], ...args) {
	return create_element(
		'label',
		[
			create_element('input', [], [], {
				display: 'none'
			}, {
				type: 'radio',
				name: name,
				value: value,
				...(checked && {checked: ''}),
			}),
			create_text(text)
		],
		['toggle', 'toggle_radio', ...classes],
		...args
	);
}

function create_toggle_checkbox(name, value, text, checked = false, classes = [], ...args) {
	return create_element(
		'label',
		[
			create_element('input', [], [], {
				display: 'none'
			}, {
				type: 'checkbox',
				name: name,
				value: value,
				...(checked && {checked: ''}),
			}),
			create_text(text)
		],
		['toggle', 'toggle_checkbox', ...classes],
		...args
	);
}

function create_textarea(name, row = undefined, value = undefined, classes = [], style = {}, attribute = {}) {
	let textarea = document.createElement('textarea');
	textarea.setAttribute('name', name);
	if (row)
		textarea.setAttribute('rows', row);
	if (value) {
		const t = document.createTextNode(value);
		textarea.appendChild(t);
	}
	return apply_attribute(apply_style(apply_class(textarea, classes), style), attribute);
}

function create_button(text, classes = [], style = {}, attribute = {}) {
	let button = document.createElement('button');
	const t = document.createTextNode(text);
	button.setAttribute('type', 'button');
	button.appendChild(t);
	return apply_attribute(apply_style(apply_class(button, classes), style), attribute);
}

function create_svg(viewbox, children = [], classes = [], style = [], attribute = {}) {
	let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('viewBox', viewbox.join(' '));
	for (const c of children)
		svg.appendChild(c);
	return apply_attribute(apply_style(apply_class(svg, classes), style), attribute);
}

function create_polyline(points = [], color = 'black', width = 1.0, dasharray = [], attribute = {}) {
	let polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	if (points.length)
		polyline.setAttribute('points', points.join(' '));
	polyline.setAttribute('fill', 'none');
	polyline.setAttribute('stroke', color);
	polyline.setAttribute('stroke-width', width);
	if (dasharray.length)
		polyline.setAttribute('stroke-dasharray', dasharray.join(' '));
	return apply_attribute(polyline, attribute);
}

export {
	random_token,
	notify,
	listen,
	bubble,
	listener_click,
	listener_toggle,
	listener_change,
	listener_resize,
	apply_attribute,
	apply_style,
	apply_class,
	apply_label,
	create_range,
	create_grid,
	create_area,
	replace_content,
	replace_row,
	replace_col,
	create_element,
	create_text,
	create_div,
	create_row,
	create_column,
	create_p,
	create_label,
	create_details,
	create_details_proxy,
	create_radio,
	create_toggle_radio,
	create_toggle_checkbox,
	create_textarea,
	create_button,
	create_svg,
	create_polyline
};
