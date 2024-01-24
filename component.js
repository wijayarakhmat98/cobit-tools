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

function create_p(text, classes = [], style = {}) {
	let p = document.createElement('p');
	const t = document.createTextNode(text);
	p.appendChild(t);
	return apply_style(apply_class(p, classes), style);
}

function create_details(text1, text2, classes = [], style = {}) {
	let details = document.createElement('details');
	let summary = document.createElement('summary');
	let p = document.createElement('p');
	const t1 = document.createTextNode(text1);
	const t2 = document.createTextNode(text2);
	summary.appendChild(t1);
	p.appendChild(t2);
	details.appendChild(summary);
	details.appendChild(p);
	return apply_style(apply_class(details, classes), style);
}

function create_details_proxy(text, surrogate, element, classes = [], style = {}) {
	let details = document.createElement('details');
	let summary = document.createElement('summary');
	const t = document.createTextNode(text);
	summary.appendChild(t);
	details.appendChild(summary);
	for (let s of surrogate)
		s.onclick = () => {
			if (details.hasAttribute('open'))
				details.removeAttribute('open');
			else
				details.setAttribute('open', '');
		};
	let link = {};
	for (let e of element) {
		const token = random_token();
		const display = e.style['display'];
		e.id = token;
		e.style['display'] = 'none';
		link[token] = display;
	}
	details.addEventListener('toggle', () => {
		for (let [token, display] of Object.entries(link)) {
			console.log(details.cloneNode());
			let e = document.getElementById(token);
			if (details.hasAttribute('open'))
				e.style['display'] = display;
			else
				e.style['display'] = 'none';
		}
	});
	return apply_style(apply_class(details, classes), style);
}

function create_radio(name, value, text, checked = false, callback = undefined, enabled = true, classes = [], style = {}) {
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
	if (callback)
		input.onchange = callback;
	return apply_style(apply_class(div, classes), style);
}

function create_textarea(name, value = undefined, enabled = true, classes = [], style = {}) {
	let textarea = document.createElement('textarea');
	textarea.setAttribute('name', name);
	if (value) {
		const t = document.createTextNode(value);
		textarea.appendChild(t);
	}
	if (!enabled)
		textarea.setAttribute('disabled', '');
	return apply_style(apply_class(textarea, classes), style);
}

export {
	random_token,
	create_range,
	create_grid,
	create_area,
	replace_content,
	create_div,
	create_p,
	create_details,
	create_details_proxy,
	create_radio,
	create_textarea
};
