function random_token({length = 32} = {}) {
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

function notify({element, event, detail, options = {}} = {}) {
	return element.dispatchEvent(new CustomEvent(event, {detail: detail, ...options}));
}

function listen({element, event, callback} = {}) {
	if (!element) {
		const _ = ({element, callback} = {}) => {
			if (callback)
				element.addEventListener(event, callback);
			return _;
		};
		return _;
	}
	if (!event) {
		const _ = ({event, callback} = {}) => {
			if (callback)
				element.addEventListener(event, callback);
			return _;
		}
		return _;
	}
	if (callback)
		element.addEventListener(event, callback);
	return element;
}

function bubble({element, listener, event, detail, options = {}} = {}) {
	listener({element: element, callback: () => notify({element: element, event: event, detail: detail, options: {bubbles: true, ...options}})});
	return element;
}

function listener_click({element, callback} = {}) {
	return listen({element: element, event: 'click', callback: callback});
}

function listener_toggle({element, callback} = {}) {
	return listen({element: element, event: 'toggle', callback: callback});
}

function listener_change({element, callback} = {}) {
	return listen({element: element, event: 'change', callback: callback});
}

function listener_resize({element, callback} = {}) {
	if (callback)
		new ResizeObserver(
			(...args) => {
				if (element.isConnected)
					callback(...args);
			}
		).observe(element);
	return element;
}

function smear({
	element,
	replace_children = undefined,
	children = [],
	remove_children = [],
	classes = [],
	remove_classes = [],
	style = {},
	remove_style = [],
	attribute = {},
	remove_attribute = []
} = {}) {
	if (replace_children)
		element.replaceChildren(...replace_children);
	for (const c of children)
		element.appendChild(c);
	for (const c of remove_children)
		element.removeChild(c);
	if (classes.length)
		element.classList.add(...classes);
	if (remove_classes.length)
		element.classList.remove(...remove_classes);
	for (const [name, value] of Object.entries(style))
		element.style[name] = value;
	for (const s of remove_style)
		element.style.removeProperty(s);
	for (const [name, value] of Object.entries(attribute))
		element.setAttribute(name, value);
	for (const a of remove_attribute)
		element.removeAttribute(a);
	return element;
}

function apply_label({label, input, order, token} = {}) {
	const id = token ?? random_token();
	smear({element: label, attribute: {for: id}});
	smear({element: input, attribute: {id: id}});
	return order == 'input' ? [input, label] : [label, input]
}

function create_range({start = 1, stop, step = 1} = {}) {
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

function replace_content({element, children, ...args} = {}) {
	return smear({element: element, replace_children: children, ...args});
}

function replace_row({element, sub_row, col = undefined, children = [], span = true, unit = 'auto', style = {}, ...args} = {}) {
	if (span) {
		const col_style = create_area(undefined, 1, undefined, sub_row);
		for (let c of children)
			smear({element: c, style: col_style});
	}
	return replace_content({
		element: element,
		children: children,
		style: {
			...create_grid(sub_row, col, unit),
			...style
		},
		...args
	});
}

function replace_col({element, row = undefined, sub_col, children = [], span = true, unit = 'auto', style = {}, ...args} = {}) {
	if (span) {
		const row_style = create_area(1, undefined, sub_col, undefined);
		for (let c of children)
			smear({element: c, style: row_style});
	}
	return replace_content({
		element: element,
		children: children,
		style: {
			...create_grid(row, sub_col, unit),
			...style
		},
		...args
	});
}

function create_element({namespace = undefined, tag, ...args} = {}) {
	return smear({
		element: namespace ? document.createElementNS(namespace, tag) : document.createElement(tag),
		...args
	});
}

function create_text({text} = {}) {
	return document.createTextNode(text);
}

function create_div({...args} = {}) {
	return create_element({tag: 'div', ...args});
}

function create_row({sub_row, col = 'subgrid', children = [], span = true, unit = 'auto', style = {}, ...args} = {}) {
	if (span) {
		const col_style = create_area(undefined, 1, undefined, sub_row);
		for (let c of children)
			smear({element: c, style: col_style});
	}
	return create_div({children: children, style: {...create_grid(sub_row, col, unit), ...style}, ...args});
}

function create_column({row = 'subgrid', sub_col, children = [], span = true, unit = 'auto', style = {}, ...args} = {}) {
	if (span) {
		const row_style = create_area(1, undefined, sub_col, undefined);
		for (let c of children)
			smear({element: c, style: row_style});
	}
	return create_div({children: children, style: {...create_grid(row, sub_col, unit), ...style}, ...args});
}

function create_p({text, ...args} = {}) {
	return create_element({tag: 'p', children: [create_text({text: text})], ...args});
}

function create_label({text, ...args} = {}) {
	return create_element({tag: 'label', children: [create_text({text: text})], ...args});
}

function create_details({summary, detail, open = false, attribute = {}, ...args} = {}) {
	return create_element({
		tag: 'details',
		children: [
			create_element({tag: 'summary', children: [create_text({text: summary})]}),
			create_p({text: detail})
		],
		attribute: {
			...(open && {open: ''}),
			...attribute
		},
		...args
	});
}

function create_details_proxy({summary, surrogate_summary = [], surrogate_detail = [], open = false, attribute = {}, ...args} = {}) {
	let primary_summary = create_element({
		tag: 'details',
		children: [
			create_element({tag: 'summary', children: [create_text({text: summary})]})
		],
		attribute: {
			...(open && {open: ''}),
			...attribute
		},
		...args
	});
	for (let ss of surrogate_summary)
		listener_click({
			element: ss,
			callback: () => {
				if (primary_summary.hasAttribute('open'))
					primary_summary.removeAttribute('open');
				else
					primary_summary.setAttribute('open', '');
			}
		});
	surrogate_detail = surrogate_detail.map(sd => ({element: sd}));
	if (!open)
		for (let sd of surrogate_detail) {
			sd.display = sd.element.style.display;
			sd.element.style.display = 'none';
		}
	listener_toggle({
		element: primary_summary,
		callback: () => {
			if (primary_summary.hasAttribute('open'))
				for (let sd of surrogate_detail) {
					if (sd.element.style.display == 'none')
						sd.element.style.display = sd.display;
				}
			else
				for (let sd of surrogate_detail) {
					sd.display = sd.element.style.display;
					sd.element.style.display = 'none';
				}
		}
	});
	return primary_summary;
}

function create_radio({text, checked = false, name, value, classes = [], ...args} = {}) {
	return create_div({
		children: apply_label({
			label: create_label({text: text}),
			input: create_element({
				tag: 'input',
				attribute: {
					type: 'radio',
					...(checked && {checked: ''}),
					...(name && {name: name}),
					...(typeof value !== 'undefined' && {value: value})
				}
			}),
			order: 'label'
		}),
		classes: ['radio', ...classes],
		...args
	});
}

function create_toggle_radio({text, checked = false, name, value, classes = [], ...args} = {}) {
	return create_element({
		tag: 'label',
		children: [
			create_element({
				tag: 'input',
				style: {
					display: 'none'
				},
				attribute: {
					type: 'radio',
					...(checked && {checked: ''}),
					...(name && {name: name}),
					...(typeof value !== 'undefined' && {value: value})
				}
			}),
			create_text({text: text})
		],
		classes: ['toggle', 'toggle_radio', ...classes],
		...args
	});
}

function create_toggle_checkbox({text, checked = false, name, value, classes = [], ...args} = {}) {
	return create_element({
		tag: 'label',
		children: [
			create_element({
				tag: 'input',
				style: {
					display: 'none'
				},
				attribute: {
					type: 'checkbox',
					...(checked && {checked: ''}),
					...(name && {name: name}),
					...(typeof value !== 'undefined' && {value: value})
				}
			}),
			create_text({text: text})
		],
		classes: ['toggle', 'toggle_checkbox', ...classes],
		...args
	});
}

function create_textarea({name, row, value, attribute = {}, ...args} = {}) {
	return create_element({
		tag: 'textarea',
		...(value && {children: [create_text({text: value})]}),
		attribute: {
			...(name && {name: name}),
			...(row && {rows: row}),
			...attribute
		},
		...args
	});
}

function create_button({text, attribute = {}, ...args} = {}) {
	return create_element({
		tag: 'button',
		children: [create_text({text: text})],
		attribute: {
			type: 'button',
			...attribute
		},
		...args
	});
}

function create_svg({viewbox, attribute = {}, ...args} = {}) {
	return create_element({
		namespace: 'http://www.w3.org/2000/svg',
		tag: 'svg',
		attribute: {
			viewBox: viewbox.join(' '),
			...attribute
		},
		...args
	});
}

function create_polyline({points = [], color = 'black', width = 1.0, dasharray = [], attribute = {}, ...args} = {}) {
	return create_element({
		namespace: 'http://www.w3.org/2000/svg',
		tag: 'polyline',
		attribute: {
			...(points.length && {points: points.join(' ')}),
			fill: 'none',
			stroke: color,
			'stroke-width': width,
			...(dasharray.length && {'stroke-dasharray': dasharray.join(' ')}),
			...attribute
		},
		...args
	});
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
	smear,
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
