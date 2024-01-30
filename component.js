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

function listener_click(element, callback, context = undefined) {
	if (!context)
		context = element;
	if (callback)
		element.onclick = () => callback(context);
	return element;
}

function listener_change(element, callback, context = undefined) {
	if (!context)
		context = element;
	if (callback)
		element.onchange = () => callback(context);
	return element;
}

function listener_resize(element, callback, context = undefined) {
	if (!context)
		context = element;
	if (callback)
		new ResizeObserver(
			() => {
				if (document.contains(element))
					callback(context);
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

function replace_row(element, sub_row, span, children = [], classes = [], style = {}, attribute = {}) {
	if (span) {
		const col_style = create_area(undefined, 1, undefined, sub_row);
		for (let c of children)
			apply_style(c, col_style);
	}
	return replace_content(element, children, classes, {
		...create_grid(sub_row, undefined), ...style
	}, attribute);
}

function replace_col(element, sub_col, span, children = [], classes = [], style = [], attribute = {}) {
	if (span) {
		const row_style = create_area(1, undefined, sub_col, undefined);
		for (let c of children)
			apply_style(c, row_style);
	}
	return replace_content(element, children, classes, {
		...create_grid(undefined, sub_col), ...style
	}, attributes);
}

function create_div(children = [], classes = [], style = {}, attribute = {}) {
	let div = document.createElement('div');
	for (const c of children)
		div.appendChild(c);
	return apply_attribute(apply_style(apply_class(div, classes), style), attribute);
}

function create_row(sub_row, span, children = [], classes = [], style = {}, attribute = {}) {
	if (span) {
		const col_style = create_area(undefined, 1, undefined, sub_row);
		for (let c of children)
			apply_style(c, col_style);
	}
	return create_div(children, classes, {
		...create_grid(sub_row, 'subgrid'), ...style
	}, attribute);
}

function create_column(sub_col, span, children = [], classes = [], style = {}, attribute = {}) {
	if (span) {
		const row_style = create_area(1, undefined, sub_col, undefined);
		for (let c of children)
			apply_style(c, row_style);
	}
	return create_div(children, classes, {
		...create_grid('subgrid', sub_col), ...style
	}, attribute);
}

function create_p(text, classes = [], style = {}, attribute = {}) {
	let p = document.createElement('p');
	const t = document.createTextNode(text);
	p.appendChild(t);
	return apply_attribute(apply_style(apply_class(p, classes), style), attribute);
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
	let link = {};
	for (let e of element) {
		const token = random_token();
		const display = e.style['display'];
		e.id = token;
		if (!open)
			e.style['display'] = 'none';
		link[token] = display;
	}
	details.addEventListener('toggle', () => {
		for (let [token, display] of Object.entries(link)) {
			let e = document.getElementById(token);
			if (details.hasAttribute('open'))
				e.style['display'] = display;
			else
				e.style['display'] = 'none';
		}
	});
	return apply_attribute(apply_style(apply_class(details, classes), style), attribute);
}

function create_radio(name, value, text, checked = false, callback = undefined, enabled = true, classes = [], style = {}, attribute = {}) {
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
	listener_change(input, callback);
	return apply_attribute(apply_style(apply_class(div, classes), style), attribute);
}

function create_textarea(name, row = undefined, value = undefined, enabled = true, classes = [], style = {}, attribute = {}) {
	let textarea = document.createElement('textarea');
	textarea.setAttribute('name', name);
	if (row)
		textarea.setAttribute('rows', row);
	if (value) {
		const t = document.createTextNode(value);
		textarea.appendChild(t);
	}
	if (!enabled)
		textarea.setAttribute('disabled', '');
	return apply_attribute(apply_style(apply_class(textarea, classes), style), attribute);
}

function create_button(text, callback = undefined, enabled = true, classes = [], style = {}, attribute = {}) {
	let button = document.createElement('button');
	const t = document.createTextNode(text);
	button.setAttribute('type', 'button');
	button.appendChild(t);
	if (callback)
		button.onclick = callback;
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
	listener_click,
	listener_change,
	listener_resize,
	apply_attribute,
	apply_style,
	apply_class,
	create_range,
	create_grid,
	create_area,
	replace_content,
	replace_row,
	replace_col,
	create_div,
	create_row,
	create_column,
	create_p,
	create_details,
	create_details_proxy,
	create_radio,
	create_textarea,
	create_button,
	create_svg,
	create_polyline
};
